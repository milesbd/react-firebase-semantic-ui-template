import React from "react";
import { Button } from "semantic-ui-react";

const DarkMode = (props) => {
  const {dark, toggleDark, fixed} = props;
  return (
    <Button
      inverted={!fixed}
      basic
      active={false}
      icon={dark ? "sun" : "moon"}
      aria-label="Dark Mode Toggle"
      onClick={toggleDark}
      style={{ marginLeft: "0.5em" }}
    />
  );
};

export default DarkMode;
