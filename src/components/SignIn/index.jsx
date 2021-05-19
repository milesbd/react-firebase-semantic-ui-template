import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import {
  Button,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  Icon,
  Divider,
  Container,
} from "semantic-ui-react";
import logo from "../../media/Logo_500.webp";

import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const SignInPage = (props) => {
  return (
    <Container fluid>
      <Segment basic inverted={props.dark} fluid="true">
        <Grid
          textAlign="center"
          style={{ height: "100vh" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" textAlign="center" inverted={props.dark} >
              <Image src={logo} size="medium" /> Sign In
            </Header>
            <Segment stacked inverted={props.dark} >
              <SignInGoogle {...props} />
              <Divider inverted={props.dark} horizontal>
                <Icon name="circle outline" />
              </Divider>
              <PasswordForgetLink {...props} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    </Container>
  );
};

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;
class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    try {
      const socialAuthUser = await this.props.firebase.doSignInWithGoogle();
      let enabled = false;
      const roles = {};
      let isAuthorized = false;

      const whiteListEmails = ["lightspeedhq.com"];
      const emailVerify = (email, acceptList) => {
        const [, domain] = email.split("@");
        return acceptList.includes(domain);
      };
      isAuthorized = emailVerify(socialAuthUser.user.email, whiteListEmails);

      if (isAuthorized) {
        roles[ROLES.STAFF] = ROLES.STAFF;
        enabled = true;
      } else {
        roles[ROLES.UNAUTHORIZED] = ROLES.UNAUTHORIZED;
      }
      let index = socialAuthUser.user.displayName.indexOf(" ");
      let NameArray = [
        socialAuthUser.user.displayName.slice(0, index),
        socialAuthUser.user.displayName.slice(index + 1),
      ];
      const currentUserRef = await this.props.firebase.user(
        socialAuthUser.user.uid
      );
      const currentUserGet = await currentUserRef.get();
      console.log(currentUserRef, currentUserGet);
      let currentUser = await currentUserGet.val();
      console.log(currentUser);
      if (currentUser === null) {
        currentUser = { roles: {}, enabled: false };
        await currentUserRef.set(
          {
            displayName: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            firstName: NameArray[0],
            lastName: NameArray[1],
            phoneNumber: socialAuthUser.user.phoneNumber
              ? socialAuthUser.user.phoneNumber
              : false,
            isAuthorized: isAuthorized,
            enabled: enabled,
            roles: roles,
          },
          (error) => {
            if (error) {
              this.setState({ error });
            } else {
              this.setState({ error: null });
              if (isAuthorized) {
                this.props.history.push(ROUTES.ACCOUNT);
              } else {
                this.props.history.push(ROUTES.UNAUTHORIZED);
              }
            }
          }
        );
      } else {
        this.setState({ error: null });
        this.props.history.push(ROUTES.ACCOUNT);
      }
    } catch (error) {
      if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }
      this.setState({ error });
    }
  };

  render() {
    const { error } = this.state;
    const {dark} = this.props;
    return (
      <>
        <Button
          icon
          basic
          fluid
          size="large"
          labelPosition="left"
          type="submit"
          onClick={this.onSubmit}
          inverted={dark}
        >
          <Icon name="google" />
          Connect with Google
        </Button>
        {error && <Message error content={error.message} />}
      </>
    );
  }
}

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);

export default SignInPage;

export { SignInGoogle };
