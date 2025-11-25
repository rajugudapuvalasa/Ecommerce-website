import React, { useState } from "react";
import "./CreateProduct.css";

function CreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Image Upload Preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const preview = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(preview);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
     

      if (res.ok) {
        alert("Product added successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error adding product");
    }
  };

  return (
    <div className="product-container">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Create New Product</h2>

        <label>Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter product name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter a short description"
          value={product.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Price (₹)</label>
        <input
          type="number"
          name="price"
          placeholder="Enter price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <input
          type="text"
          name="category"
          placeholder="Eg: Electronics, Fashion, Home"
          value={product.category}
          onChange={handleChange}
          required
        />

        <label>Brand</label>
        <input
          type="text"
          name="brand"
          placeholder="Eg: Samsung, Nike"
          value={product.brand}
          onChange={handleChange}
        />

        <label>Stock</label>
        <input
          type="number"
          name="stock"
          placeholder="Enter available stock"
          value={product.stock}
          onChange={handleChange}
          required
        />

        <label>Product Images</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        {/* Image Preview */}
        <div className="image-preview-box">
          {previewImages.map((img, i) => (
            <img key={i} src={img} alt="preview" className="preview-img" />
          ))}
        </div>

        <button type="submit" className="btn-submit">
          Create Product
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
