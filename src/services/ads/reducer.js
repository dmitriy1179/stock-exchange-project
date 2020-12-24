const initialAdsState = {
  adsCount: null,
  adsData: null,
  status: "idle",
  skip: 0,
};
  
function adsReducer(state = initialAdsState, action) {
  switch (action.type) {
    case "findRequest/pending":
      return {
        ...state,
        status: "searching"
      };
    case "findRequest/resolved":
      return {
        ...state,
        adsData: action.payload.adsData,
        adsCount: action.payload.adsCount,
        status: "resolved"
      };
    case "findRequest/rejected":
      return {
        ...state,
        status: "rejected",
      };
    case "findRequest/reset":
      return {
        ...state,
        ...initialAdsState
      };  
    case "skip/reset":
      return {
        ...state,
        skip: 0
      };
    case "skip/setNext":
      return {
        ...state,
        skip: state.skip + action.payload
      };
    case "skip/setPrev":
      return {
        ...state,
        skip: state.skip - action.payload
      };              
    default:
      return state;
  }
}

export default adsReducer;