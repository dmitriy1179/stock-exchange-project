import React from "react";
import { Link } from "react-router-dom";
import Logout from "./logout";
import { connect } from "react-redux";

const NavBar = ({ isLoggedIn, isNewUser, dispatch }) => {
  const handleChange = (event) => {
    event.preventDefault()
    dispatch ({ type: "new-user", payload: event.target.value })
    console.log("radio", event.target.value)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="collapse navbar-collapse d-flex justify-content-between">
        <div>
          {isLoggedIn === true ? 
            (<ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  My profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ad/curUser">
                  My ads
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ad/find">
                  Find ad
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ad/post">
                  Post ad
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/messages">
                  Messages
                </Link>
              </li>
            </ul>) : null
          }  
        </div>
        {isLoggedIn === true ? <Logout /> : 
          (<div className="btn-group btn-group-toggle" data-toggle="buttons" >
            <label className={`btn btn-outline-secondary m-3 rounded ${isNewUser === "auth" ? "active" : ""}`}>
              <input type="radio" name="login" value="auth" onChange={handleChange} /> Authorization 
            </label>
            <label className={`btn btn-outline-secondary m-3 rounded ${isNewUser === "reg" ? "active" : ""}`}>
              <input type="radio" name="login" value="reg" onChange={handleChange} /> Registration
            </label>
            <label className={`btn btn-outline-secondary m-3 rounded ${isNewUser === "chng" ? "active" : ""}`}>
              <input type="radio" name="login" value="chng" onChange={handleChange} /> Change password
            </label>
          </div>)
        }
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  isNewUser: state.auth.isNewUser,
});

export default connect(mapStateToProps)(NavBar);

