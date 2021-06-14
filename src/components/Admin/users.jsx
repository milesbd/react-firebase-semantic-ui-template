import React, { Component } from "react";
import _ from "lodash";
import { withFirebase } from "../Firebase";
import {
  Message,
  Table,
  Icon,
  Button,
  List,
  Segment,
  Popup,
  Confirm,
} from "semantic-ui-react";
import { compose } from "recompose";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";

class UserListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      organisation: null,
      column: null,
      sorted: null,
      direction: null,
      changing: false,
      error: false,
      success: false,
    };
  }

  onSort = (e, data) => {
    let name = e.currentTarget.dataset.name;
    const { users } = this.props;
    const { column, direction, sorted } = this.state;
    if (column === name) {
      this.setState({
        direction: direction === "ascending" ? "descending" : "ascending",
        sorted: sorted.reverse(),
      });
    } else {
      this.setState({
        column: name,
        direction: "ascending",
        sorted: _.sortBy(users, [name]),
      });
    }
  };
  handleDismiss = () => {
    this.setState({ success: false });
  };
  handleDismissError = () => {
    this.setState({ error: false });
  };

  render() {
    const { users, dark } = this.props;
    const { changing, column, direction, error, success } = this.state;
    let { sorted } = this.state;
    if (sorted === null) {
      sorted = users;
    }
    return (
      <React.Fragment>
        {success && (
          <Message
            onDismiss={this.handleDismiss}
            floating
            success
            content={success.message}
          />
        )}
        {error && (
          <Message
            onDismiss={this.handleDismissError}
            floating
            error
            content={error.message}
          />
        )}
        <Table sortable celled inverted={dark}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === "email" ? direction : null}
                onClick={this.onSort}
                data-name={"email"}
              >
                <Icon name="mail" />
                E-mail
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "firstName" ? direction : null}
                onClick={this.onSort}
                data-name={"firstName"}
              >
                <Icon name="user" />
                First Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "lastName" ? direction : null}
                onClick={this.onSort}
                data-name={"lastName"}
              >
                <Icon name="user" />
                Last Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "roles" ? direction : null}
                onClick={this.onSort}
                data-name={"roles"}
              >
                <Icon name="key" />
                Roles
              </Table.HeaderCell>
              <Table.HeaderCell data-name={"Manage User"}>
                <Icon name="id badge outline" />
                Manage User
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sorted.map((user) => (
              <Table.Row
                key={user.uid}
                negative={user.roles["UNAUTHORIZED"] ? true : false}
                warning={user.roles["UNAUTHORIZED"] ? false : !user.enabled}
              >
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.firstName}</Table.Cell>
                <Table.Cell>{user.lastName}</Table.Cell>
                <Table.Cell>
                  <List>
                    {Object.keys(user.roles).map((key, index) => (
                      <List.Item key={key}>{user.roles[key]}</List.Item>
                    ))}
                  </List>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <ManageUser
                    user={user}
                    changing={changing}
                    firebase={this.props.firebase}
                    dark={dark}
                    negative={user.roles["UNAUTHORIZED"] ? true : false}
                    warning={user.roles["UNAUTHORIZED"] ? false : !user.enabled}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

class ManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      uid: null,
      entryRef: null,
      confirm: false,
    };
  }
  toggleRole = (e, { role, action, user, uid }) => {
    let updatedUser = user;
    let errorFlag = false;
    let newAdmin = false;
    this.setState({
      changing: true,
      uid: uid,
    });
    //Logic to decide what to do
    if (action === "ADD") {
      updatedUser.roles[role] = role;
      if (role === "ADMIN") {
        updatedUser.isAdmin = true;
        newAdmin = true;
      }
    } else {
      delete updatedUser.roles[role];
    }

    //   logic to decide whether to place unauthorized role or remove it
    if (
      updatedUser.roles["UNAUTHORIZED"] &&
      Object.keys(updatedUser.roles).length > 1
    ) {
      delete updatedUser.roles["UNAUTHORIZED"];
    } else if (Object.keys(updatedUser.roles).length === 0) {
      updatedUser.roles["UNAUTHORIZED"] = "UNAUTHORIZED";
      updatedUser.isAuthorized = false;
    }

    this.props.firebase
      .user(uid)
      .update({ roles: updatedUser.roles }, (error) => {
        if (error) {
          console.log(error);
          errorFlag = error;
        }
      });
    if (errorFlag) {
      this.setState({
        error: errorFlag,
        changing: false,
        uid: null,
      });
      setTimeout(() => this.setState({ error: false }), 5000);
    } else {
      this.setState({
        changing: false,
        uid: null,
        success: {
          message: `User ${user.email} updated! ${
            newAdmin ? "The New Admin will need to login again" : ""
          }`,
        },
      });
      setTimeout(() => this.setState({ success: false }), 5000);
    }
  };

  toggleEnable = (e, { action, user, uid }) => {
    let updatedUser = user;
    let errorFlag = false;
    this.setState({
      changing: true,
      uid: uid,
      modal: false,
    });
    if (action === "DISABLE") {
      updatedUser.enabled = false;
    } else {
      updatedUser.enabled = true;
    }
    this.props.firebase
      .user(uid)
      .update({ enabled: updatedUser.enabled }, (error) => {
        if (error) {
          console.log(error);
          errorFlag = error;
        }
      });
    if (errorFlag) {
      this.setState({
        error: errorFlag,
        changing: false,
        uid: null,
      });
      setTimeout(() => this.setState({ error: false }), 5000);
    } else {
      this.setState({
        changing: false,
        uid: null,
        success: {
          message: `User ${user.email} updated`,
        },
      });
    }
  };
  deleteUser = (uid) => {
    this.setState({
      changing: true,
      uid: uid,
    });
    this.props.firebase.user(uid).remove();
  };
  setEntryRef = (entry) => {
    this.setState({ entryRef: entry });
  };
  openConfirm = (e, data) => {
    const { uid } = data;
    this.setEntryRef(uid);
    this.setState({ confirm: true });
  };
  closeConfirm = () => {
    this.setEntryRef(null);
    this.setState({ confirm: false });
  };

  handleConfirm = () => {
    console.log(this.state.entryRef)
    this.deleteUser();
    this.closeConfirm();
  };

  render() {
    const { user, changing, dark, warning, negative } = this.props;
    console.log(dark, negative, warning)
    const { uid, error, success, confirm } = this.state;
    return (
      <React.Fragment>
        <Popup
          flowing
          trigger={<Button basic circular icon="edit outline" inverted={dark && (!negative && !warning)} />}
          hideOnScroll
          on={["click"]}
          hoverable
          inverted={dark}
        >
          <Segment
            basic
            fluid="true"
            inverted={dark}
            style={{ padding: 0 }}
            loading={uid === user.uid ? true : false}
          >
            {error && (
              <Message
                error
                content="Whoops! Something went wrong, please try again"
              />
            )}
            {success && <Message success content={success.message} />}
            <Button
              primary
              uid={user.uid}
              user={user}
              disabled={user.uid === uid ? false : changing}
              // eslint-disable-next-line
              role="ADMIN"
              action={user.roles.ADMIN ? "REMOVE" : "ADD"}
              onClick={this.toggleRole}
            >
              {user.roles.ADMIN ? "Remove" : "Make"} Admin
            </Button>

            <Button
              secondary
              uid={user.uid}
              user={user}
              disabled={user.uid === uid ? false : changing}
              // eslint-disable-next-line
              role="STAFF"
              action={user.roles.STAFF ? "REMOVE" : "ADD"}
              onClick={this.toggleRole}
            >
              {user.roles.STAFF ? "Remove" : "Make"} Staff
            </Button>

            <Button
              color="orange"
              uid={user.uid}
              user={user}
              disabled={user.uid === uid ? false : changing}
              action={user.enabled ? "DISABLE" : "ENABLE"}
              onClick={this.toggleEnable}
            >
              {user.enabled ? "Disable" : "Enable"} User
            </Button>
            <Button
              negative
              uid={user.uid}
              user={user}
              disabled={user.uid === uid ? false : changing}
              onClick={this.openConfirm}
            >
              Remove User
            </Button>
          </Segment>
        </Popup>
        <Confirm
          open={confirm}
          onCancel={this.closeConfirm}
          onConfirm={this.handleConfirm}
          entry={uid}
          confirmButton="Delete"
          header="Confirm Export Deletion"
          content="The export will be permanently deleted."
        />
      </React.Fragment>
    );
  }
}

const condition = (authUser) =>
  authUser && !!authUser.roles[ROLES.ADMIN] && !!authUser.enabled;

export default compose(
  withAuthorization(condition),
  withFirebase
)(UserListPage);
