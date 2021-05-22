import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  Divider,
  Container,
} from "semantic-ui-react";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import logo from "../../media/Logo_500.webp";
import { SignInGoogle } from "../SignIn";
import TRANSLATIONS from "../../constants/translation";

const SignUpPage = (props) => {
  const { dark, language } = props;
  const { SIGNUP } = TRANSLATIONS[`${language}`];
  return (
    <Segment
      inverted={dark}
      basic
      fluid="true"
      style={{ marginTop: 0, marginBottom: 0 }}
    >
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" textAlign="center" inverted={dark}>
            <Image src={logo} loading="lazy" size="small" alt="Logo" width="33" height="48" />{SIGNUP.header}
          </Header>
          <SignUpForm {...props} />
          <SignUpLink dark={dark} SIGNUP={SIGNUP}  />
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  isAdmin: false,
  organisation: false,
  error: null,
  phoneNumber: "",
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      firstName,
      lastName,
      email,
      passwordOne,
      phoneNumber,
    } = this.state;
    const roles = {};
    roles[ROLES.CUSTOMER] = ROLES.CUSTOMER;
    const adminEmail = new RegExp("@lightspeedhq.com");
    const displayName = `${firstName} ${lastName}`;
    const isnum = /^\d+$/.test(phoneNumber);
    if (!isnum && phoneNumber.length > 0) {
      this.setState({
        error: {
          message: "Please ensure your phone number contains only numbers",
        },
      });
    } else {
      this.props.firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
        .then((authUser) => {
          return this.props.firebase.user(authUser.user.uid).set({
            firstName,
            lastName,
            displayName,
            phoneNumber,
            email,
            isAuthorized:adminEmail.test(email),
            enabled:adminEmail.test(email),
            roles,
          });
        })
        .then(() => {
          return this.props.firebase.updateProfile({
            displayName: displayName,
            phoneNumber: phoneNumber,
          });
        })
        .then(() => {
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.ACCOUNT);
        })
        .catch((error) => {
          this.setState({ error });
        });
    }

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      passwordOne,
      passwordTwo,
      phoneNumber,
      error,
    } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      firstName === "" ||
      lastName === "";
    const { dark, language } = this.props;
    const { SIGNUP } = TRANSLATIONS[`${language}`];
    return (
      <Container fluid>
        <Form
          error={error ?true :false}
          size="large"
          onSubmit={this.onSubmit}
          inverted={dark}
        >
          <Segment stacked inverted={dark}>
            {error && <Message error content={error.message} />}
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder={SIGNUP.firstName}
              name="firstName"
              value={firstName}
              onChange={this.onChange}
              type="text"
              required
              inverted={dark}
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder={SIGNUP.lastName}
              name="lastName"
              value={lastName}
              onChange={this.onChange}
              type="text"
              required
              inverted={dark}
            />
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder={SIGNUP.email}
              required
              inverted={dark}
            />
            <Form.Input
              fluid
              icon="phone"
              iconPosition="left"
              name="phoneNumber"
              value={phoneNumber}
              onChange={this.onChange}
              type="text"
              maxLength={10}
              placeholder={SIGNUP.phone}
              inverted={dark}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              placeholder={SIGNUP.passwordOne}
              type="password"
              required
              inverted={dark}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder={SIGNUP.passwordTwo}
              required
              inverted={dark}
            />
            <Button
              disabled={isInvalid}
              color="black"
              type="submit"
              fluid
              size="large"
              inverted={dark}
              basic={dark}
              content={SIGNUP.signUp}
            />
            <Divider horizontal inverted={dark}>
              {SIGNUP.or}
            </Divider>
            <SignInGoogle dark={dark} SIGNUP={SIGNUP} />
          </Segment>
        </Form>
      </Container>
    );
  }
}

const SignUpLink = (props) => {
  const { dark, SIGNUP } = props;
  return (
    <Message  color={dark ? "black" : null}>
      {SIGNUP.message}
      <Link to={ROUTES.SIGN_UP} style={{ color: dark ? "#A7A7A7" : "#0051a0" }}>
        {SIGNUP.signUp}
      </Link>
    </Message>
  );
};

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
