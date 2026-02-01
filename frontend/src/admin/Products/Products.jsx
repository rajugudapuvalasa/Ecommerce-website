import React from 'react'
import { Outlet } from 'react-router-dom'
import Linker from '../linker/Linker'
import './products.css'

const Products = () => {
  return (
    <div className="products-box">
      <Linker />
      <Outlet />
    </div>
  )
}

export default Products