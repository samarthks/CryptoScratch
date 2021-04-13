import React from "react";
import WelcomeMessage from "./Welcome";
import ConfirmButton from "./ConfirmButton";
import Page from '../dashboard-shared/Page';
import CoinGrid from "./CoinGrid";

export default function () {
  return( 

  <Page name="settings">
    <WelcomeMessage />
    <CoinGrid  topSection/>
    <ConfirmButton />
    <CoinGrid />
  </Page>);
}
