import React from 'react'
import "./home.css"
import Banner from '../../Components/banner/Banner'
import Product from "../../Components/Product/Product"
import Categories from '../../Components/categories/Categories'
const Home = () => {
  return (
    <>
        <div className="homepage-layout">
            <Banner />
            <Categories />
            <h2>🛒 Latest Products</h2>
            <Product />
        </div>
    </>
  )
}

export default Home