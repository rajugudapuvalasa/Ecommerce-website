import React from 'react'
import Header from '../Components/header/Header'
import Footer from '../Components/footer/Footer'
import Main from '../Components/main/Main'
import "./layout.css"
import MegaMenu from '../Components/menubar/MenuBar'

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