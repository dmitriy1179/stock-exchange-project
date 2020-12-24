import React from "react";
import { connect } from "react-redux";
import API from "../../API";

const Logout = ({dispatch}) => {
  const handleclick = () => {
    localStorage.removeItem("token");
    API.setHeader("Authorization", null);
    dispatch({ type: "user/logout" });
  };
  return (
    <div className="m-3">
      <button onClick={handleclick} type="button" className="btn btn-outline-secondary">Log out</button>
    </div>
  );
};

export default connect()(Logout);
