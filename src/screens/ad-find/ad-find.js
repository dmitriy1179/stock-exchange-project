import React from "react";
import StatusResolver from "./../../shared/components/statusResolver"
import AdItem from "../../shared/components/ad-item"
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const AdFind = ({ dispatch, adsData, adsCount, status, skip }) => {
  const [value, setValue] = React.useState(null);
  const [limit, setLimit] = React.useState(10);

  const onChangeInput = (e) => {
    setValue(e.target.value)
  };

  const onChangeSelect = (e) => {
    setLimit(+e.target.value);
    dispatch({ type: "skip/reset" })
  };

  const searchAds = () => {
    dispatch({ type: "adsFind/request", payload: {
      value: value,
      skip: skip,
      limit: limit
    }});
  };

  const onClickSearchAds = () => {
    dispatch({ type: "skip/reset" })
    searchAds()
  }

  const onClickNextButton = () => {
    adsCount <= limit ? dispatch({ type: "skip/reset" }) : dispatch({ type: "skip/setNext", payload: limit })
    searchAds()
  }
  
  const onClickPrevButton = () => {
    skip < limit ? dispatch({ type: "skip/reset" }) : dispatch({ type: "skip/setPrev", payload: limit })
    searchAds()
  }

  React.useEffect(() => {
    searchAds()
    return () => dispatch ({ type: "findRequest/reset" })
  }, [limit])

  console.log(adsData, "adsData", adsData !== null && adsData.length !== 0);
  console.log("count", adsCount)
  console.log("skip", skip)
  console.log("limit", limit)

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
        >
          <ul>
            {adsData === null ? null : 
              adsData.map((ad) => (
                <AdItem key={ad._id} {...ad}>
                  <Link to={`/ads/otherUser/${ad.owner._id}`}
                    //style={{width:"70px"}}
                    className="btn btn-secondary btn-sm mr-2"
                    role="button">View other ads this user
                  </Link>
                  <Link to={`/ad/otherUser/${ad._id}`}
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
  );
};

const mapStateToProps = (state) => ({
  adsData: state.ads.adsData,
  adsCount: state.ads.adsCount,
  status: state.ads.status,
  skip: state.ads.skip,
});

export default connect(mapStateToProps)(AdFind);
