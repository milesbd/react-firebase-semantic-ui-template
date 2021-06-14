import React, { Component } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  Icon,
} from "semantic-ui-react";
import logo from "../../media/Logo_500.webp";
import { NavLink } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = (props) => {
  const { dark } = props;
  return (
    <Segment
      basic
      fluid="true"
      inverted={dark}
      style={{ marginTop: 0, marginBottom: 0 }}
    >
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" textAlign="center" inverted={dark}>
            <Image src={logo} size="tiny" /> Reset Password
          </Header>
          <PasswordForgetForm {...props} />
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

const INITIAL_STATE = {
  email: "",
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;
    const { dark } = this.props;

    const isInvalid = email === "";

    return (
      <Form error={error} size="large" onSubmit={this.onSubmit} inverted={dark}>
        <Segment stacked inverted={dark}>
          {error && <Message error content={error.message} />}
          <Form.Input
            fluid
            icon="mail"
            iconPosition="left"
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
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
          >
            Reset My Password
          </Button>
        </Segment>
      </Form>
    );
  }
}

const PasswordForgetLink = (props) => {
  const { dark } = props;
  return (
    <React.Fragment>
      {/* <Message color={dark ? "black" : null} size="tiny">
        <Link
          to={ROUTES.PASSWORD_FORGET}
          style={{ color: dark ? "#A7A7A7" : "#0051a0" }}
        >
          Forgot Password?
        </Link>
      </Message> */}
      <Button
        as={NavLink}
        icon
        basic
        inverted={dark}
        fluid
        size="large"
        to={ROUTES.PASSWORD_FORGET}
        labelPosition="left"
        type="submit"
      >
        <Icon name="help" />
        Forgot Password?
      </Button>
    </React.Fragment>
  );
};

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
