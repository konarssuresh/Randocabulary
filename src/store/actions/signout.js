import * as actionTypes from "./actionTypes";
import firebase from "../../firebase";

export const signoutSuccess = (data) => {
  return {
    type: actionTypes.FIREBASE_SIGNOUT_SUCCESS,
    payload: data,
  };
};
export const signoutFail = (data) => {
  return {
    type: actionTypes.FIREBASE_SIGNOUT_FAIL,
    payload: data,
  };
};
export const signout = () => async (dispatch) => {
  try {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: actionTypes.FIREBASE_SIGNOUT_SUCCESS });
      })
      .catch(() => {
        dispatch({
          type: actionTypes.FIREBASE_SIGNOUT_FAIL,
          payload: "...some error message for the user...",
        });
      });
  } catch (err) {
    dispatch(signoutFail("sIgnout failed.. please try again"));
  }
};
