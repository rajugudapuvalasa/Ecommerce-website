import React from 'react'
import Linker from '../linker/Linker'
import { Outlet } from 'react-router-dom'

const Banners = () => {
  return (
    <div className="banner-box">
      <Linker />
      <Outlet />
    </div>
  )
}

export default Banners