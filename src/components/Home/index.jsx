import React from "react";
import {
  Header,
  Segment,
  Grid,
  Container,
  Icon,
} from "semantic-ui-react";
import TRANSLATIONS from "../../constants/translation";

const Home = (props) => {
  const { dark, language } = props;
  const { HOME } = TRANSLATIONS[`${language}`];
  return (
    <Segment
      basic
      fluid="true"
      inverted={dark}
      style={{ marginTop: 0, marginBottom: 0 }}
    >
      <Container fluid>
        <Segment
          basic
          fluid="true"
          textAlign="center"
          inverted={dark}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Grid
            textAlign="center"
            style={{ minHeight: "100vh", margin: 0 }}
            verticalAlign="middle"
          >
            <Grid.Column>
              <Header as="h1" textAlign="center" icon inverted={dark}>
                <Icon name="announcement" />
                {HOME.header}
              </Header>
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    </Segment>
  );
};


export default React.memo(Home);
