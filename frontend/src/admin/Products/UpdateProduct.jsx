import { useState, useEffect } from "react";
import API_URL from "../../Api";
import ImageUploader from "./ImageUploader";
import { toast } from "react-hot-toast";
import "./CreateProduct.css";
import { FaTimes } from "react-icons/fa";

const UpdateProduct = ({ product, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    subCategory: "",
    price: "",
    stock: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= INIT DATA ================= */
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        brand: product.brand || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        price: product.price || "",
        stock: product.stock || "",
      });

      // existing images (important)
      setImages(
        product.images?.map((img) => ({
          url: img.url,
          public_id: img.public_id,
          existing: true,
        })) || []
      );
    }
  }, [product]);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);

        const selected = data.find((c) => c._id === product.category);
        setSubcategories(selected?.subcategories || []);
      });
  }, [product.category]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      const cat = categories.find((c) => c._id === value);
      setSubcategories(cat?.subcategories || []);
      setForm({ ...form, category: value, subCategory: "" });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.subCategory) {
      toast.error("Required fields missing");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file); // new image
        } else {
          formData.append("existingImages", JSON.stringify(img)); // old image
        }
      });

      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Product updated successfully");
      onUpdated && onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = () => {
    if (window.confirm("Cancel updating this product?")) {
      toast.success("Update cancelled");
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box large">
        <FaTimes className="close" onClick={onClose} />

        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>Update Product</h2>

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
          />

          {/* CATEGORY */}
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.category}
              </option>
            ))}
          </select>

          {/* SUBCATEGORY */}
          <select
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            required
            disabled={!subcategories.length}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />

          {/* IMAGE UPLOADER */}
          <ImageUploader images={images} setImages={setImages} />

          <div className="actions">
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>

            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
