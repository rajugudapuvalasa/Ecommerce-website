import React from 'react'
import Banner from '../../Components/banner/Banner'
import Categories from '../../Components/categories/Categories'
import Product from '../../Components/Product/Product'

const Home = () => {
  return (
        <div className="homepage-layout">
            <Banner />
            <Categories />
            <h2>🛒 Latest Products</h2>
            <Product />
        </div>
  )
}

export default Home