import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isLogged = localStorage.getItem('isLogged', false);
  return isLogged ? <Outlet /> : <Navigate replace to="/login" />;
};

export default PrivateRoute;
