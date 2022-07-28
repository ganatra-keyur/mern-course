/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Base from "../core/Base";
import { getAllCategories, createProduct } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper/index";

const AddProduct = () => {
  const { user, authToken } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getRedirect,
    formData,
  } = values;

  const preload = () => {
    getAllCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
        // console.log("CATEGORIES: ", categories);
      }
    });
  };

  //used to preload data on the page
  useEffect(() => {
    preload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //file[0] is the file path
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value); //this passes data to backend
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    createProduct(user._id, authToken, formData)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            photo: "",
            stock: "",
            categories: [],
            loading: false,
            createdProduct: data.name,
            getRedirect: true,
          });
        }
      })
      .catch();
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: createdProduct ? "" : "none" }}
      >
        <h4>{createdProduct} Created Successfully!</h4>
      </div>
    );
  };

  const warningMessage = () => {
    if (error) {
      return <h4 className="text-success">Failed to Create Category!</h4>;
    }
  };

  const createProductForm = () => (
    <form>
      <span>Add Product Photo</span>
      <div className="form-group mt-2">
        <label className="btn btn-block btn-secondary">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="Choose a File"
            className="p-1"
          />
        </label>
      </div>
      <div className="form-group p-3">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group p-3">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group p-3">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group p-3">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          {/* //adding categories via preload  */}
          <option>Category</option>
          {categories &&
            categories.map((categ, index) => {
              return (
                <option key={index} value={categ._id}>
                  {categ.name}
                </option>
              );
            })}
        </select>
      </div>
      <div className="form-group p-3">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-warning text-white m-3"
      >
        Create Product
      </button>
    </form>
  );

  return (
    <Base
      title="Add a Product"
      description="Add a new product to the web application!"
      className="container p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-light mb-3">
        Admin Home
      </Link>
      <div className="row text-white rounded bg-success">
        <div className="col-md-8 offset-md-2 m-5">
          {successMessage()}
          {warningMessage()}
          {createProductForm()}
        </div>
      </div>
    </Base>
  );
};

export default AddProduct;
