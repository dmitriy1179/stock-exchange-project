import { takeLatest, put, call, select } from "redux-saga/effects";
import { getArrImages } from "./selectors"
import { getToken } from "../auth/selectors"

async function imageDataRequest (file, token) {
  const formData = new FormData();
  formData.append("photo", file);
  console.log("file", file);
  const imageJson = await fetch(`http://marketplace.asmer.fs.a-level.com.ua/upload`, {
    method: "POST",
    headers: token
      ? { Authorization: "Bearer " + token }
      : {},
    body: formData
  })
  console.log("imageJson", imageJson)
  const imageData = await imageJson.json();
  console.log("imageDataFetch", imageData)
  return imageData
}

function* getArrayImages(action) {
  yield put ({ type: "request/pending" });
  const token = yield select(getToken);
  const files = action.payload;
  for (let i=0; i < files.length; i++) {
    try {
      const arrImages = yield select(getArrImages)
      console.log("arrImagesSaga", arrImages)
      const imageData = yield call(imageDataRequest, files[i], token);
      console.log("imageData", imageData)
      yield put({ type: "arrImages/formed", payload: arrImages.concat(imageData) });
      if (i === files.length - 1) {
        yield put({ type: "request/finding" });
      } 
    }
    catch(e) {
      yield put({ type: "request/rejected" });
    }
  }
}

export function* getArrImagesSaga() {
  yield takeLatest("getArrImages/request", getArrayImages)
}