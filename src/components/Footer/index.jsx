import React from "react";
import { Container, Grid, Segment, Header, List } from "semantic-ui-react";

const Footer = (props) => {
  // const {dark} = props
  const {LanguageToggle} = props;
  return (
    <>
      <Segment inverted vertical style={{ padding: "5em 0em" }}>
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={3}>
                <Header inverted as="h3" content="Support" />
                <List link inverted relaxed size="large" >
                  <List.Item
                    as="a"
                    style={{padding:"0.5em"}}
                    href="tel:18669321801"
                    title="Call Support 1 (866) 932-1801 "
                    content="+1 (866) 932-1801"
                  />
                  <List.Item
                    as="a"
                    style={{padding:"0.5em"}}
                    href="https://retail-support.lightspeedhq.com/"
                    target="_blank"
                    rel="noreferrer"
                    title="Retail Help Center"
                  >
                    Retail Help Center
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{padding:"0.5em"}}
                    rel="noreferrer"
                    href="https://ecom-support.lightspeedhq.com/"
                    target="_blank"
                    title="eCom Help Center"
                  >
                    eCom Help Center
                  </List.Item>
                  <List.Item style={{textAlign:"left", padding:"0.5em"}} >
                    <LanguageToggle />
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h3" content="Company" />
                <List link inverted relaxed size="large">
                  <List.Item
                    as="a"
                    style={{padding:"0.5em"}}
                    rel="noreferrer"
                    href="https://www.lightspeedhq.com/contact/"
                    target="_blank"
                    title="Contact & Locations"
                  >
                    Contact & Locations
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{padding:"0.5em"}}
                    rel="noreferrer"
                    href="https://www.lightspeedhq.com/blog/"
                    target="_blank"
                    title="Lightspeed Blog"
                  >
                    Lightspeed Blog
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{padding:"0.5em"}}
                    rel="noreferrer"
                    href="https://www.lightspeedhq.com/events/"
                    target="_blank"
                    title="Events"
                  >
                    Lightspeed Events
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{padding:"0.5em"}}
                    rel="noreferrer"
                    href="https://community.lightspeedhq.com/"
                    target="blank"
                    title="Lightspeed Community"
                  >
                    Lightspeed Community
                  </List.Item>
                  <List.Item
                    as="a"
                    style={{padding:"0.5em"}}
                    rel="noreferrer"
                    href="https://status.lightspeedhq.com/"
                    target="blank"
                    title="Status Page"
                  >
                    Status Page
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header as="h3" inverted>
                  Professional Services
                  <Header.Subheader as="p" style={{ paddingTop: "1em" }}>
                    We offer a high-touch customer journey and white-glove
                    service empowering premium customers to be more successful
                    than ever.
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </>
  );
};

export default Footer;
