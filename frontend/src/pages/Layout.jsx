import React from 'react'
import "./layout.css"
import MegaMenu from '../Components/menubar/MenuBar'
import Main from "../Components/main/Main"
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'

const Layout = () => {
  return (
    <>
    <div className="page-layout">
      <Header />
      <MegaMenu />
      <Main />        
    </div>
    <Footer />
    </>
  )
}

export default Layout