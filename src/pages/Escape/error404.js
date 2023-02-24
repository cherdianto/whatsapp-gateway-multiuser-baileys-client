import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";


const Error404 = () => {
  document.title = "Dashboard | Wabot - Whatsapp Gateway Multiuser";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* <BreadCrumb title="Dashboard" pageTitle="Dashboards" /> */}
          <h3>Error page</h3>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Error404;
