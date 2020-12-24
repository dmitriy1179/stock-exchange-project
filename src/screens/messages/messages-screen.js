import React from "react";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import StatusResolver from "./../../shared/components/statusResolver";
import { connect } from "react-redux";
import avatar from "../../shared/images/avatar.png"

const MessagesScreen = ({ dispatch, messageData, messageGetStatus, lastMessagesData }) => {
  const token = localStorage.getItem("token")
  const { sub } = jwt_decode(token);
  const { id } = sub;

  React.useEffect(() => {
    dispatch({ type: "messageGet/request", payload: id });
    return () => {
      dispatch({ type: "cancelMessageGet/request" })
    }
  }, [])

  console.log(messageData, "messageData", messageData !== null);
  console.log("lastMessagesData", lastMessagesData)

  return ( 
    <div className="mt-3 flex-grow-1">
      <StatusResolver
        noData={messageData !== null && messageData.length === 0}
        status={messageGetStatus}
        content="You have no messages"
      >
        {lastMessagesData === null ? null :
          <div className="w-75 mx-auto">
            <ul className="list-unstyled">
              <li key={-1}>
                <div className="row d-flex p-3">
                  <div className="col-3 font-weight-bold" style={{fontSize:"20px"}}>User</div>
                  <div className="col-7 font-weight-bold" style={{fontSize:"20px"}}>Last message</div>
                  <div className="col-2 font-weight-bold" style={{fontSize:"20px"}}>Created</div>
                </div>
              </li>
              {lastMessagesData === null ? null :
                lastMessagesData.map((elem, index) => (
                  elem.owner._id === id ? 
                    (
                      <li key={index}>
                        <Link to={`/messages/${elem.to._id}`} className="text-reset text-decoration-none">
                          <div className="row d-flex border-top p-3 lastMessage">
                            <div className="col-1 d-flex align-items-center">
                              {elem.to.avatar === null ? 
                                <img src={avatar}
                                  className="img-fluid rounded-circle"
                                  alt="picture" 
                                  style={{objectFit: "cover", width: "50px", height: "50px"}}
                                /> 
                                : 
                                <img src={`http://marketplace.asmer.fs.a-level.com.ua/${elem.to.avatar.url}`}
                                  className="img-fluid rounded-circle"
                                  alt="picture" 
                                  style={{objectFit: "cover", width: "50px", height: "50px"}}
                                />
                              }
                            </div>
                            <div className="col-2 d-flex align-items-center justify-content-center text-break" style={{fontSize:"18px"}}>
                              {elem.to.nick || elem.to.login}
                            </div>
                            <div className="col-7 d-flex align-items-center font-italic text-break text-justify" style={{fontSize:"18px"}}>
                              to: "{elem.text}"
                            </div>
                            <div className="col-2 d-flex align-items-center justify-content-center" style={{fontSize:"14px"}}>
                              {new Date(elem.createdAt/1).toLocaleString()}
                            </div>
                          </div>
                        </Link>
                      </li>  
                    ) :
                    (
                      <li key={index}>
                        <Link to={`/messages/${elem.owner._id}`} className="text-reset text-decoration-none">
                          <div className="row d-flex border-top p-3 lastMessage">
                            <div className="col-1 d-flex align-items-center">
                              {elem.owner.avatar === null ? 
                                <img src={avatar}
                                  className="img-fluid rounded-circle"
                                  alt="picture" 
                                  style={{objectFit: "cover", width: "50px", height: "50px"}}
                                /> 
                                : 
                                <img src={`http://marketplace.asmer.fs.a-level.com.ua/${elem.owner.avatar.url}`}
                                  className="img-fluid rounded-circle"
                                  alt="picture" 
                                  style={{objectFit: "cover", width: "50px", height: "50px"}}
                                />
                              }
                            </div>
                            <div className="col-2 d-flex align-items-center justify-content-center text-break" style={{fontSize:"18px"}}>
                              {elem.owner.nick || elem.owner.login}
                            </div>
                            <div className="col-7 d-flex align-items-center font-italic text-break text-justify" style={{fontSize:"18px"}}>
                              from: "{elem.text}"
                            </div>
                            <div className="col-2 d-flex align-items-center justify-content-center" style={{fontSize:"14px"}}>
                              {new Date(elem.createdAt/1).toLocaleString()}
                            </div>
                          </div>
                        </Link>
                      </li>  
                    ) 
                ))
              }
            </ul>
          </div>
        }
      </StatusResolver>
    </div>
  )
}

const mapStateToProps = (state) => ({
  messageData: state.messages.messageData,
  messageGetStatus: state.messages.messageGetStatus,
  lastMessagesData: state.messages.lastMessagesData
});

export default connect(mapStateToProps)(MessagesScreen);