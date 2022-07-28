import { API } from "../../backend";

//creating order
export const createOrder = (userId, authToken, orderData) => {
  return fetch(`${API}order/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ order: orderData }), //because backend expects a JSON from when order is extracted
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
