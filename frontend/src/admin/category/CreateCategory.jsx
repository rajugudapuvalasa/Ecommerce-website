import React, { useState } from "react";
import "./CreateCategory.css";
import { toast } from "react-hot-toast";
import API_URL from "../../Api";

const CreateCategory = () => {
  const [category, setCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [subInput, setSubInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* ADD SUBCATEGORY */
  const addSubcategory = () => {
    if (!subInput.trim()) return;
    setSubcategories([...subcategories, subInput.trim()]);
    setSubInput("");
  };

  /* DELETE SUBCATEGORY */
  const removeSubcategory = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  /* CREATE CATEGORY */
  const createCategory = async () => {
    if (!category.trim()) {
      toast.error("Category name required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          category_name: category.trim(),
          subcategories,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create category");
        return;
      }

      toast.success("Category created successfully");

      // reset
      setCategory("");
      setSubcategories([]);
      setSubInput("");
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-card">
      <h2>Create Category</h2>

      {/* CATEGORY */}
      <div className="form-group">
        <label>Category Name</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category name"
        />
      </div>

      {/* SUBCATEGORIES */}
      <div className="form-group">
        <label>Subcategories</label>

        <div className="sub-input">
          <input
            type="text"
            value={subInput}
            onChange={(e) => setSubInput(e.target.value)}
            placeholder="Enter subcategory"
          />
          <button onClick={addSubcategory}>Add</button>
        </div>

        <div className="sub-list">
          {subcategories.map((sub, i) => (
            <div key={i} className="sub-item">
              <span>{sub}</span>
              <button
                className="remove-btn"
                onClick={() => removeSubcategory(i)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE BUTTON */}
      <button className="create-btn" onClick={createCategory} disabled={loading}>
        {loading ? "Creating..." : "Create Category"}
      </button>
    </div>
  );
};

export default CreateCategory;
