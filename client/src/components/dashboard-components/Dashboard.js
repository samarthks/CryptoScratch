import React, { Component } from "react";
// import { Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import DashboardBar from "./DashboardBar";

class Dashboard extends Component {
  render() {
    return (
      <div className='bodu'>
          <DashboardBar />
          <DashboardLayout> Welcome to CrytoCurrency Dashboard</DashboardLayout>
          {/* <div> Welcome to crytocurrency dashboard</div> */}
          {/* <div>
          <Link to="/">Back to Home</Link>      
        </div> */}
      </div>
    );
  }
}
export default Dashboard;
