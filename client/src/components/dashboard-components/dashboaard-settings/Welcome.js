import React from "react";
import { DashboardContext } from "../DashboardProvider";


function WelcomeMessage() {
  return (
    <DashboardContext.Consumer>
      {({ firstVisit }) =>
        firstVisit ? (
          <div>
            Welcome to CryptoDash, please select your favorite coins to begin.
          </div>
        ) : null
      }
    </DashboardContext.Consumer>
  );
}

export default WelcomeMessage;