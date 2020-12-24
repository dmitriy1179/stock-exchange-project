import React from "react";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import StatusResolver from "./../../shared/components/statusResolver";
import { connect } from "react-redux";
import AddMessage from "../../shared/components/messages";

const MessagesOneUserScreen = ({ dispatch, messageData, messageGetStatus,
  messageSendStatus, isSendMessage, isSendMessageYourself, isDisabled, token }) => {
  const { sub } = jwt_decode(token);
  const { id } = sub;
  const { _id } = useParams();

  React.useEffect(() => {
    dispatch({ type: "oneUserMessageGet/request", payload: {
      id: id,
      _id: _id
    }});
    return () => {
      dispatch({ type: "cancelMessageGet/request" })
    }
  }, [])
  
  console.log(messageData, "messageData", messageData !== null);

  return (
    <div className="mt-3 flex-grow-1">
      <StatusResolver status={messageGetStatus}>
        {messageData === null ? null :
          <>
            <h2 className="w-75 mx-auto text-break text-secondary">Correspondence with the user {messageData[0].owner._id === id ?
              messageData[0].to.nick || messageData[0].to.login :
              messageData[0].owner.nick || messageData[0].owner.login
              }
            </h2>
            <div className="border rounded my-3 mx-auto w-75 p-3 d-flex flex-column">
              {messageData.map((message, index) => 
                (message.owner._id === id ?
                  <div key={index} className="row d-flex my-2 px-3 text-success ml-3">
                    <div className="col-auto mt-2 pt-1 ml-3" style={{fontSize:"16px"}}> 
                      Your message:
                    </div> 
                    <div className="col font-italic text-justify p-0 d-flex">
                      <div className="alert alert-success mb-0">
                        <p className="mb-1 text-break">
                          {message.text}
                        </p>
                        <hr className="my-1"></hr>
                        <p style={{fontSize:"12px"}} className="float-right mb-0">
                          {new Date(message.createdAt/1).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div> :
                  <div key={index} className="row d-flex mr-3 my-2 px-3 text-primary">
                    <div className="col-auto text-break text-left mt-2 pt-1" style={{fontSize:"16px"}}>
                      {message.owner.nick || message.owner.login}:
                    </div>
                    <div className="col font-italic text-justify p-0 d-flex mr-3">
                      <div className="alert alert-primary mb-0">
                        <p className="mb-1 text-break">
                          {message.text}
                        </p>
                        <hr className="my-1"></hr>
                        <p style={{fontSize:"12px"}} className="float-right mb-0">
                          {new Date(message.createdAt/1).toLocaleString()}
                        </p>

                      </div>
                    </div>
                  </div>
                )
              )}      
            </div>
            <AddMessage
              userId={_id}
              name={messageData[0].owner._id === id ? 
                messageData[0].to.nick || messageData[0].to.login :
                messageData[0].owner.nick || messageData[0].owner.login}
              messageSendStatus={messageSendStatus}
              isSendMessage={isSendMessage}
              isSendMessageYourself={isSendMessageYourself}
              isDisabled={isDisabled}
              isMessagesOneUserScreen={true}
              token={token}
              dispatch={dispatch}
            />
          </>
        }
      </StatusResolver>
    </div>
  )
}

const mapStateToProps = (state) => ({
  messageData: state.messages.messageData,
  messageGetStatus: state.messages.messageGetStatus,
  messageSendStatus: state.messages.messageSendStatus,
  isSendMessage: state.messages.isSendMessage,
  isSendMessageYourself: state.messages.isSendMessageYourself,
  isDisabled: state.messages.isDisabled,
  token: state.auth.token
});

export default connect(mapStateToProps)(MessagesOneUserScreen);
