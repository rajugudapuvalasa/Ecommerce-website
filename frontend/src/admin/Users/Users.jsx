import React, { useEffect, useState } from "react";
import "./Users.css";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import API_URL from "../../Api";
import { toast } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [editMode, setEditMode] = useState({});
  const [changedUsers, setChangedUsers] = useState({});
  const [loading, setLoading] = useState(false);

  const loggedInUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  /* ================= FETCH USERS ================= */
  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUsers(data.users);
      const roleMap = {};
      data.users.forEach((u) => (roleMap[u._id] = u.role));
      setSelectedRoles(roleMap);
    } catch (err) {
      toast.error(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT CLICK ================= */
  const handleEdit = (id) => {
    setEditMode({ ...editMode, [id]: true });
  };

  /* ================= ROLE CHANGE ================= */
  const handleRoleChange = (id, value) => {
    setSelectedRoles({ ...selectedRoles, [id]: value });
    setChangedUsers({ ...changedUsers, [id]: true });
  };

  /* ================= UPDATE ROLE ================= */
  const updateUserRole = async (id) => {
    if (!changedUsers[id]) return;

    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: selectedRoles[id] }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Role updated successfully");

      // update localStorage if current user
      if (loggedInUserId === id) {
        localStorage.setItem("role", selectedRoles[id]);
        window.dispatchEvent(new Event("tokenChanged"));
      }

      setEditMode({ ...editMode, [id]: false });
      setChangedUsers({ ...changedUsers, [id]: false });
      getUsers();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  /* ================= CANCEL EDIT ================= */
  const cancelEdit = (id, originalRole) => {
    setEditMode({ ...editMode, [id]: false });
    setSelectedRoles({ ...selectedRoles, [id]: originalRole });
    setChangedUsers({ ...changedUsers, [id]: false });
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (id === loggedInUserId) {
      toast.error("You cannot delete yourself");
      return;
    }

    if (!window.confirm("Delete user?")) return;

    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("User deleted");
      getUsers();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) return <p className="loading">Loading users...</p>;

  return (
    <div className="users-container">
      <h2 className="users-title">All Users</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Provider</th>
            <th>Role</th>
            <th>Created</th>
            <th>Action</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isEditing = editMode[user._id];
            const isChanged = changedUsers[user._id];

            return (
              <tr key={user._id} className={isEditing ? "row-editing" : ""}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.provider}</td>

                <td>
                  {!isEditing ? (
                    user.role
                  ) : (
                    <select
                      value={selectedRoles[user._id]}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="ultra-admin">Ultra Admin</option>
                    </select>
                  )}
                </td>

                <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                <td>
                  {!isEditing ? (
                    <button onClick={() => handleEdit(user._id)}>
                      <FaEdit /> Edit
                    </button>
                  ) : (
                    <>
                      {isChanged && (
                        <button onClick={() => updateUserRole(user._id)}>
                          <FaCheck /> Update
                        </button>
                      )}
                      <button
                        onClick={() => cancelEdit(user._id, user.role)}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </>
                  )}
                </td>

                <td>
                  <button onClick={() => deleteUser(user._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
