/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { getCategory, updateCategory } from "./helper/adminapicall";

const UpdateCategory = ({ match }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  //Token is the one we wre using in Postman. It is also returned by this method
  const { user, authToken } = isAuthenticated();

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data && data.error) {
        setError(true);
      } else {
        setName(data.name);
      }
    });
  };

  //used to preload data on the page
  useEffect(() => {
    preload(match.params.categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    return (
      <div className="mt-3">
        <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
          Admin Home
        </Link>
      </div>
    );
  };

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    //Backend API call
    // {name} is written this way bcuz in API we retrun JSON stringify
    updateCategory(match.params.categoryId, user._id, authToken, { name })
      .then((data) => {
        if (data && data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      })
      .catch();
  };

  const sucessMessage = () => {
    if (success) {
      return <h5 className="text-success">Category Updated Successfully!</h5>;
    }
  };
  const warningMessage = () => {
    if (error) {
      return <h5 className="text-success">Failed to Update Category!</h5>;
    }
  };

  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Enter Category</p>
          <input
            type="text"
            className="form-control my-3"
            onChange={handleChange}
            value={name}
            autoFocus
            required
            placeholder="For Eg. Summer"
          />
          <button onClick={onSubmit} className="btn btn-outline-info mb-3">
            Update Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Update Category"
      description="Update a Category for Tshirts"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {sucessMessage()}
          {warningMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
