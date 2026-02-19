import React from "react";
import "./Banner.css";
import Slider from "react-slick";

const Banner = () => {
  const images = [
  "/banner1.jpg",
  "/banner2.jpg",
  "/banner3.jpg",
];

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="banner-slider-container">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="banner-slide">
            <img src={img} alt={`banner-${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
