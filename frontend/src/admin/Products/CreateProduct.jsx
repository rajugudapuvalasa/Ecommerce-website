import { useState, useEffect } from "react";
import API_URL from "../../Api";
import ImageUploader from "./ImageUploader";
import { toast } from "react-hot-toast";
import "./CreateProduct.css";
import { useNavigate} from "react-router-dom";


const CreateProduct = ({ onClose }) => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
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

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      const cat = categories.find((c) => c._id === value);
      setSubcategories(cat?.subcategories || []);
      setProduct({ ...product, category: value, subCategory: "" });
      return;
    }

    setProduct({ ...product, [name]: value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.category || !product.subCategory) {
      toast.error("Required fields missing");
      return;
    }

    if (images.length === 0) {
      toast.error("Add at least one image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(product).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append("images", img.file));

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Create failed");

      toast.success("Product created successfully");
      resetProduct();
      onClose && onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetProduct = () =>{
    setProduct({
      name: "",
      description: "",
      brand: "",
      category: "",
      subCategory: "",
      price: "",
      stock: "",
    });
    setImages([]);
    setSubcategories([]);
    
    setTimeout(() => {
      navigate("/dashboard/products/all");
    }, 800);
  }

  /* ================= CANCEL ================= */
  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure,To cancel creating this product?"
    );

    if (!confirmCancel) return;
    toast.success("Cancelled creating product");
    resetProduct()
  };


  return (
    <form className="admin-form" onSubmit={handleSubmit} autoComplete="off">
      <h2>Create Product</h2>

      <input
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
      />

      <input
        name="brand"
        placeholder="Brand"
        value={product.brand}
        onChange={handleChange}
      />

      {/* CATEGORY */}
      <select name="category" value={product.category} onChange={handleChange} required>
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
        value={product.subCategory}
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
        value={product.price}
        onChange={handleChange}
        required
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={product.stock}
        onChange={handleChange}
      />

      {/* IMAGE UPLOADER */}
      <ImageUploader images={images} setImages={setImages} />

      <div className="actions">
        <button type="submit" className="create-btn" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>

        <button type="cancel-btn" className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateProduct;
