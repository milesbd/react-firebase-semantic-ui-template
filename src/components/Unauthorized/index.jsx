import React from "react";
import { Segment, Icon, Header } from "semantic-ui-react";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const Unauthorized = (props) => {
  const user = props.firebase.currentUser();
  if(user === null){
    setTimeout(() => props.history.push(ROUTES.SIGN_IN), 3000);
    
  }
  return (
    <Segment fluid="true" basic textAlign="center" vertical>
      <Header as="h1" icon style={{ paddingTop: "4em" }}>
        <Icon name="dont" />
        Unauthorized
        <Header.Subheader>
          Only Authorized Staff can access this section.
        </Header.Subheader>
      </Header>
    </Segment>
  );
};

export default withFirebase(Unauthorized);
