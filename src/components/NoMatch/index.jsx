import React from "react";
import { Header, Icon, Segment } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

const NoMatchBase = (props) => {
  setTimeout(() => props.history.push(ROUTES.HOME), 3000);
  return (
    <Segment basic fluid="true" textAlign="center">
      <Header as="h1" textAlign="center" icon>
        <Icon name="spy" />
        This Page does not exist
        <Header.Subheader>(or does it?)</Header.Subheader>
        <Header.Subheader>In any case, you'll be redirected shortly...</Header.Subheader>
      </Header>
    </Segment>
  );
}

const NoMatch = withRouter(NoMatchBase);
export default NoMatch;
