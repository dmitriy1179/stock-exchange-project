import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import jwt_decode from "jwt-decode";
import avatar from "../../shared/images/avatar.png"
import { Link } from "react-router-dom";
import StatusResolver from "./../../shared/components/statusResolver"
import { connect } from "react-redux";

const userData = gql`
  query userFind($query: String) {
    UserFind(query: $query) {
      _id
      createdAt
      login
      nick
      avatar {
        _id
        url
      }
      incomings {
        _id
        owner {
          _id
        }
      }
      phones
      addresses 
    }
  }
`;

const deleteAccountMutation = gql`
  mutation deleteAccount($id: String) {
    UserDelete(user: {
      _id: $id
     }) {
      _id
    }
  }
`;

const HomeScreen = ({ dispatch, token }) => {
  const { sub } = jwt_decode(token);
  const { id } = sub
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  const searchUserData = () => {
    try {
      setStatus("searching");
      API.request(userData, {
        query: JSON.stringify([
          {
            _id: id
          }
        ])
      }).then((res) => {
        console.log("res", res)
        setResult(res.UserFind[0]);
        setStatus("resolved");
      });
    } catch (e) {
        setStatus("rejected");
    }  
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    try {
      setStatus("searching");
      const res = await API.request(deleteAccountMutation, { _id: id });
      console.log("resDel", res);
      localStorage.removeItem("token");
      API.setHeader("Authorization", null);
      dispatch({ type: "user/logout" });
    } catch (e) {
      setStatus("rejected");
    }     
   }

  React.useEffect(() => {
    searchUserData()
  }, [])

  console.log(result, "result", result !== null && result.length !== 0);

  return (
    <div className="mt-3 flex-grow-1">
      <StatusResolver
        noData={result !== null && result.length === 0}
        status={status}
      >
        {result === null ? null : 
          <div className="border rounded my-5 mx-auto w-75 p-3 d-flex bg-light">
            <div className="mr-3 align-self-center" style={{width:"400px", height:"300px"}}>
              {result.avatar === null ? 
                <img src={avatar}
                  className="rounded w-100 h-100"
                  alt="picture" 
                /> 
                : 
                <img src={`http://marketplace.asmer.fs.a-level.com.ua/${result.avatar.url}`}
                  className="rounded w-100 h-100"
                  alt="picture" 
                  style={{objectFit: "fill"}}
                />
              }
            </div>
            <div className="w-100 d-flex flex-column border rounded bg-white" style={{fontSize: "2rem"}}>
              <div className="d-flex">
                <div className="mt-1 ml-3">
                  Login:
                </div>
                <div className="mt-1 mx-2 font-italic">
                  {result.login}
                </div>
              </div>
              <div className="d-flex">
                <div className="ml-3">
                  Nick:
                </div>
                <div className="mx-2 font-italic">
                  {result.nick}
                </div>
              </div>
              <div className="d-flex" style={{fontSize: "1.5rem"}}>
                <div className="ml-3">
                  Phones:
                </div>
                <div className="font-italic text-justify text-break mr-2">
                  {result.phones === null ? null :
                    (result.phones.length === 0 ? null :
                      result.phones.map((phone, index) => (
                        index === 0 ? <span key={index} className="ml-2">{phone}</span>
                        : <span key={index} className="ml-1">, {phone}</span>
                      ))
                    )
                  }
                </div>
              </div>
              <div className="d-flex" style={{fontSize: "1.5rem"}}>
                <div className="ml-3">
                  Addresses:
                </div>
                <div className="font-italic text-justify text-break mr-2">
                  <ul>
                    {result.addresses === null ? null :
                      (result.addresses.length === 0 ? null :
                        result.addresses.map((address, index) => (
                          index === result.addresses.length-1 ? <li key={index} className="ml-2 text-break">{address}</li>
                          : <li key={index} className="ml-2 text-break">{address};</li>
                        ))
                      )
                    }
                  </ul>
                </div>
              </div>
              <div className="d-flex" style={{fontSize: "1rem"}}>
                <div className="ml-3">
                  Account created:
                </div>
                <div className="ml-2 font-italic">
                  {new Date(result.createdAt/1).toLocaleDateString()}
                </div>
              </div>
              <div className="d-flex justify-content-end flex-grow-1 m-2 align-items-end">
                  <button type="button"
                    className="btn btn-outline-danger btn-sm mr-3"
                    onClick = {deleteAccount}
                  >
                  Delete Account
                  </button>
                <Link to={`/profile/edit/${id}`}
                  className="btn btn-outline-secondary btn-sm"
                  role="button">Add/change profile's data
                </Link>
              </div>    
            </div>  
          </div>
        }
      </StatusResolver>
    </div> 

  )
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(HomeScreen);
