import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "./SingleProduct.css";
import API_URL from "../../Api";
import Loader from "../../Components/Loader/Loader";
import NotFound from "../../Components/Loader/NotFound";
import Reviews from "../../Components/reviews/Reviews";
import Product from "../../Components/Product/Product";
import CategoryProducts from "../../Components/categories/CategoryProducts";
const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ Slider settings (Thumbnail Dots)
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    adaptiveHeight: true,
    dotsClass: "slick-dots slick-thumb",

    customPaging: (i) => (
      <div className="thumb-dot">
        <img
          src={product?.images?.[i]?.url}
          alt="thumb"
          className="thumb-img"
        />
      </div>
    ),
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data.product || data);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const addToCart = async (product) => {
  await fetch(`${API_URL}/api/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      productId: product._id,
      quantity: 1,
      price: product.price
    })
  });
};


  if (loading) return <Loader />;
  if (!product) return <NotFound />;

  return (
    <>
    <div className="single-product-container">
        {/* ⭐ IMAGE SLIDER */}
        <div className="left">
          <div className="image-slider">
            <Slider {...settings}>
              {product.images?.map((img, index) => (
                <div key={index}>
                  <img
                    src={img.url}
                    alt="product"
                    className="single-product-image"
                  />
                </div>
              ))}
            </Slider>
            </div>
            <div className="action-buttons">
              <button className="add-to-cart" onClick={() => addToCart(product)}>Add Cart</button>
              <button className="buy">Buy</button>
            </div>
        </div>

        {/* ⭐ PRODUCT INFO */}
        <div className="single-product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>

          <h3>₹ {product.price}</h3>
          <h4>Stock: {product.stock}</h4><br></br>
          <Reviews />
        </div>
      </div>
      <h2>Similar Products</h2><br />
      <Product />
      </>
  );
};

export default SingleProduct;
