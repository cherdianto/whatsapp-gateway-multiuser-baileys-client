import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";


const Notifikasi = () => {
  document.title = "Notifikasi | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Notifikasi" pageTitle="Notifikasi" />
          <h3>Notifikasi</h3>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Notifikasi;
