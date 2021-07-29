import React from "react";
import {
  Container,
  Grid,
  Segment,
  Header,
  List,
  Icon,
  Divider,
} from "semantic-ui-react";
import TRANSLATIONS from "../../constants/translation";
import { isMobile } from "react-device-detect";

const Footer = (props) => {
  const { language, dark } = props;
  const { FOOTER } = TRANSLATIONS[`${language}`];
  return (
    <React.Fragment>
      <Segment inverted vertical>
        <Divider
          inverted={dark}
          hidden={!dark}
          style={{ margin: "1rem", marginBottom: "2rem" }}
        />
        <Container>
          <Grid inverted stackable>
            <Grid.Row>
              <Grid.Column
                width={4}
                stretched
                textAlign={isMobile ? "center" : "left"}
              >
                <Header inverted as="h3" content={FOOTER.support} />
                <List link inverted relaxed size="large">
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    href="tel:18888888888"
                    title={FOOTER.phoneTitle}
                  >
                    <Icon name="phone" style={{ marginRight: "0.5em" }} />
                    {FOOTER.phone}
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    href="https://react.semantic-ui.com/"
                    target="_blank"
                    rel="noreferrer"
                    title={FOOTER.helpCenter}
                  >
                    <Icon name="help" style={{ marginRight: "0.5em" }} />
                    {FOOTER.helpCenter}
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    href={FOOTER.mailHref}
                    title={FOOTER.mailTitle}
                  >
                    <Icon
                      name="mail outline"
                      style={{ marginRight: "0.5em" }}
                    />
                    {FOOTER.mail}
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column
                width={4}
                stretched
                textAlign={isMobile ? "center" : "left"}
              >
                <Header inverted as="h3" content={FOOTER.company} />
                <List link inverted relaxed size="large">
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    href="#"
                    title={FOOTER.about}
                  >
                    <Icon name="info circle" style={{ marginRight: "0.5em" }} />
                    {FOOTER.about}
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    href="#"
                    title={FOOTER.location}
                  >
                    <Icon name="map marker" style={{ marginRight: "0.5em" }} />
                    {FOOTER.location}
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    href="#"
                    title={FOOTER.blog}
                  >
                    <Icon
                      name="newspaper outline"
                      style={{ marginRight: "0.5em" }}
                    />
                    {FOOTER.blog}
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    href="#"
                    title={FOOTER.events}
                  >
                    <Icon
                      name="calendar alternate outline"
                      style={{ marginRight: "0.5em" }}
                    />
                    {FOOTER.events}
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={8} textAlign={isMobile ? "center" : "right"}>
                <Header as="h3" inverted>
                  {FOOTER.h3}
                  <Header.Subheader as="p" style={{ paddingTop: "1em" }}>
                    {FOOTER.subheader}
                  </Header.Subheader>
                </Header>
                <List horizontal inverted relaxed>
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.facebook.com/"
                    title={FOOTER.facebook}
                    content={<Icon name="facebook" size="big" />}
                  />
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.instagram.com/milesbd_consulting/"
                    title={FOOTER.instagram}
                    content={<Icon name="instagram" size="big" />}
                  />
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    target="_blank"
                    rel="noreferrer"
                    href="https://twitter.com/MilesDuckworth"
                    title={FOOTER.twitter}
                    content={<Icon name="twitter" size="big" />}
                  />
                  <List.Item
                    as="a"
                    style={{ padding: "0.5em" }}
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/milesbd"
                    title={FOOTER.github}
                    content={<Icon name="github" size="big" />}
                  />
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width="16" textAlign="center">
                <Divider inverted />
                Copyright © {new Date().getFullYear()} - {FOOTER.copyCompany}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </React.Fragment>
  );
};

export default Footer;
