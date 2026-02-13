import React from "react";
import "./Banner.css";
import Slider from "react-slick";
import banner2 from '../../../public/banner2.jpg';
import banner3 from '../../../public/banner3.jpg';
import banner5 from '../../../public/banner5.jpg';

const Banner = () => {
  const images = [banner3,banner2,banner5]; // add more if you want

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
