import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "./SingleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Slider Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    adaptiveHeight: true,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/product/${id}`);
        const data = await res.json();
        setProduct(data.product || data);
        setLoading(false);
      } catch (error) {
        console.log("Error loading product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (!product) return <h2 className="loading">No Product Found</h2>;

  return (
    <div className="single-product-container">
      <div className="single-product-card">

        {/* IMAGE SLIDER */}
        <div className="image-slider">
          <Slider {...settings}>
            {product.images?.map((img, index) => (
              <div key={index}>
                <img src={img.url} alt="" className="single-product-image" />
              </div>
            ))}
          </Slider>
          <button className="add-to-cart">Add to Cart</button>
          <button className="buy">Buy</button>
        </div>

        {/* PRODUCT INFO */}
        <div className="single-product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h3>₹ {product.price}</h3>
          <h4>Stock: {product.stock}</h4>
        </div>

      </div>
    </div>
  );
};

export default SingleProduct;
