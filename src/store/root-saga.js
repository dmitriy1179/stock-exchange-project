import { 
  loginRequestSaga, 
  registrationRequestSaga,
  changePasswordRequestSaga,
} from "./../services/auth/login-sagas"

import {
  findAdsRequestSaga,
  findUserAdsRequestSaga,
  deleteAdRequestSaga
} from "./../services/ads/ads-sagas"

import {
  sendMessageYourselfSaga,
  sendMessageRequestSaga,
  getMessageRequestSaga,
  getOneUserMessageRequestSaga
} from "./../services/messages/messages-sagas"

import { getArrImagesSaga } from "./../services/images/images-saga"

import { all } from "redux-saga/effects";


function* rootSaga() {
  yield all([
    loginRequestSaga(),
    registrationRequestSaga(),
    changePasswordRequestSaga(),
    findAdsRequestSaga(),
    findUserAdsRequestSaga(),
    deleteAdRequestSaga(),
    sendMessageYourselfSaga(),
    sendMessageRequestSaga(),
    getMessageRequestSaga(),
    getOneUserMessageRequestSaga(),
    getArrImagesSaga()
  ]);
}

export default rootSaga


