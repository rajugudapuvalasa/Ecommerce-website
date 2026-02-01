import React, { useState } from "react";
import "./Banners.css";
import { toast } from "react-hot-toast";

const CreateBanner = ({ onCreated }) => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE PREVIEW ================= */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  /* ================= CREATE BANNER ================= */
  const createBanner = async (e) => {
    e.preventDefault();

    if (!title || images.length === 0) {
      toast.error("Title and at least one image required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/banners", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Banner created");
        setTitle("");
        setImages([]);
        setPreviewImages([]);
        onCreated && onCreated();
      } else {
        toast.error(data.message || "Create failed");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-banner">
      <h2>Create Banner</h2>

      <form onSubmit={createBanner} className="create-banner-form">
        <input
          type="text"
          placeholder="Banner Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* PREVIEW */}
        <div className="preview-images">
          {previewImages.map((img, i) => (
            <img src={img} key={i} className="preview-img" />
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Banner"}
        </button>
      </form>
    </div>
  );
};

export default CreateBanner;
