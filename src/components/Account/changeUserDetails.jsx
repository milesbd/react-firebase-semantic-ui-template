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

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  error: null,
  success: null,
  loading: false,
  uid: null,
};

class ChangeEmailandNameBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { uid } = this.props.authUser;
    this.setState({ loading: false, uid: uid });
  }

  componentWillUnmount() {}

  onSubmitUser = (event) => {
    this.setState({ loading: true });
    const { firstName, lastName, uid } = this.state;

    const nameUpdate = {
      firstName: firstName,
      lastName: lastName,
      displayName:`${firstName} ${lastName}`
    };

    this.props.firebase.user(uid).update(nameUpdate, (error) => {
      if (error) {
        this.setState({ error: error });
      } else {
        this.setState({ success: true, loading: false });
      }
    });

    setTimeout(
      () =>
        this.setState({
          error: false,
          success: false,
          firstName: "",
          lastName: "",
        }),
      5000
    );
    event.preventDefault();
  };

  onChange = (event, data) => {
    this.setState({ [data.name]: data.value });
  };
  render() {
    const { firstName, lastName, error, success, loading } = this.state;
    const isUserInvalid = firstName === "" || lastName === "";
    const { authUser, dark, ACCOUNT } = this.props;
    return (
      <Segment inverted={dark}>
        <Divider hidden />
        <Header as="h2" textAlign="left" inverted={dark}>
          <Icon size="tiny" name="user" />
          {ACCOUNT.yourInfo}
        </Header>
        <Divider hidden />
        <Form
          error={error ? true : false}
          loading={loading}
          onSubmit={this.onSubmitUser}
          inverted={dark}
        >
          {error && <Message error content={error.message} />}
          {success && <Message positive header="User Info Updated" content="You may need to refresh the page to see changes"></Message>}
          <Form.Group widths={4}>
            {/* <Form.Field
                    control={Input}
                    icon="mail"
                    iconPosition="left"
                    name="email"
                    value={authUser.email}              
                    // onChange={this.onChange}
                    className={"immutable"}
                    disabled
                    type="text"
                    placeholder={authUser.email}
                  /> */}
            <Form.Field></Form.Field>
            <Form.Field
              control={Input}
              icon="user"
              iconPosition="left"
              name="firstName"
              value={firstName}
              onChange={this.onChange}
              required
              placeholder={authUser.firstName}
              type="text"
            ></Form.Field>
            <Form.Field
              control={Input}
              icon="user"
              iconPosition="left"
              name="lastName"
              value={lastName}
              onChange={this.onChange}
              required
              placeholder={authUser.lastName}
              type="text"
            ></Form.Field>
            <Form.Button
              disabled={isUserInvalid}
              color="red"
              type="submit"
              inverted={dark}
              basic={dark}
              content={ACCOUNT.updateInfoButton}
            />
          </Form.Group>
        </Form>
      </Segment>
    );
  }
}
const condition = (authUser) => !!authUser;

const ChangeEmailandName = compose(
  withAuthorization(condition),
  withFirebase
)(ChangeEmailandNameBase);

export { ChangeEmailandName };
