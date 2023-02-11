import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";


const AlurApproval = () => {
  document.title = "Alur Approval | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Alur Approval" pageTitle="Alur Approval" />
          <h3>Alur Approval</h3>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AlurApproval;
