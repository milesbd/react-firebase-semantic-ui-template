import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";

const PageView = (props) => {
  const location = useLocation();
  const { firebase, authUser } = props;
  const { analytics } = firebase;

  useEffect(() => {
    console.log(location);
    const page_path = location.pathname + location.search;
    analytics.setCurrentScreen(page_path);
    analytics.logEvent("page_view", { page_path });
  }, [location, analytics]);

  useEffect(() => {
    if (authUser) {
      console.log(authUser);
      const { uid, providerData, roles } = authUser;
      const { providerId } = providerData;
      if (!Object.prototype.hasOwnProperty.call(roles, "ADMIN")) {
        analytics.setUserProperties({ uid });
        analytics.logEvent("login", providerId);
        analytics.logEvent("user_active", { uid });
      }
    }
  }, [authUser, analytics]);
  return null;
};

export default compose(withFirebase)(PageView);
