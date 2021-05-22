import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Segment } from "semantic-ui-react";
import { compose } from "recompose";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import UserListPage from "./users";

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      users: [],
      organisations: [],
      file: null,
      showProgress: false,
      percent: 0,
      orgList: null,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    // Get the Users from the DB
    this.props.firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));
      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }
  render() {
    const { users, loading } = this.state;
    const {dark} = this.props;
    return(
      <Segment
        style={{ marginTop:0, paddingBottom: 0, minHeight: "95vh" }}
        basic
        inverted={dark}
        loading={loading}
      >
        <UserListPage users={users} dark={dark}/>
      </Segment>
    );
  }
}
const condition = (authUser) =>
  authUser && !!authUser.roles[ROLES.ADMIN] && !!authUser.enabled;

export default compose(withAuthorization(condition), withFirebase)(AdminPage);
