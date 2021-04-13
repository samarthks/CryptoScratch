import React, { Component } from "react";

export const DashboardContext = React.createContext();

export default class DashboardProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "dashboard",
      ...this.savedSettings(),
      setPage: this.setPage,
      confirmFavourites: this.confirmFavourites,
    };
  }

  confirmFavourites = () => {
    this.setState({
      firstVisit: false,
      page: "dashboard",
    });
    localStorage.setItem(
      "cryptodash",
      JSON.stringify({
        test: "hello",
      })
    );
  };

  savedSettings() {
    let data = JSON.parse(localStorage.getItem("cryptodash"));
    if (!data) {
      return { page: "settings", firstVisit: true };
    }
    return {};
  }
  setPage = (page) => this.setState({ page });

  render() {
    return (
      <DashboardContext.Provider value={this.state}>
        {this.props.children}
      </DashboardContext.Provider>
    );
  }
}
