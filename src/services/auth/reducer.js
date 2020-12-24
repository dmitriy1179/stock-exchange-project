const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  isNewUser: "reg",
  token: localStorage.getItem("token"),
  status: "idle",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "login/pending":
      return {
        ...state,
        status: "pending"
      };
    case "login/resolved":
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload,
        status: "resolved"
      };
    case "login/notRegistered":
        return {
          ...state,
          status: "notRegistered"
        };
    case "login/rejected":
      return {
        ...state,
        status: "rejected",
        isLoggedIn: false
      };
    case "registration/isRegistered":
        return {
          ...state,
          status: "isRegistered"
        };
    case "registration/registered":
      return {
        ...state,
        status: "registered"
      };
    case "password/changed":
        return {
          ...state,
          status: "changed"
        };
    case "password/notChanged":
        return {
          ...state,
          status: "notChanged"
        };
    case "new-user":
      return {
        ...state,
        isNewUser: action.payload,
        status: "idle",
      };    
    case "user/logout":
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        status: "idle",
      };
    default:
      return state;
  }
};

export default authReducer;
