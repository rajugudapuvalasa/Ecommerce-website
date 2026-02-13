import React from 'react'
import { Outlet } from 'react-router-dom'
import Linker from '../linker/Linker'
import './Products.css'

const Products = () => {
  return (
    <div className="products-box">
      <Linker />
      <Outlet />
    </div>
  )
}

export default Products