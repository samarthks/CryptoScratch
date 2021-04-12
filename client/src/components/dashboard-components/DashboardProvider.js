import React, { Component } from "react";

export const DashboardContext = React.createContext();
export default class DashboardProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "settings",
      setPage:this.setPage
    };
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
