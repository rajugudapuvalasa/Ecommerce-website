import React from 'react'

const CartButton = () => {
    const addToCart = async (product) => {
  await fetch("http://localhost:5000/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: product._id,
      quantity: 1,
      price: product.price
    })
  });
};

  return (
    <div className="cart-btn">
        <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  )
}

export default CartButton