import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfileSettings from "../pages/Profile/UserProfileSetting";
import Error404 from "../pages/Escape/error404";
import App from "../pages/Apps";
import User from "../pages/User";
import Setting from "../pages/Setting";
import Manual from "../pages/Manual";
import DosenPembimbing from "../pages/Setting/FormOption/DosenPembimbing";
import KepalaLab from "../pages/Setting/FormOption/KepalaLab";
import Laboran from "../pages/Setting/FormOption/Laboran";
import AlurApproval from "../pages/Setting/AlurApproval";
import Notifikasi from "../pages/Setting/Notifikasi";
import UserProfile from "../pages/Profile/UserProfile";

const authProtectedRoutes = [
  
  { path: "/dashboard", component: <Dashboard/> },
  { path: "/app", component: <App/> },
  { path: "/user", component: <User/> },
  { path: "/setting", component: <Setting/> },
  { path: "/manual", component: <Manual/> },
  { path: "/dosen-pembimbing", component: <DosenPembimbing/> },
  { path: "/kepala-lab", component: <KepalaLab/> },
  { path: "/laboran", component: <Laboran/> },
  { path: "/alur-approval", component: <AlurApproval/> },
  { path: "/notifikasi", component: <Notifikasi/> },
  // { path: "/profile", component: <UserProfile/> },
  // { path: "/index", component: <Dashboard/> },

  //User Profile
  { path: "/profile", component: <UserProfileSettings/> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />
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