/* eslint-disable no-unused-vars */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

//copied from React Router docs - React Training
const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        // isAuthenticated loads the user object in the browser
        isAuthenticated() && isAuthenticated().user.role === 1 ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default AdminRoute;
