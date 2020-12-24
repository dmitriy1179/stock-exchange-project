const initialImagesState = {
  arrImages: [],
  status: "idle",
};
  
function imagesReducer(state = initialImagesState, action) {
  switch (action.type) {
    case "request/pending":
      return {
        ...state,
        status: "searching"
      };
    case "request/resolved":
      return {
        ...state,
        status: "resolved",
      };
    case "request/rejected":
      return {
        ...state,
        status: "rejected",
      };
    case "request/finding":
      return {
        ...state,
        status: "idle",
      };  
    case "arrImages/formed":
      return {
        ...state,
        arrImages: action.payload
      };
    case "request/reset":
      return {
        ...state,
        ...initialImagesState
      };    
    default:
      return state;
  }
}

export default imagesReducer;