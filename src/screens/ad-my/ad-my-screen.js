import React from "react";
import AdItem from "../../shared/components/ad-item"
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import StatusResolver from "./../../shared/components/statusResolver";
import { connect } from "react-redux";

const MyAdsScreen = ({ dispatch, adsData, adsCount, status, skip, token }) => {
  const { sub } = jwt_decode(token);
  const { id } = sub
  const [isDelAd, setIsDelAD] = React.useState(false)
  const [limit, setLimit] = React.useState(10);
  const [value, setValue] = React.useState(null);

  const onChangeInput = (e) => {
    setValue(e.target.value)
  };

  const onClickSearchAds = () => {
    dispatch({ type: "skip/reset" })
    searchUserAds()
  }

  const onClickDelete = (adId) => {
    console.log("adId", adId)
    const adIdDel = {"_id": adId}
    console.log("adIdDel", adIdDel)
    dispatch({ type: "adUserDelete/request", payload: adIdDel })
    setIsDelAD(!isDelAd)
  }

  const searchUserAds = () => {
    dispatch({ type: "adsUserFind/request", payload: {
      value: value,
      id: id,
      skip: skip,
      limit: limit
    }});
  };

  const onChangeSelect = (e) => {
    setLimit(+e.target.value);
  };

  const onClickNextButton = () => {
    adsCount <= limit ? dispatch({ type: "skip/reset" }) : dispatch({ type: "skip/setNext", payload: limit })
    searchUserAds()
  }
  
  const onClickPrevButton = () => {
    skip < limit ? dispatch({ type: "skip/reset" }) : dispatch({ type: "skip/setPrev", payload: limit })
    searchUserAds()
  }

  React.useEffect(() => {
    searchUserAds()
    return () => dispatch({ type: "findRequest/reset" })
  }, [isDelAd, limit])

  console.log(adsData, "result", adsData !== null && adsData.length !== 0);
  console.log("skip", skip)
  console.log("limit", limit)
  console.log("value", value)


  return (
    <div className="mt-3 flex-grow-1">
      <div className="row input-group m-3 mx-auto w-50">
        <label className="col-sm-6 col-form-label">Select the number of ads on the page</label>
        <div className="col-sm-6">
          <select
            className="form-control"
            onChange={onChangeSelect}
            name="select">
              <option key={10} value={10}>10</option>
              <option key={20} value={20}>20</option>
              <option key={30} value={30}>30</option>
              <option key={50} value={50}>50</option>
              <option key={100} value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="row input-group m-3 justify-content-md-center">
        <input type="search" className="form-control col-5" onChange={onChangeInput} placeholder="Enter ad"/>
          <div className="input-group-append">
            <button className="btn btn-secondary" type="submit" onClick={onClickSearchAds} disabled={status === "searching"}>Search Ad</button>
          </div>
      </div>
      <div className="col-sm-12 my-3">
        <StatusResolver
          noData={adsData !== null && adsData.length === 0}
          status={status}
          content="You have no ads loaded"
          redirectTo="/ad/curUser"
        >
          <ul>
            {adsData === null ? null : 
              adsData.map((ad) => (
                <AdItem key={ad._id} {...ad}>
                  <button type="button"
                    className="btn btn-outline-danger btn-sm mr-3"
                    style={{width:"70px"}}
                    onClick = {() => onClickDelete(ad._id)}
                  >
                  Delete
                  </button>
                  <Link to={`/ad/curUser/edit/${ad._id}`}
                    style={{width:"70px"}}
                    className="btn btn-secondary btn-sm mr-3"
                    role="button">Edit
                  </Link>
                  <Link to={`/ad/curUser/${ad._id}`}
                    style={{width:"70px"}}
                    className="btn btn-outline-secondary btn-sm"
                    role="button">View
                  </Link>
                </AdItem>  
              ))
            }
          </ul>
          <div className=" d-flex justify-content-between w-75 mx-auto">
            <button 
              type="button"
              className="btn btn-outline-info btn-sm m-3"
              style={{width:"70px"}}
              onClick = {onClickPrevButton}
              disabled={skip === 0}
            >
              Prev
            </button>
            <button 
              type="button"
              className="btn btn-outline-info btn-sm m-3"
              style={{width:"70px"}}
              onClick = {onClickNextButton}
              disabled={skip + limit >= adsCount}
            >
              Next
            </button>
          </div>
        </StatusResolver>
      </div>
    </div>
  )
};

const mapStateToProps = (state) => ({
  adsData: state.ads.adsData,
  adsCount: state.ads.adsCount,
  status: state.ads.status,
  skip: state.ads.skip,
  token: state.auth.token,
});

export default connect(mapStateToProps)(MyAdsScreen);
