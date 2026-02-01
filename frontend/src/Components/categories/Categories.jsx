import React from 'react'
import "./All.css"

const Categories = () => {
  return (
    <div className="category">
        <h2>Categories</h2>
        <div className="categories-box">
          <div className="electronics">
            <img src="electronics.jpeg" alt="Electronics" />
          </div>
          <div className="fashion">
            <img src="fashion.jpeg" alt="fashion" />
          </div>
          <div className="books">
            <img src="books.jpg" alt="books" />
          </div>
          <div className="furniture">
            <img src="furniture.jpeg" alt="furniture" />
          </div>
          <div className="appliances">
            <img src="appliances.jpeg" alt="" />
          </div>
        </div>
    </div>
  )
}

export default Categories