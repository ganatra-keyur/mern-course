/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loadCart, emptyCart } from "./helper/cartHelper";
import { generateToken, processPayment } from "./helper/paypalpaymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import DropIn from "braintree-web-drop-in-react";

const PayPalPayment = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {}, //for drop in, refer braintree dropin NPM
    // This instance is where API talks with Braintree and gets us the nonce
  });

  // const { userId, authToken } = isAuthenticated();
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const authToken = isAuthenticated() && isAuthenticated().authToken;

  //here we are directly now using generate token and calling it in a new method
  //becuase we need to use this in useEffect
  // & since the method is in another file, it will again and again keep on calling this
  //calling this funtion in a new function in this file will prevent that

  const getmeToken = (userId, token) => {
    generateToken(userId, token).then((data) => {
      // console.log("INFO: ", data);
      if (data && data.error) {
        setData({ ...data, error: data.error });
      } else {
        const clientToken = data.clientToken;
        setData({ clientToken });
      }
    });
  };

  const showDropIn = () => {
    return (
      <div>
        {data.clientToken !== null && products.length > 0 ? (
          <div className="row">
            <div className="col-8">
              <DropIn
                options={{ authorization: data.clientToken }}
                onInstance={(instance) => (data.instance = instance)}
              />
              <button className="btn btn-warning" onClick={onPurchase}>
                Buy Now
              </button>
            </div>
          </div>
        ) : (
          <h3>Please Login or Add Products to Cart</h3>
        )}
      </div>
    );
  };

  const onPurchase = () => {
    setData({ loading: true });
    let nonce;
    let getNonce = data.instance.requestPaymentMethod().then((info) => {
      nonce = info.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getFinalAmount(),
      };
      //API call
      processPayment(userId, authToken, paymentData)
        .then((response) => {
          setData({ ...data, success: response.success, loading: false });
          console.log("PAYMENT SUCCESS");

          //creating Order
          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
          };
          createOrder(userId, authToken, orderData);

          //empty the cart
          emptyCart(() => {
            console.log("Did we get a crash?");
          });

          //force reload
          setReload(!reload);
        })
        .catch((err) => {
          setData({ loading: false, success: false });
          console.log("PAYMENT FAILED");
        });
    });
  };

  const getFinalAmount = () => {
    let amount = 0;
    // eslint-disable-next-line array-callback-return
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  useEffect(() => {
    getmeToken(userId, authToken);
  }, []);

  return (
    <div>
      <h3>Complete Payment</h3>
      {showDropIn()}
    </div>
  );
};

export default PayPalPayment;
