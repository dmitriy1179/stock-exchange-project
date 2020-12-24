import { combineReducers } from "redux";
import { authReducer } from "./../services/auth";
import { adsReducer } from "./../services/ads";
import { messagesReducer } from "./../services/messages"
import { imagesReducer } from "./../services/images"

export default combineReducers({
  auth: authReducer,
  ads: adsReducer,
  messages: messagesReducer,
  images: imagesReducer
});
