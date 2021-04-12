import React, { Component } from "react";
// import Blocks from "./Blocks";
import{Link} from "react-router-dom"
import logo from "../assets/logo.png";


class App extends Component {
  state = {
    walletInfo: {},
  };
  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ walletInfo: json });
      });
  }
  render() {
    const { address, balance } = this.state.walletInfo;
    return (
      <div className="App">
        <img className="logo" src={logo}></img>
        <br />
        <div>Welcome to my Blockchain</div>
        <div>
          <Link to="/blocks"> Blocks</Link>
        </div>
        <div>
          <Link to="/conduct-transaction"> Conduct a transaction</Link>
        </div>
        <div>
          <Link to="/transaction-pool"> Transaction Pool</Link>
        </div>
        <div>
          <Link to="/dashboard"> Visit CryptoCurrency Dashboard</Link>
        </div>
        <div className="WalletInfo">
          <div>Address: {address}</div>
          <div>Balance: {balance}</div>
        </div>
        {/* <br />
        <Blocks /> */}
      </div>
    );
  }
}

export default App;
