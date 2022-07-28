import { API } from "../../backend";

//getall products
export const getProducts = () => {
  return fetch(`${API}products`, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
