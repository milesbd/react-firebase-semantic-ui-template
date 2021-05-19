import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import { ChangePassword } from "./changePassword";
import { ChangeEmailandName } from "./changeUserDetails";
import LoginManagement from "./loginManagement";

import { Header, Icon, Segment, Divider, Image } from "semantic-ui-react";

const INITIAL_STATE = {
  loading: false,
};

class AccountBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.props.firebase.user().off();
  }

  render() {
    const { loading } = this.state;
    const { dark } = this.props;

    return (
      <AuthUserContext.Consumer>
        {(authUser) => {
          return (
            <>
              <Segment
                style={{ padding: "0", minHeight: "95vh", margin: 0 }}
                textAlign="center"
                loading={loading}
                basic
                inverted={dark}
              >
                <PageHeader {...this.props} />
                <Divider inverted={dark} />
                <Segment basic inverted={dark}>
                  <PageSubHeader authUser={authUser} dark={dark} />
                </Segment>
                <Segment basic inverted={dark} style={{ marginBottom: 0 }}>
                  <Segment.Group>
                    <ChangeEmailandName authUser={authUser} {...this.props} />
                    <ChangePassword authUser={authUser} {...this.props} />
                    {authUser.email && (
                      <LoginManagement authUser={authUser} {...this.props} />
                    )}
                    {/* <Segment inverted={dark}>Middle</Segment>
                    <Segment inverted={dark}>Middle</Segment>
                    <Segment inverted={dark}>Bottom</Segment> */}
                  </Segment.Group>
                </Segment>
              </Segment>
            </>
          );
        }}
      </AuthUserContext.Consumer>
    );
  }
}

const PageHeader = (props) => {
  const { dark } = props;
  return (
    <Segment fluid="true" basic inverted={dark}>
      <Divider hidden />
      <Header as="h2" icon inverted={dark}>
        <Icon name="user circle" inverted={dark} />
        Account Settings
        <Header.Subheader>Manage your account details.</Header.Subheader>
      </Header>
    </Segment>
  );
};

const PageSubHeader = ({ authUser, dark }) => {
  const photoURL = authUser.providerData.photoURL;
  return (
    <Header as="h3" textAlign="left" inverted={dark}>
      {photoURL && <Image src={photoURL} size="large" circular />}

      <Header.Content>
        Welcome {authUser.displayName ? authUser.displayName : authUser.email}
        <Header.Subheader>
          Member since{" "}
          {new Date(Date.parse(authUser.metadata.creationTime)).toDateString()}
        </Header.Subheader>
      </Header.Content>
    </Header>
  );
};

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(withFirebase(AccountBase));
