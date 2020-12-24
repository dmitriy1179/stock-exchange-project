import { takeLatest, put, call } from "redux-saga/effects";
import { gql } from "graphql-request";
import API from "./../../API"

const loginQuery = gql`
  query auth($login: String!, $password: String!) {
    login(login: $login, password: $password) 
  }
`;

async function request (query, values) {
  console.log("API", API)
  const data = await API.request(query, values);
  return data
}

function* loginRequest(action) {
  yield put ({ type: "login/pending" })
  try {
    const { login } = yield call(request, loginQuery, action.payload);
    console.log("login", login);
    if (login === null) {
      yield put({ type: "login/notRegistered" });
    }
    else {
      localStorage.setItem("token", login);
      console.log(localStorage.getItem("token"))
      API.setHeader("Authorization", `Bearer ${login}`);
      yield put({ type: "login/resolved", payload: login });
    }
  }
  catch(e) {
    yield put({ type: "login/rejected" })
  }
}

export function* loginRequestSaga() {
  yield takeLatest("login/request", loginRequest)
}

const createMutation = gql`
  mutation create($login: String!, $password: String!) {
    createUser(login: $login, password: $password) {
      _id
      login
    }
  }
`;

function* registrationRequest(action) {
  yield put ({ type: "login/pending" })
  try {
    const { createUser } = yield call(request, createMutation, action.payload);
    console.log("createUser", createUser);
    if (createUser === null) {
      yield put({ type: "registration/isRegistered" });
    }
    else {
      yield put({ type: "registration/registered" });
    }
  }
  catch(e) {
    yield put({ type: "login/rejected" })
  }
}

export function* registrationRequestSaga() {
  yield takeLatest("registration/request", registrationRequest)
}

const changePasswordMutation = gql`
  mutation change($login: String!, $password: String!, $newPassword: String!) {
    changePassword(login: $login, password: $password, newPassword: $newPassword) {
      _id
      login
    }
  }
`;

function* changePasswordRequest(action) {
  yield put ({ type: "login/pending" })
  try {
    const { changePassword } = yield call(request, changePasswordMutation, action.payload);
    console.log("changePassword", changePassword);
    if (changePassword === null) {
      yield put({ type: "login/notRegistered" });
    }
    else {
      yield put({ type: "password/changed" });
    }
  }
  catch(e) {
    yield put({ type: "login/rejected" })
  }
}

export function* changePasswordRequestSaga() {
  yield takeLatest("changePassword/request", changePasswordRequest)
}
