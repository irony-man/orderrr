import React from "react";
import { useCookies } from "react-cookie";
import { Outlet, Navigate } from "react-router-dom";

const LoginRoute = () => {
  const [cookie] = useCookies();
  return cookie.isLogged ? <Navigate replace to="/" /> : <Outlet />;
};

export default LoginRoute;
