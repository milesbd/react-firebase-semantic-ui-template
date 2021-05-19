import React from "react";
import { Dropdown, Icon, Button } from "semantic-ui-react";

import { withFirebase } from "../Firebase";

const SignOutMenuItemBase = ({ firebase }) => (
  <Dropdown.Item name="Sign Out" onClick={firebase.doSignOut}>
    <Icon name="sign-out" />
    Sign Out
  </Dropdown.Item>
);

const SignOutMenuItemButtonBase = (props) => {
  const { firebase, fixed } = props;
  return (
    <Button basic as="a" inverted={!fixed} onClick={firebase.doSignOut}>
      <Icon name="sign-out" />
      Sign Out
    </Button>
  );
};

const SignOutMenuItem = withFirebase(SignOutMenuItemBase);
const SignOutMenuItemButton = withFirebase(SignOutMenuItemButtonBase);

export default SignOutMenuItem;
export { SignOutMenuItem, SignOutMenuItemButton };
