import React from "react";
import Logincss from "./login.module.css";
import {
  Button,
  Input,
  Icon,
  Grid,
  Segment,
  Label,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { signin, signInWithGoogle } from "../../store/actions";

const Login = (props) => {
  const [email, setEmail] = React.useState("");
  const [passwd, setPasswd] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSignIn(email, passwd, () => {
      props.history.push("/");
    });
  };

  if (props.auth.uid) {
    props.history.push("/");
  }

  return (
    <div className={Logincss.Login}>
      <form>
        <Segment raised>
          {props.loggingIn ? (
            <Dimmer active={props.loggingIn} inverted>
              {props.loggingIn ? (
                <Loader inverted>Logging in ...</Loader>
              ) : null}
            </Dimmer>
          ) : null}
          <Grid>
            <Grid.Row>
              <h2>Randocabulary</h2>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={1}>
                <Icon name="mail" size="big" />
              </Grid.Column>
              <Grid.Column width={15}>
                <Input
                  fluid
                  type="email"
                  placeholder="abc@xyz.com"
                  value={email}
                  onChange={(v) => setEmail(v.target.value)}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={1}>
                <Icon name="key" size="big" />
              </Grid.Column>
              <Grid.Column width={15}>
                <Input
                  fluid
                  type="password"
                  placeholder="passwd"
                  value={passwd}
                  onChange={(v) => setPasswd(v.target.value)}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Button
                  primary
                  type="submit"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  Log In
                </Button>
              </Grid.Column>
              {/* <Grid.Column width={8}>
                <Button
                  primary
                  type="submit"
                  onClick={(e) =>
                    props.onSignInwithPopup(props.history.push("/"))
                  }
                >
                  Google signin
                </Button>
              </Grid.Column> */}
            </Grid.Row>
            {props.invalidCred ? (
              <Label color="red">Invalid credentials. Please try again</Label>
            ) : null}
          </Grid>
        </Segment>
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (email, passwd, callback) =>
      dispatch(signin(email, passwd, callback)),
    onSignInwithPopup: (callback) => dispatch(signInWithGoogle(callback)),
  };
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    invalidCred: state.wordgen.invalidCred,
    loggingIn: state.wordgen.loggingIn,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
