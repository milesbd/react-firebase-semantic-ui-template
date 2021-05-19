import React, { useState } from "react";
import { createMedia } from "@artsy/fresnel";
import { NavLink } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import { AuthUserContext } from "../Session";
import { SignOutMenuItemButton } from "../SignOut";
import {
  Button,
  Container,
  Icon,
  Image,
  Menu,
  Dropdown,
  Segment,
  Sidebar,
  Visibility,
} from "semantic-ui-react";
import Logo from "../../media/Logo_500.webp";
import TRANSLATIONS from "../../constants/translation";

const DarkButton = (props) => {
  const { dark, toggleDark, fixed } = props;
  const { GLOBAL } = TRANSLATIONS.EN;
  return (
    <Button
      basic
      circular
      icon={dark ? "sun outline" : "moon outline"}
      onClick={toggleDark}
      inverted={!fixed}
      aria-label={GLOBAL.ariaDark}
    />
  );
};

/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */
const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
const HomepageHeading = () => {
  const { NAVIGATION } = TRANSLATIONS.EN;
  return (
    <Image
      src={Logo}
      size="small"
      centered
      alt={NAVIGATION.imageAlt}
      width="150"
      height="150"
    />
  );
};

const DesktopContainer = (props) => {
  const { dark, toggleDark, language, children, options, changeLanguage } =
    props;
  const { NAVIGATION } = TRANSLATIONS[`${language}`];
  const [fixed, setFixed] = useState(false);
  const hideFixedMenu = () => setFixed(false);
  const showFixedMenu = () => setFixed(true);
  return (
    <AuthUserContext.Consumer>
      {(authUser) => {
        return (
          <Media greaterThan="mobile">
            <Visibility
              once={false}
              onBottomPassed={showFixedMenu}
              onBottomPassedReverse={hideFixedMenu}
            >
              <Segment basic inverted textAlign="right" vertical>
                <Menu secondary inverted>
                  <Menu.Item position="right">
                    <Dropdown
                      placeholder={language}
                      options={options}
                      value={language}
                      className="languageSelect"
                      onChange={changeLanguage}
                      style={{ marginRight: "1em" }}
                      aria-label={NAVIGATION.ariaLanguage}
                    />
                    <DarkButton
                      dark={dark}
                      toggleDark={toggleDark}
                      fixed={fixed}
                    />
                  </Menu.Item>
                </Menu>
              </Segment>
              <Segment basic inverted textAlign="center" vertical>
                <HomepageHeading />
                <Menu
                  fixed={fixed ? "top" : null}
                  inverted={!fixed}
                  pointing={!fixed}
                  secondary={!fixed}
                  size="large"
                >
                  <Container fluid>
                    <Menu.Item
                      as={NavLink}
                      to={ROUTES.HOME}
                      name={NAVIGATION.home}
                      exact
                      content={NAVIGATION.home}
                      style={{ marginLeft: "1em" }}
                    />
                    {!!authUser && (
                      <Menu.Item
                        as={NavLink}
                        to={ROUTES.ACCOUNT}
                        name={NAVIGATION.account}
                        exact
                        content={NAVIGATION.account}
                      />
                    )}
                    {!!authUser && (
                      <>
                        {!!authUser.roles[ROLES.ADMIN] && (
                          <Menu.Item
                            as={NavLink}
                            to={ROUTES.ADMIN}
                            name={NAVIGATION.admin}
                            exact
                            content={NAVIGATION.admin}
                          />
                        )}
                      </>
                    )}
                    <Menu.Item position="right">
                      {authUser ? (
                        <SignOutMenuItemButton fixed={fixed} />
                      ) : (
                        <>
                          <Button
                            basic
                            as={NavLink}
                            to={ROUTES.SIGN_UP}
                            name="Sign Up"
                            inverted={!fixed}
                            style={{ marginRight: "0.5em" }}
                          >
                            <Icon name="signup" />
                            Sign Up
                          </Button>
                          <Button
                            basic
                            as={NavLink}
                            to={ROUTES.SIGN_IN}
                            name="Sign In"
                            inverted={!fixed}
                          >
                            <Icon name="sign-in" />
                            Sign In
                          </Button>
                        </>
                      )}
                      {fixed && (
                        <>
                          <Dropdown
                            placeholder={language}
                            options={options}
                            value={language}
                            className="languageSelect"
                            onChange={changeLanguage}
                            style={{ marginRight: "1em", marginLeft: "1em" }}
                            aria-label={NAVIGATION.ariaLanguage}
                          />
                          <DarkButton
                            dark={dark}
                            toggleDark={toggleDark}
                            fixed={fixed}
                          />
                        </>
                      )}
                    </Menu.Item>
                  </Container>
                </Menu>
              </Segment>
            </Visibility>

            {children}
          </Media>
        );
      }}
    </AuthUserContext.Consumer>
  );
};

const MobileContainer = (props) => {
  const { dark, toggleDark, language, children, options, changeLanguage } =
    props;
  const [open, setOpen] = useState(false);
  const { NAVIGATION } = TRANSLATIONS[`${language}`];

  const handleSidebarHide = () => setOpen(false);
  const handleToggle = () => setOpen(true);

  return (
    <AuthUserContext.Consumer>
      {(authUser) => {
        return (
          <Media as={Sidebar.Pushable} at="mobile">
            <Sidebar.Pushable>
              <Sidebar
                as={Menu}
                animation="overlay"
                inverted
                onHide={handleSidebarHide}
                vertical
                visible={open}
              >
                <Menu.Item
                  as={NavLink}
                  to={ROUTES.HOME}
                  name={NAVIGATION.home}
                  exact
                  content={NAVIGATION.home}
                />
                <Menu.Item
                  as={NavLink}
                  to={ROUTES.ACCOUNT}
                  name={NAVIGATION.account}
                  exact
                  content={NAVIGATION.account}
                />
                <Menu.Item
                  as={NavLink}
                  to={ROUTES.ADMIN}
                  name={NAVIGATION.admin}
                  exact
                  content={NAVIGATION.admin}
                />
              </Sidebar>

              <Sidebar.Pusher dimmed={open}>
                <Segment basic inverted textAlign="center" vertical>
                  <Container>
                    <Menu inverted pointing secondary size="large">
                      <Menu.Item onClick={handleToggle}>
                        <Icon name="sidebar" />
                      </Menu.Item>
                      <Menu.Item position="right">
                        <Dropdown
                          placeholder={language}
                          options={options}
                          value={language}
                          className="languageSelect"
                          onChange={changeLanguage}
                          style={{ marginRight: "1em" }}
                          aria-label={NAVIGATION.ariaLanguage}
                        />
                        <DarkButton
                          dark={dark}
                          toggleDark={toggleDark}
                          fixed={false}
                        />
                      </Menu.Item>
                    </Menu>
                  </Container>
                  <HomepageHeading mobile />
                </Segment>

                {children}
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </Media>
        );
      }}
    </AuthUserContext.Consumer>
  );
};

const ResponsiveContainer = (props) => {
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  return (
    <MediaContextProvider>
      <DesktopContainer {...props} />
      <MobileContainer {...props} />
    </MediaContextProvider>
  );
};

export default ResponsiveContainer;
