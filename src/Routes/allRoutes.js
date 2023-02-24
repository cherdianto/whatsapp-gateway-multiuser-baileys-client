import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
// import Dashboard from "../pages/Dashboard";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfileSettings from "../pages/Profile/UserProfileSetting";
import Error404 from "../pages/Escape/error404";
import DeviceList from "../pages/Device";
import Message from "../pages/Message";

const authProtectedRoutes = [
  
  // { path: "/dashboard", component: <Dashboard/> },
  { path: "/device", component: <DeviceList/> },
  { path: "/message", component: <Message/> },
  { path: "/profile", component: <UserProfileSettings/> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/device" />
  },
  { path: "*", component: <Error404 />}
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout/> },
  { path: "/login", component: <Login/> },
  { path: "/forgot-password", component: <ForgetPasswordPage/> },
  { path: "/register", component: <Register/> },
];

const escapeRoutes = [
  // Authentication Page
  { path: "/", component: <Register/>, exact: false },
];

export { authProtectedRoutes, publicRoutes, escapeRoutes };