import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";


const App = () => {
  document.title = "App | Velzon - React Admin & App Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="App" pageTitle="Apps" />
          <h3>App</h3>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default App;
