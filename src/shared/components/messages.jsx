import React from "react";
import StatusResolver from "../components/statusResolver"
import jwt_decode from "jwt-decode";

const AddMessage = ({ dispatch, userId, name, messageSendStatus, isSendMessage, isDisabled, isSendMessageYourself, isMessagesOneUserScreen, token}) => {
  const [values, setValues] = React.useState({"to": {"_id": userId}})
  const textareaElRef = React.useRef(null);
  const { sub } = jwt_decode(token);
  const { id } = sub;

  const onChangeTextMessage = (e) => {
    e.persist()
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value})
    );
    console.log("value", values)
  }

  const sendMessage = (e) => {
    e.preventDefault();
    if (id === userId) {
      dispatch({ type: "messageSend/yourself" })
      textareaElRef.current.value = null;
    } else {
      dispatch({ type: "messageSend/request", payload: values });
      textareaElRef.current.value = null;
    }
  };

  return (
    <div className="border rounded my-2 mx-auto w-75 p-3">
      <form onSubmit={sendMessage}>
        <div className="mt-2 form-group mb-0">
          <textarea
            className="form-control"
            placeholder="Enter message"
            name="text"
            onChange={onChangeTextMessage}
            ref={textareaElRef}
            required
          />
          <div className="d-flex justify-content-end mt-3">
            <button type="submit"
              className="btn btn-outline-success w-25"
              disabled={isDisabled}
            >
              Send message
            </button>
          </div>
        </div> 
      </form>
      <StatusResolver
        status={messageSendStatus}
      >
        {isMessagesOneUserScreen ? null :
          (isSendMessage ?
            <div className="my-3">
              <span className="alert alert-info mb-0">
                The message was successfully sent to the user {name}
              </span> 
            </div> 
            :
            null    
          ||
          isSendMessageYourself ?
            <div className="my-3">
              <span className="alert alert-warning mb-0">
                You cannot send yourself a message
              </span>
            </div>    
            :
            null    
          )
        }  
      </StatusResolver>    
    </div>
  )
}

AddMessage.defaultProps = {
  isMessagesOneUserScreen: false,
};


export default AddMessage