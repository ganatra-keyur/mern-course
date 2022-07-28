/* eslint-disable no-unused-vars */
import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
//withRouter picks all the links from the Router defined
import { signout, isAuthenticated } from "../auth/helper";

const currentTab = (history, path) => {
  //history comes from Link object
  if (history.location.pathname === path) {
    return { color: "#2ecc72" };
  } else {
    return { color: "#FFFFFF" };
  }
};

const Menu = ({ history }) => {
  return (
    <div>
      <ul className="nav nav-tabs bg-dark">
        <li className="nav-item">
          <Link style={currentTab(history, "/")} className="nav-link" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={currentTab(history, "/cart")}
            className="nav-link"
            to="/cart"
          >
            Cart
          </Link>
        </li>
        {isAuthenticated() && isAuthenticated().user.role === 0 && (
          <li className="nav-item">
            <Link
              style={currentTab(history, "/user/dashboard")}
              className="nav-link"
              to="/user/dashboard"
            >
              Dashboard
            </Link>
          </li>
        )}
        {isAuthenticated() && isAuthenticated().user.role === 1 && (
          <li className="nav-item">
            <Link
              style={currentTab(history, "/admin/dashboard")}
              className="nav-link"
              to="/admin/dashboard"
            >
              A. Dashboard
            </Link>
          </li>
        )}
        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                style={currentTab(history, "/signup")}
                className="nav-link"
                to="/signup"
              >
                SignUp
              </Link>
            </li>
            <li className="nav-item">
              <Link
                style={currentTab(history, "/signin")}
                className="nav-link"
                to="/signin"
              >
                SignIn
              </Link>
            </li>
          </Fragment>
        )}
        {/* conditional rendering */}
        {isAuthenticated() && (
          <li className="nav-item">
            {/* Since signout is a middleware (next()) we can use a callback and perform some operation when calling it */}
            <span
              className="nav-link text-warning"
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            >
              SignOut
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
