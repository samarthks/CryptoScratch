import React, { Component } from "react";
// import { Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import DashboardBar from "./DashboardBar";
import DashboardProvider from "./DashboardProvider";
import Settings from "./dashboaard-settings/Settings";
class Dashboard extends Component {
  render() {
    return (
      <div>
        <DashboardLayout>
          <DashboardProvider>
            <DashboardBar />
           <Settings />
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
