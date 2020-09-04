import * as actionTypes from "../actions/actionTypes";

const initialValues = {
  fetchingWords: false,
  randomWords: [],
  fetchingMeaning: false,
  meaning: {},
  invalidCred: false,
  loggingIn: false,
};

const reducer = (state = initialValues, action) => {
  switch (action.type) {
    case actionTypes.FETCH_WORDS_INIT:
      return { ...state, fetchingWords: true };
    case actionTypes.FETCH_WORDS_SUCCESS:
      return { ...state, randomWords: action.payload, fetchingWords: false };
    case actionTypes.FETCH_WORDS_FAILURE:
      return { ...state, fetchingWords: false };
    case actionTypes.FETCH_MEANING_INIT:
      return { ...state, fetchingMeaning: true };
    case actionTypes.FETCH_MEANING_SUCCESS:
      return { ...state, fetchingMeaning: false, meaning: action.payload };
    case actionTypes.FETCH_MEANING_FAILURE:
      return { ...state, fetchingMeaning: false };
    case actionTypes.FIREBASE_SIGNIN_INIT:
      return { ...state, invalidCred: false, loggingIn: true };
    case actionTypes.FIREBASE_SIGNIN_SUCCESS:
      return { ...state, invalidCred: false, loggingIn: false };
    case actionTypes.FIREBASE_SIGNIN_FAIL:
      return { ...state, invalidCred: true, loggingIn: false };
    default:
      return state;
  }
};

export default reducer;
