import { takeLatest, put, call, select } from "redux-saga/effects";
import { gql } from "graphql-request";
import API from "./../../API"
import { getSkip } from "./selectors"

const adFind = gql`
  query adFind($query: String) {
    AdFind(query: $query) {
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
      images {
        url
        _id
      }
    }
  }
`;

const adCount = gql`
  query adCount($query: String) {
    AdCount(query: $query) 
  }
`;

const allAdFind = gql`
  query adFind($query: String) {
    AdCount(query: "[{}]") 
    AdFind(query: $query) {
      _id
      owner {
        _id
        login
        nick
      } 
      price
      createdAt
      title
      images {
        url
      }
    }
  }
`;

async function findAllAdsDataRequest (skip, limit) {
  const allAdsData = await API.request(allAdFind, {
    query: JSON.stringify([
      {},
      {
        sort: [{_id: -1}],
        skip: [skip],
        limit: [limit]
      }
    ])
  })
  return allAdsData
};

async function findAdsCountRequest (value) {
  const adsCount = await API.request(adCount, {
    query: JSON.stringify([
      {
        $or: [{title: `/${String(value)}/`}, {description: `/${String(value)}/`}, {tags: `/${String(value)}/`}]  
      }
      ])
  })
  return adsCount
}

async function findAdsDataRequest (value, skip, limit) {
    const adsData = await API.request(adFind, {
      query: JSON.stringify([
        {
          $or: [{title: `/${String(value)}/`}, {description: `/${String(value)}/`}, {tags: `/${String(value)}/`}]  
        },
        {
          sort: [{_id: -1}],
          skip: [skip],
          limit: [limit]
        }
      ])
    })
    return adsData
};

/*function* findAdsRequest(action) {
  yield put ({ type: "findRequest/pending" })
  const skip = yield select(getSkip)
  if (action.payload.value === null) {
    try {
      const { AdCount, AdFind } = yield call(findAllAdsDataRequest, skip, action.payload.limit);
      console.log("AdCount", AdCount);
      console.log("AdFind", AdFind);
      yield put({ type: "findRequest/resolved", payload: {
        adsData: AdFind,
        adsCount: AdCount
      }});
    }
    catch(e) {
      yield put({ type: "findRequest/rejected" });
    }
  } else {
    try {
      const { AdCount } = yield call(findAdsCountRequest, action.payload.value);
      console.log("AdCount", AdCount);
      const { AdFind } = yield call(findAdsDataRequest, action.payload.value, skip, action.payload.limit)
      console.log("AdFind", AdFind);
  
      yield put({ type: "findRequest/resolved", payload: {
        adsData: AdFind,
        adsCount: AdCount
      }});
    }
    catch(e) {
      yield put({ type: "findRequest/rejected" });
    }
  }
}*/

function* findAdsRequest(action) {
  yield put ({ type: "findRequest/pending" })
  const skip = yield select(getSkip)
  if (action.payload.value === null) {
    try {
      const { AdCount, AdFind } = yield call(findAllAdsDataRequest, skip, action.payload.limit);
      console.log("AdCount", AdCount);
      console.log("AdFind", AdFind);
      yield put({ type: "findRequest/resolved", payload: {
        adsData: AdFind,
        adsCount: AdCount
      }});
    }
    catch(e) {
      yield put({ type: "findRequest/rejected" });
    }
  } else {
    try {
      const arrPromise = yield Promise.all([yield call(findAdsCountRequest, action.payload.value), 
        yield call(findAdsDataRequest, action.payload.value, skip, action.payload.limit)]) 
      console.log("arrPromise", arrPromise);
      console.log("AdCount", arrPromise[0].AdCount);
      console.log("AdFind", arrPromise[1].AdFind);
      yield put({ type: "findRequest/resolved", payload: {
        adsData: arrPromise[1].AdFind,
        adsCount: arrPromise[0].AdCount
      }});
    }
    catch(e) {
      yield put({ type: "findRequest/rejected" });
    }
  }
}


export function* findAdsRequestSaga() {
  yield takeLatest("adsFind/request", findAdsRequest)
}

const userAds = gql`
  query adFind($query: String) {
    AdFind(query: $query) {
      _id
      owner {
        _id
        login
        nick 
      } 
      price
      createdAt
      title
      images {
        url
        _id
      }
    }
  }
`;

async function findUserAllAdsCountRequest (id) {
  const adsCount = await API.request(adCount, {
    query: JSON.stringify([
      {
        ___owner: id
      }
      ])
  })
  return adsCount
}

async function findUserAllAdsDataRequest (id, skip, limit) {
  const myAllAdsData = await API.request(userAds, {
    query: JSON.stringify([
      {
        ___owner: id
      },
      {
        sort: [{_id: -1}],
        skip: [skip],
        limit: [limit]
      }
    ])
  })
  return myAllAdsData
};

async function findUserAdsCountRequest (id, value) {
  const adsCount = await API.request(adCount, {
    query: JSON.stringify([
      {
        ___owner: id,
        $or: [{title: `/${String(value)}/`}, {description: `/${String(value)}/`}, {tags: `/${String(value)}/`}]  
      }
      ])
  })
  return adsCount
}

async function findUserAdsDataRequest (id, value, skip, limit) {
  const myAllAdsData = await API.request(userAds, {
    query: JSON.stringify([
      {
        ___owner: id,
        $or: [{title: `/${String(value)}/`}, {description: `/${String(value)}/`}, {tags: `/${String(value)}/`}]  
      },
      {
        sort: [{_id: -1}],
        skip: [skip],
        limit: [limit]
      }
    ])
  })
  return myAllAdsData
};

/*function* findUserAdsRequest(action) {
  yield put ({ type: "findRequest/pending" })
  const skip = yield select(getSkip)
  if (action.payload.value === null) {
    try {
      const { AdCount } = yield call(findUserAllAdsCountRequest, action.payload.id);
      console.log("AdCount", AdCount);
      const { AdFind } = yield call(findUserAllAdsDataRequest, action.payload.id, skip, action.payload.limit);
      console.log("AdFind", AdFind);
      yield put({ type: "findRequest/resolved", payload: {
        adsData: AdFind,
        adsCount: AdCount
      }});
    }
    catch(e) {
      yield put({ type: "findRequest/rejected" });
    }
  } else {
    try {
      const { AdCount } = yield call(findUserAdsCountRequest, action.payload.id, action.payload.value);
      console.log("AdCount", AdCount);
      const { AdFind } = yield call(findUserAdsDataRequest, action.payload.id, action.payload.value, skip, action.payload.limit);
      console.log("AdFind", AdFind);
      yield put({ type: "findRequest/resolved", payload: {
        adsData: AdFind,
        adsCount: AdCount
      }});

    }
    catch(e) {
      yield put({ type: "findRequest/rejected" });
    }
  }
}*/

function* findUserAdsRequest(action) {
  yield put ({ type: "findRequest/pending" })
  const skip = yield select(getSkip)
  if (action.payload.value === null) {
    try {
      const arrPromise = yield Promise.all([
        yield call(findUserAllAdsCountRequest, action.payload.id),
        yield call(findUserAllAdsDataRequest, action.payload.id, skip, action.payload.limit)
      ])
      console.log("arrPromise", arrPromise);
      console.log("AdCount", arrPromise[0].AdCount);
      console.log("AdFind", arrPromise[1].AdFind);
      yield put({ type: "findRequest/resolved", payload: {
        adsData: arrPromise[1].AdFind,
        adsCount: arrPromise[0].AdCount
      }});
    }
    catch(e) {
      yield put({ type: "findRequest/rejected" });
    }
  } else {
    try {
      const arrPromise = yield Promise.all([
        yield call(findUserAdsCountRequest, action.payload.id, action.payload.value),
        yield call(findUserAdsDataRequest, action.payload.id, action.payload.value, skip, action.payload.limit)      ])
      console.log("arrPromise", arrPromise);
      console.log("AdCount", arrPromise[0].AdCount);
      console.log("AdFind", arrPromise[1].AdFind);
       yield put({ type: "findRequest/resolved", payload: {
        adsData: arrPromise[1].AdFind,
        adsCount: arrPromise[0].AdCount
      }});
    }
    catch(e) {
      yield put({ type: "findRequest/rejected" });
    }
  }
}

export function* findUserAdsRequestSaga() {
  yield takeLatest("adsUserFind/request", findUserAdsRequest)
}

const deleteAdMutation = gql`
  mutation deleteAD($adId: ID) {
    AdDelete(ad: {
      _id: $adId
     }) {
      _id
    }
  }
`;

async function deleteUserAdRequest (id) {
  const res = await API.request(deleteAdMutation, id)
  return res
};

function* deleteAdRequest(action) {
  yield put ({ type: "findRequest/pending" })
  try {
    const { AdDelete } = yield call(deleteUserAdRequest, action.payload);
    console.log("AdDelete", AdDelete);
    yield put({ type: "findRequest/resolved", payload: {
      adsData: null,
      adsCount: null
    }});
  }
  catch(e) {
    yield put({ type: "findRequest/rejected" });
  }
}

export function* deleteAdRequestSaga() {
  yield takeLatest("adUserDelete/request", deleteAdRequest)
}


