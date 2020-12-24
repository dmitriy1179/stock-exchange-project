import React from "react";
import Spinner from "./spinner"
import { Redirect } from "react-router-dom";


const StatusResolver = ({ status, noData, redirectTo, content, children }) => {
  if (status === "searching") {
    return <Spinner />;
  }
  if (noData) {
    return <span className="text-info">{content}</span>;
  }
  if (status === "rejected") {
    return <span className="text-danger">Something went wrong</span>;
  }
  if (status === "idle") {
    return null;
  }
  if (status === "resolved") {
    return children;
  }
  if (status === "deleted") {
    return <Redirect to={{ pathname: redirectTo }}/>
  }
};

StatusResolver.defaultProps = {
  noData: false,
  content: "No Data",
};

export default StatusResolver