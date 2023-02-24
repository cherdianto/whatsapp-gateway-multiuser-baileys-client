import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";


const Manual = () => {
  document.title = "Manual | Wabot - Whatsapp Gateway Multiuser";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manual" pageTitle="Manuals" />
          <h3>Manual</h3>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Manual;
