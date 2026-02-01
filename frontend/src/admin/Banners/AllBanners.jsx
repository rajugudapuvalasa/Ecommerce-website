import React, { useEffect, useState } from "react";
import "./Banners.css";
import { toast } from "react-hot-toast";

const AllBanners = () => {
  const [banners, setBanners] = useState([]);

  /* ================= FETCH BANNERS ================= */
  const fetchBanners = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/banners");
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  /* ================= DELETE BANNER ================= */
  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/banners/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Banner deleted");
        fetchBanners();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  /* ================= SET MAIN BANNER ================= */
  const setMainBanner = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/banners/activate/${id}`,
        { method: "PUT" }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Main banner updated");
        fetchBanners();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="banner-admin-container">
      <h2>All Banners</h2>

      <div className="banner-list">
        {banners.map((banner) => (
          <div key={banner._id} className="banner-card">
            <h4>{banner.title}</h4>

            {/* IMAGES */}
            <div className="banner-images">
              {banner.images.map((img, i) => (
                <img
                  src={img.url}
                  alt="banner"
                  key={i}
                  className="banner-img"
                />
              ))}
            </div>

            <div className="banner-actions">
              <button
                className={banner.isActive ? "active-btn" : "set-active-btn"}
                onClick={() => setMainBanner(banner._id)}
              >
                {banner.isActive ? "Active Banner" : "Set as Main Banner"}
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteBanner(banner._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBanners;
