import React, { Component } from "react";
// import { Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import DashboardBar from "./DashboardBar";
import DashboardProvider from "./DashboardProvider";
class Dashboard extends Component {
  render() {
    return (
      <div>
        <DashboardLayout>
          <DashboardProvider>
            <DashboardBar />
            Welcome to CrytoCurrency Dashboard
          </DashboardProvider>
        </DashboardLayout>
        {/* <div> Welcome to crytocurrency dashboard</div> */}
        {/* <div>
          <Link to="/">Back to Home</Link>      
        </div> */}
      </div>
    );
  }
}
export default Dashboard;
