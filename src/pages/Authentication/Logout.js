import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import withRouter from '../../Components/Common/withRouter';
import { logoutUser } from "../../apiQuery/auth.query";
import { useUser } from '../../context/user.context'
// #LOGOUT
// import { logoutUser } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

const Logout = (props) => {
  // const dispatch = useDispatch();
  const {user, setUser} = useUser()
  const handleLogout = async () => {
    try {
      const res = await logoutUser()
      // console.log(res)
      setUser()
    } catch (error) {
      console.log()
    }
  }

  useEffect(() => {
    handleLogout()
  })

  // const { isUserLogout } = useSelector((state) => ({
  //   isUserLogout: state.Login.isUserLogout,
  // }));

  // useEffect(() => {
  //   // dispatch(logoutUser());
  // }, [dispatch]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);