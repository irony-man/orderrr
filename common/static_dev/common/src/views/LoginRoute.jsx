import { Outlet, Navigate } from "react-router-dom";

const LoginRoute = () => {
  const isLogged = localStorage.getItem('isLogged', false);

  return isLogged === 'true' ? <Navigate replace to="/" /> : <Outlet />;
};

export default LoginRoute;
