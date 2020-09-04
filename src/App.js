import React from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import WordGeneratorComponent from "./components/wordgen/wordgen";
import SavedWordsComponent from "./components/savedWords/savedWords";
import LoginComponent from "./components/login/Login";
import "./App.css";
import { connect } from "react-redux";
import { signout } from "./store/actions";

function App(props) {
  let navbarRight;
  if (props.auth.isLoaded && props.auth.isEmpty) {
  } else {
    navbarRight = (
      <>
        <li className="App__navbar-item App__navbar-item-right">
          <Link
            to={`/saved-words`}
            activeClassName="App__navbar-item App__navbar-link"
          >
            Saved-words
          </Link>
        </li>
        <li className="App__navbar-item App__navbar-item-right">
          <a onClick={() => props.onSignOut()} className="App__navbar-link">
            Sign Out
          </a>
        </li>
      </>
    );
  }
  return (
    <div className="App">
      <ul className="App__navbar">
        <li className="App__navbar-item App__navbar-link App__navbar-brand">
          <Link to={`/`} activeClassName="App__navbar-link App__navbar-brand">
            Randocabulary
          </Link>
          {/* <a href="/" className="App__navbar-link App__navbar-brand">
            Randocabulary
          </a> */}
        </li>
        {navbarRight}
      </ul>
      <Switch>
        <Route path="/word-gen" component={WordGeneratorComponent} />
        <Route path="/saved-words" component={SavedWordsComponent} />
        <Route path="/login" component={LoginComponent} />
        <Redirect from="/" to="/word-gen" />
      </Switch>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignOut: () => dispatch(signout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
