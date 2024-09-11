import React from "react";
import { useCookies } from "react-cookie";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const [cookie, setCookie] = useCookies();
  return cookie.isLogged ? <Outlet /> : <Navigate replace to="/login" />;
};

export default PrivateRoute;
