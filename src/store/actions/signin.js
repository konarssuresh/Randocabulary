import * as actionTypes from "./actionTypes";
import firebase from "../../firebase";

export const signinSuccess = (data) => {
  return {
    type: actionTypes.FIREBASE_SIGNIN_SUCCESS,
  };
};

export const signInFail = (err) => {
  return {
    type: actionTypes.FIREBASE_SIGNIN_FAIL,
    payload: err,
  };
};

export const signInInit = () => {
  return {
    type: actionTypes.FIREBASE_SIGNIN_INIT,
  };
};

export const signin = (email, passwd, callback) => async (dispatch) => {
  try {
    dispatch(signInInit());
    firebase
      .auth()
      .signInWithEmailAndPassword(email, passwd)
      .then((data) => {
        if (data.user) {
          dispatch({ type: actionTypes.FIREBASE_SIGNIN_SUCCESS });
          callback();
        }
      })
      .catch(() => {
        dispatch({
          type: actionTypes.FIREBASE_SIGNIN_FAIL,
          payload: "Invalid login credentials",
        });
      });
  } catch (err) {
    debugger;
    dispatch(signInFail("Invalid credentials . Try again"));
  }
};

export const signInWithGoogle = (callback) => async (dispatch) => {
  try {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    firebase.auth().useDeviceLanguage();
    provider.setCustomParameters({
      login_hint: "user@example.com",
    });

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((data) => {
        if (data.user) {
          dispatch({ type: actionTypes.FIREBASE_SIGNIN_SUCCESS });
          callback();
        }
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.FIREBASE_SIGNIN_FAIL,
          payload: "Invalid login credentials",
        });
      });
  } catch (err) {
    dispatch({
      type: actionTypes.FIREBASE_SIGNIN_FAIL,
      payload: "Invalid login credentials",
    });
  }
};
