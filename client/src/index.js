import React from "react";
import { render } from "react-dom";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history"
import App from "./components/App";
import Blocks from "./components/Blocks";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/Transaction-pool"
 import "./index.css";
import Dashboard from "./components/dashboard-components/dashboard";

render( <Router history={history}>
    <Switch>
         <Route exact path="/" component ={App} />
         <Route path="/blocks" component ={Blocks} />
         <Route path="/conduct-transaction" component ={ConductTransaction} />
         <Route path="/transaction-pool" component ={TransactionPool} />
         <Route path="/dashboard" component ={Dashboard} />
    </Switch>
</Router>, document.getElementById("root"));
