import React, { Component } from "react";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import {
  Input,
  Form,
  Header,
  Icon,
  Message,
  Segment,
  Divider,
} from "semantic-ui-react";

const PASSWORD_INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  currentPassword: "",
  success: false,
  error: false,
  loading: false,
};

class ChangePasswordBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...PASSWORD_INITIAL_STATE };
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  componentWillUnmount() {}

  onSubmitPassword = (event, data) => {
    
    const { passwordOne, currentPassword, passwordTwo } = this.state;
    this.setState({ loading: true });
    const doPasswordsMatch = passwordTwo === passwordOne;
    const isNewPassword =
      currentPassword === passwordOne || currentPassword === passwordTwo;
    if (!doPasswordsMatch) {
      this.setState({
        error: { message: "New Passwords must match" },
        loading: false,
      });
    } else if (isNewPassword) {
      this.setState({
        error: {
          message:
            "The new password must be different from your current password",
        },
        loading: false,
      });
    } else {
      const user = this.props.firebase.currentUser();
      const {email} = data;
      const credential = this.props.firebase.EmailAuthProviderCredential(email,passwordOne)

      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
              this.setState({ success: true, loading: false });
              setTimeout(
                () => this.setState({ ...PASSWORD_INITIAL_STATE }),
                2000
              );
            })
            .catch((error) => {
              this.setState({ error: error, loading: false });
            });
        })
        .catch((error) => {
          this.setState({ error: error, loading: false });
        });
    }
    setTimeout(() => this.setState({ error: false, success: false }), 5000);
    event.preventDefault();
  };

  onChange = (event, data) => {
    this.setState({
      [data.name]: data.value,
      error: false,
      success: false,
    });
  };
  render() {
    const {
      passwordOne,
      passwordTwo,
      error,
      loading,
      success,
      currentPassword,
    } = this.state;
    const isPasswordInvalid =
      currentPassword === "" || passwordOne === "" || passwordTwo === "";
    const passwordLengthMatch = passwordOne.length === passwordTwo.length;
    const { dark, authUser, ACCOUNT } = this.props;
    const goolgeUser =
      authUser.providerData.providerId === "google.com" ? true : false;
    return (
      <Segment inverted={dark}>
        <Divider hidden />
        <Header as="h2" textAlign="left" inverted={dark}>
          <Icon size="tiny" name="lock" inverted={dark} />
          {ACCOUNT.updatePassword}
        </Header>
        <Divider hidden />
        {goolgeUser && (
          <Segment inverted={dark} basic padded="very">
            <Message
              style={{ marginLeft: "2em", marginRight: "2em" }}
              floating
              header={ACCOUNT.infoHeader}
              content={ACCOUNT.infoMessage}
            />
          </Segment>
        )}
        {!goolgeUser && (
          <Form
            error={error ? true : false}
            loading={loading}
            onSubmit={this.onSubmitPassword}
            inverted={dark}
            email={authUser.email}
          >
            {error && (
              <Message
                error
                content={error.message}
                style={{ marginLeft: "2em", marginRight: "2em" }}
              />
            )}
            {success && (
              <Message
                positive
                content="Password Changed Successfully"
                style={{ marginLeft: "2em", marginRight: "2em" }}
              ></Message>
            )}
            <Form.Group widths={4}>
              <Form.Field
                control={Input}
                icon="lock"
                iconPosition="left"
                name="currentPassword"
                value={currentPassword}
                onChange={this.onChange}
                placeholder={ACCOUNT.currentPassword}
                disabled={goolgeUser}
                type="password"
              />
              <Form.Field
                control={Input}
                icon="lock"
                iconPosition="left"
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                placeholder={ACCOUNT.newPassword}
                disabled={goolgeUser}
                type="password"
              />
              <Form.Field
                control={Input}
                icon="lock"
                iconPosition="left"
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                disabled={goolgeUser}
                placeholder={ACCOUNT.confirmNewPassword}
              ></Form.Field>
              <Form.Button
                disabled={isPasswordInvalid || !passwordLengthMatch}
                loading={loading}
                color="red"
                type="submit"
                inverted={dark}
                basic={dark}
                content={ACCOUNT.updatePassword}
              />
            </Form.Group>
          </Form>
        )}
      </Segment>
    );
  }
}

const condition = (authUser) => !!authUser;

const ChangePassword = compose(
  withAuthorization(condition),
  withFirebase
)(ChangePasswordBase);

export { ChangePassword };
