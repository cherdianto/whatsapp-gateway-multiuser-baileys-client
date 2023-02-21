import React, { useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
// import { useDispatch } from "react-redux";
import { useUser } from "../context/user.context";
import useAuth from "../hooks/useAuth";
import Loader from '../Components/Common/Loader'
// import { useProfile } from "../Components/Hooks/UserHooks";
// #LOGOUT
// import { logoutUser } from "../store/actions";

const AuthProtected = (props) => {
  // const dispatch = useDispatch();
  const {currentUser, isLoading, isError} = useAuth({ redirect: 'login'})
  const { user, setUser } = useUser(currentUser)
  // const { userProfile, loading, token } = useProfile();
  const [loading, setloading] = useState(false)

  useEffect(()=> {
    if(!currentUser && !isLoading && !isError){
      console.log('lagi loading nih')
      setloading(true)
    } else {
      console.log('nggak loading')
      setloading(false)
    }
  },[isLoading, currentUser, isError, useAuth])

  if(loading){
    return (
      <Loader />
    )
  }

  if (!currentUser && isError && !isLoading) {
    console.log('redirect to login')
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };