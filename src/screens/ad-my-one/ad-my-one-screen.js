import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import ViewImages from "../../shared/components/view-images"
import AdItemOne from "../../shared/components/ad-item-one"
import StatusResolver from "../../shared/components/statusResolver"
import camera from "../../shared/images/camera.png"
import { Link, useParams } from "react-router-dom";
import AdComments from "../../shared/components/ad-comments"

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

const deleteAdMutation = gql`
  mutation deleteAD($adId: ID) {
    AdDelete(ad: {
      _id: $adId
     }) {
      _id
    }
  }
`;

const MyAdOneSreen = () => {
  const { _id } = useParams()
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const [isComments, setIsComments] = React.useState(false)

  const onClickDelete = async (adId) => {
    console.log("adId", adId)
    const adIdDel = {"_id": adId}
    console.log("adIdDel", adIdDel)
    try {
      setStatus("searching");
      const res = await API.request(deleteAdMutation, adIdDel)
      console.log("resDel", res)
      setStatus("deleted");
    } catch (e) {
      setStatus("rejected");
    }
  }

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
          redirectTo="/ad/curUser"
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
              <AdItemOne onClick={viewComments} {...result}>
                <button type="button"
                  className="btn btn-outline-danger mr-3"
                  style={{width:"70px"}}
                  onClick = {() => onClickDelete(result._id)}
                >
                  Delete
                </button>
                <Link to={`/ad/curUser/edit/${result._id}`}
                  style={{width:"70px"}}
                  className="btn btn-secondary mr-3"
                  role="button">Edit
                </Link>
              </AdItemOne>
              {isComments ?
                <AdComments id={_id}/>
                : null
              }
            </>
          }
        </StatusResolver>
      </div>
    </div>
  )
}

export default MyAdOneSreen