import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";
import API from "../../API"


const ProtectedRoute = ({ children, dispatch, redirectTo, isAuth, token, ...rest }) => {

  if (isAuth && localStorage.getItem("token") !== token ) {
    localStorage.setItem("token", token)
  }

  try {
    const decodedHeader = jwt_decode(localStorage.getItem("token"), { header: true });
    console.log("decodedHeader", decodedHeader);
  } catch (e) {
    localStorage.removeItem("token");
    API.setHeader("Authorization", null);
    dispatch({ type: "user/logout" });
    return <Redirect to="/login" />
  }

  console.log("isAuth", isAuth);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

ProtectedRoute.defaultProps = {
  redirectTo: "/login"
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isLoggedIn,
  token: state.auth.token,
});

export default connect(mapStateToProps)(ProtectedRoute);

