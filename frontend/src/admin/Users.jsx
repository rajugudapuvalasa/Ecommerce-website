import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/allusers");
      const data = await res.json();

      if (data.users) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {users.map((user) => (
            <div
              key={user._id}
              style={{
                padding: "15px",
                borderRadius: "8px",
                background: "#f5f5f5",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
              }}
            >
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.role && <p><strong>Role:</strong> {user.role}</p>}
              {/* ✔ CreatedAt formatted */}
              {user.createdAt && (
                <p>
                  <strong>Created On:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}{" "}
                  {new Date(user.createdAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
