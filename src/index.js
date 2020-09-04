import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import WordGenReducer from "./store/reducers/wordgen";
import { Provider } from "react-redux";
import firebase from "./firebase";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";

const createStoreWithFirebase = compose(reactReduxFirebase(firebase))(
  createStore
);

const reducer = combineReducers({
  wordgen: WordGenReducer,
  firebase: firebaseReducer,
});
const store = createStoreWithFirebase(
  reducer,
  // compose(
  applyMiddleware(thunk)
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
