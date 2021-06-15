import React, { Component, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { Container, Header, Icon, Segment } from "semantic-ui-react";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext, withAuthentication } from "../Session";
import PageView from "../Analytics/pageview";

const ResponsiveContainer = lazy(() => import("../Navigation"));
const SignInPage = lazy(() => import("../SignIn"));
const PasswordForgetPage = lazy(() => import("../PasswordForget"));
const AdminPage = lazy(() => import("../Admin"));
const Unauthorized = lazy(() => import("../Unauthorized"));
const NoMatch = lazy(() => import("../NoMatch"));
const Home = lazy(()=> import("../Home"));
const AccountPage = lazy(() => import("../Account"));
const SignUpPage = lazy(() => import("../SignUp"));
const Footer = lazy(()=>import("../Footer"));
const renderLoader = () => {
  return (
    <Container fluid textAlign="center">
      <Segment fluid="true" basic style={{ paddingTop: "20vh" }}>
        <Header as="h1" icon>
          <Icon name="sync" loading />
          Loading
        </Header>
      </Segment>
    </Container>
  );
};

const options = [
  { key: "EN", text: "EN", value: "EN" },
  { key: "FR", text: "FR", value: "FR" },
];

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: false,
      language: "EN",
    };
  }
  toggleDark = () => {
    const { dark } = this.state;
    this.setState({
      dark: !dark,
    });
  };
  changeLanguage = (e, data) => {
    const { value } = data;
    this.setState({ language: value });
  };

  render() {
    const { dark, language } = this.state;
    return (
      <Suspense fallback={renderLoader()}>
        <Router>
          <ResponsiveContainer
            dark={dark}
            toggleDark={this.toggleDark}
            options={options}
            language={language}
            changeLanguage={this.changeLanguage}
          >
            <Switch>
              <Route exact path={ROUTES.HOME}>
                <Home
                  dark={dark}
                  toggleDark={this.toggleDark}
                  language={language}
                />
              </Route>
              <Route exact path={ROUTES.ADMIN}>
                <AdminPage
                  dark={dark}
                  toggleDark={this.toggleDark}
                  language={language}
                />
              </Route>
              <Route exact path={ROUTES.ACCOUNT}>
                <AccountPage
                  dark={dark}
                  toggleDark={this.toggleDark}
                  language={language}
                />
              </Route>
              <Route exact path={ROUTES.SIGN_UP}>
                <SignUpPage
                  dark={dark}
                  toggleDark={this.toggleDark}
                  language={language}
                />
              </Route>
              <Route exact path={ROUTES.SIGN_IN}>
                <SignInPage
                  dark={dark}
                  toggleDark={this.toggleDark}
                  language={language}
                />
              </Route>
              <Route exact path={ROUTES.PASSWORD_FORGET}>
                <PasswordForgetPage
                  dark={dark}
                  toggleDark={this.toggleDark}
                  language={language}
                />
              </Route>
              <Route exact path={ROUTES.UNAUTHORIZED}>
                <Unauthorized
                  dark={dark}
                  toggleDark={this.toggleDark}
                  language={language}
                />
              </Route>
              <Route>
                <NoMatch />
              </Route>
            </Switch>
            <Footer language={language} dark={dark} />
          </ResponsiveContainer>
          <AuthUserContext.Consumer>
            {(authUser) => <PageView authUser={authUser} />}
          </AuthUserContext.Consumer>
        </Router>
      </Suspense>
    );
  }
}
export default React.memo(withAuthentication(Routes));
