import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import ViewImages from "../../shared/components/view-images"
import AdItemOne from "../../shared/components/ad-item-one"
import StatusResolver from "../../shared/components/statusResolver"
import camera from "../../shared/images/camera.png"
import { useParams } from "react-router-dom";
import AdComments from "../../shared/components/ad-comments";
import AddMessage from "../../shared/components/messages";
import { connect } from "react-redux";

const myAdOne = gql`
  query adFindOne($query: String) {
    AdFindOne(query: $query) {
      _id
      owner {
        _id
        login
        nick 
        phones
        addresses
      } 
      price
      createdAt
      title
      tags
      address
      description
      images {
        url
      }
    }
  }
`;

const OtherAdOneSreen = ({ dispatch, messageSendStatus, isSendMessage, isSendMessageYourself, isDisabled, token}) => {
  const { _id } = useParams()
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const [isComments, setIsComments] = React.useState(false)

  const searchUserAdOne = () => {
    try {
      setStatus("searching");
        API.request(myAdOne, {
          query: JSON.stringify([
            {
              _id: _id
            }
          ])
        }).then((res) => {
          console.log("res", res)
          setResult(res.AdFindOne);
          setStatus("resolved");
      });
    } catch (e) {
        setStatus("rejected");
    }  
  };

  const viewComments = () => {
    setIsComments(!isComments)
  }

  React.useEffect(() => {
    searchUserAdOne()
  }, [])

  console.log(result, "result", result !== null);

  return (
    <div className="mt-3 flex-grow-1">
      <div className="col-sm-12 my-3">
        <StatusResolver
          status={status}
        >
          {result === null ? null : 
            (result.images === null || result.images.length === 0 ?
              <div className="border rounded my-3 mx-auto w-25 p-3">
                <img src={camera}
                  className="img-fluid rounded"
                  alt="picture" 
                />
              </div> :
              (result.images[0].url === null ?
                <div className="border rounded my-3 mx-auto w-25 p-3">
                  <img src={camera}
                    className="img-fluid rounded"
                    alt="picture" 
                  />
                </div> :
                <ViewImages images={result.images.filter(image => image.url !== null)} />
              ) 
            )
          }
          {result === null ? null :
            <>
              <AdItemOne onClick={viewComments} {...result}/>
              {isComments ?
                <AdComments id={_id}/>
                : null
              }
              <AddMessage 
                userId={result.owner._id}
                name={result.owner.nick || result.owner.login}
                messageSendStatus={messageSendStatus}
                isSendMessage={isSendMessage}
                isSendMessageYourself={isSendMessageYourself}
                isDisabled={isDisabled}
                dispatch={dispatch}
                token={token}
              />
            </>
          }

        </StatusResolver>
      </div>
    </div>
  )
}
const mapStateToProps = (state) => ({
  messageSendStatus: state.messages.messageSendStatus,
  isSendMessage: state.messages.isSendMessage,
  isSendMessageYourself: state.messages.isSendMessageYourself,
  isDisabled: state.messages.isDisabled,
  token: state.auth.token
});

export default connect(mapStateToProps)(OtherAdOneSreen);
