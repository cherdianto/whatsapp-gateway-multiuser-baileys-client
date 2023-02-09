import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";


const DashboardEcommerce = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Dashboard" pageTitle="Dashboards" />
          <h3>Dashboard</h3>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
