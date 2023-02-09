import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { configureStore } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={configureStore({})}>
    <React.Fragment>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);