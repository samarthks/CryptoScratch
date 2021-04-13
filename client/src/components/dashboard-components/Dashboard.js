import React, { Component } from "react";
import DashboardLayout from "./DashboardLayout";
import DashboardBar from "./DashboardBar";
import DashboardProvider from "./DashboardProvider";
import Settings from "./dashboaard-settings/Settings";
import Content from "./dashboard-shared/Content";
class Dashboard extends Component {
  render() {
    return (
      <div>
        <DashboardLayout>
          <DashboardProvider>
            <DashboardBar />
            <Content>
              <Settings />
            </Content>
          </DashboardProvider>
        </DashboardLayout>
      </div>
    );
  }
}
export default Dashboard;
