import React, { Component } from "react";
import { withAuthorization } from "../Session";

import { Header, Icon, Segment, Divider, Button } from "semantic-ui-react";

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null,
  },
  {
    id: "google.com",
    provider: "googleProvider",
  },
];

class LoginManagementBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSignInMethods: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchSignInMethods();
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then((activeSignInMethods) =>
        this.setState({ activeSignInMethods, error: null })
      )
      .catch((error) => this.setState({ error }));
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then((activeSignInMethods) =>
        this.setState({ activeSignInMethods, error: null })
      )
      .catch((error) => this.setState({ error }));
  };

  onSocialLoginLink = (provider) => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  onDefaultLoginLink = (password) => {
    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password
    );

    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  onUnlink = (providerId) => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;
    const { ACCOUNT } = this.props;

    if (activeSignInMethods > 1) {
      return (
        <Segment>
          <Divider hidden />
          <Header as="h2" textAlign="left">
            <Icon size="tiny" name="users" />
            {ACCOUNT.signInMethods}
          </Header>
          <Divider hidden />
          {SIGN_IN_METHODS.map((signInMethod) => {
            const onlyOneLeft = activeSignInMethods.length === 1;
            const isEnabled = activeSignInMethods.includes(signInMethod.id);
            return (
              <Button.Group key={signInMethod.id}>
                {signInMethod.id === "password" ? (
                  <DefaultLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onDefaultLoginLink}
                    onUnlink={this.onUnlink}
                  />
                ) : (
                  <SocialLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onSocialLoginLink}
                    onUnlink={this.onUnlink}
                    ACCOUNT={ACCOUNT}
                  />
                )}
              </Button.Group>
            );
          })}
          {error && error.message}
        </Segment>
      );
    } else {
      return null;
    }
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
  ACCOUNT
}) =>
  isEnabled ? (
    <React.Fragment>
      <Button
        inline
        onClick={() => onUnlink(signInMethod.id)}
        disabled={onlyOneLeft}
      >
        <Icon
          name={signInMethod.id === "google.com" ? "google" : "mail outline"}
        />
        {ACCOUNT.deactivate}
        {signInMethod.id === "password" ? "email & password" : signInMethod.id}
      </Button>
      <Button.Or />
    </React.Fragment>
  ) : (
    <Button onClick={() => onLink(signInMethod.provider)}>
      <Icon
        name={signInMethod.id === "google.com" ? "google" : "mail outline"}
      />
     {ACCOUNT.link + signInMethod.id}
    </Button>
  );

class DefaultLoginToggle extends Component {
  constructor(props) {
    super(props);

    this.state = { passwordOne: "", passwordTwo: "" };
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: "", passwordTwo: "" });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { onlyOneLeft, isEnabled, signInMethod, onUnlink, ACCOUNT } = this.props;

    const { passwordOne, passwordTwo } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return isEnabled ? (
      <React.Fragment>
        <Button
          onClick={() => onUnlink(signInMethod.id)}
          disabled={onlyOneLeft}
        >
          <Icon
            name={signInMethod.id === "google.com" ? "google" : "mail outline"}
          />
          {ACCOUNT.deactivate}
          {signInMethod.id === "password"
            ? "email & password"
            : signInMethod.id}
        </Button>
        <Button.Or />
      </React.Fragment>
    ) : (
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />

        <Button disabled={isInvalid} type="submit">
        {ACCOUNT.link + signInMethod.id}
        </Button>
      </form>
    );
  }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(LoginManagementBase);
