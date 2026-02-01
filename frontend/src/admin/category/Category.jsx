import React from 'react'
import { Outlet } from 'react-router-dom'
import Linker from "../linker/Linker"

const Category = () => {
  return (
    <div className="category-box">
        <Linker />
        <Outlet />
    </div>
  )
}

export default Category