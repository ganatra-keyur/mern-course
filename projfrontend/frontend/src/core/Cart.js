/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import PayPalPayment from "./PayPalPayment";
import StripeCheckout from "./StripeCheckout";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    return (
      <div>
        <h2>Your Cart</h2>
        {products.map((product, index) => {
          return (
            <Card
              key={index}
              product={product}
              removeFromCart={true}
              addtoCart={false}
              setReload={setReload} //sending this reload data to card component
              reload={reload} //since card needs to be updated. Card expects reload data
            />
          );
        })}
      </div>
    );
  };

  const loadCheckout = () => {
    return (
      <div>
        <h2>Checkout Details here...</h2>
      </div>
    );
  };

  return (
    <Base title="Cart Page" description="Ready to Checkout...">
      <div className="row">
        <div className="col-4 text-center">
          {/* if cart empty, conditional rendering */}
          {products.length > 0 ? (
            loadAllProducts(products)
          ) : (
            <h3>Cart Empty</h3>
          )}
        </div>
        {products.length > 0 ? (
          <div className="col-8">
            <StripeCheckout products={products} setReload={setReload} />
            <br /> <h3>Or..</h3>
            <PayPalPayment products={products} setReload={setReload} />
          </div>
        ) : (
          <h3>Add Products to Cart!</h3>
        )}
      </div>
    </Base>
  );
};

export default Cart;
