import React, { useEffect, useState } from "react";
import "./all.css";
import { toast } from "react-hot-toast";
import API_URL from "../../Api";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editSubs, setEditSubs] = useState([]);
  const [subInput, setSubInput] = useState("");

  /* FETCH */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* DELETE */
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;

    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      toast.success("Category deleted");
      fetchCategories();
    } else {
      toast.error("Delete failed");
    }
  };

  /* START EDIT */
  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditCategory(cat.category);
    setEditSubs([...cat.subcategories]);
  };

  /* ADD SUB */
  const addSub = () => {
    if (!subInput.trim()) return;
    setEditSubs([...editSubs, subInput.trim()]);
    setSubInput("");
  };

  /* REMOVE SUB */
  const removeSub = (i) => {
    setEditSubs(editSubs.filter((_, index) => index !== i));
  };

  /* UPDATE */
  const updateCategory = async () => {
    const res = await fetch(`${API_URL}/categories/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        category_name: editCategory,
        subcategories: editSubs,
      }),
    });

    if (res.ok) {
      toast.success("Category updated");
      setEditId(null);
      fetchCategories();
    } else {
      toast.error("Update failed");
    }
  };

  return (
    <div className="all-categories">
      <h2>All Categories</h2>
      <div className="category-list">
      {categories.map((cat) => (
        <div key={cat._id} className="category-section">
          {/* EDIT MODE */}
          {editId === cat._id ? (
            <>
              <input
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              />

              <div className="edit-sub">
                <input
                  value={subInput}
                  onChange={(e) => setSubInput(e.target.value)}
                  placeholder="Add subcategory"
                />
                <button onClick={addSub}>Add</button>
              </div>

              <ul>
                {editSubs.map((s, i) => (
                  <li key={i}>
                    {s}
                    <button onClick={() => removeSub(i)}>✖</button>
                  </li>
                ))}
              </ul>

              <div className="actions">
                <button className="update-btn" onClick={updateCategory}>
                  Update
                </button>
                <button onClick={() => setEditId(null)} className="cnl-btn">Cancel</button>
              </div>
            </>
          ) : (
            <>
              {/* VIEW MODE */}
              <h3>{cat.category}</h3>

              <ul>
                {cat.subcategories.map((sub, i) => (
                  <li key={i}>{sub}</li>
                ))}
              </ul>

              <div className="actions">
                <button className="edit-btn" onClick={() => startEdit(cat)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteCategory(cat._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

export default AllCategories;
