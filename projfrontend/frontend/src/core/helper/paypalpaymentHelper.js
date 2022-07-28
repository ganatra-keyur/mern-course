/* eslint-disable no-unused-vars */
import { API } from "../../backend";

export const generateToken = (userId, authToken) => {
  return fetch(`${API}payment/gettoken/${userId}`, {
    method: "GET",
    headers: {
      Accpet: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const processPayment = (userId, authToken, paymentInfo) => {
  return fetch(`${API}/payment/braintree/${userId}`, {
    method: "POST",
    headers: {
      Accpet: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(paymentInfo),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
