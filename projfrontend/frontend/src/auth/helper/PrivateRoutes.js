/* eslint-disable no-unused-vars */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

//copied from React Router docs - React Training
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
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

export default PrivateRoute;
