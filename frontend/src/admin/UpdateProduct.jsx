import React, { useState, useEffect } from "react";
import "./CreateProduct.css";

function UpdateProduct({ product, onClose }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // Load product into form
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
      });
      setPreviewImages(product.images?.map(img => img.url) || []);
    }
  }, [product]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const preview = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(preview);
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    images.forEach((img) => formData.append("images", img));

    const res = await fetch(
      `http://localhost:5000/api/product/${product._id}`,
      { method: "PUT", body: formData }
    );

    if (res.ok) {
      alert("Product updated successfully!");
      onClose();
    } else {
      alert("Failed to update");
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Update Product</h2>

      <label>Name</label>
      <input name="name" value={form.name} onChange={handleChange} />

      <label>Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} />

      <label>Price</label>
      <input type="number" name="price" value={form.price} onChange={handleChange} />

      <label>Category</label>
      <input name="category" value={form.category} onChange={handleChange} />

      <label>Brand</label>
      <input name="brand" value={form.brand} onChange={handleChange} />

      <label>Stock</label>
      <input type="number" name="stock" value={form.stock} onChange={handleChange} />

      <label>Images</label>
      <input type="file" multiple onChange={handleImageChange} />

      <div className="image-preview-box">
        {previewImages.map((img, i) => (
          <img key={i} src={img} className="preview-img" alt="" />
        ))}
      </div>

      <button className="btn-submit" type="submit">
        Update
      </button>

      <button className="btn-cancel" onClick={onClose} type="button">
        Cancel
      </button>
    </form>
  );
}

export default UpdateProduct;
