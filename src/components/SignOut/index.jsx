import React from "react";
import { Icon, Button, Menu } from "semantic-ui-react";
import { withFirebase } from "../Firebase";
import TRANSLATIONS from "../../constants/translation";

const SignOutMenuItemBase = (props) => {
  const { firebase, language } = props;
  const { NAVIGATION } = TRANSLATIONS[`${language}`];
  return (
  <Menu.Item
    name={NAVIGATION.signOut}
    exact
    icon="sign-out"
    content={NAVIGATION.signOut}
    onClick={firebase.doSignOut}
  />
)};

const SignOutMenuItemButtonBase = (props) => {
  const { firebase, fixed, language } = props;
  const { NAVIGATION } = TRANSLATIONS[`${language}`];
  return (
    <Button basic as="a" inverted={!fixed} onClick={firebase.doSignOut}>
      <Icon name="sign-out" />
      {NAVIGATION.signOut}
    </Button>
  );
};

const SignOutMenuItem = withFirebase(SignOutMenuItemBase);
const SignOutMenuItemButton = withFirebase(SignOutMenuItemButtonBase);

export default SignOutMenuItem;
export { SignOutMenuItem, SignOutMenuItemButton };
