import React, { Component } from "react";
import { Link } from "react-router-dom";
import Transaction from "./Transaction";
import { Button } from "react-bootstrap";
import history from "../history";

const POLL_INTERVAL = 10000; //in milliseconds

class TransactionPool extends Component {
  state = { transactionPoolMap: {} };

  fetchTransactionPoolMap = () => {
    return fetch(`${document.location.origin}/api/transaction-pool-map`)
      .then((response) => response.json())
      .then((json) => this.setState({ transactionPoolMap: json }));
  };

  fetchMineTransactions() {
    fetch(`${document.location.origin}/api/mine-transactions`).then(
      (response) => {
        if (response.status === 200) {
          alert("Success");
          history.push("/blocks");
        } else {
          alert("Mine-transaction block request not valid");
        }
      }
    );
  }

  componentDidMount() {
    this.fetchTransactionPoolMap();
    this.fetchPoolMapInterval = setInterval(
      () => this.fetchTransactionPoolMap(),
      POLL_INTERVAL
    );
  }
  componentWillUnmount() {
    clearInterval(this.fetchPoolMapInterval);
  }

  render() {
    return (
      <div className="TransactionPool">
        <h3>Transaction Pool</h3>
        <div>
          <Link to="/">Home</Link>
        </div>
        {Object.values(this.state.transactionPoolMap).map((transaction) => {
          return (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          );
        })}
        <hr />
        <Button bsSytle="danger" onClick={this.fetchMineTransactions}>
          Mine the Transaction
        </Button>
      </div>
    );
  }
}
export default TransactionPool;
