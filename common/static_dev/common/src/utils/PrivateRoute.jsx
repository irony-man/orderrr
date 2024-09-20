import { Outlet, Navigate, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const q = useLocation();
  const isLogged = localStorage.getItem('isLogged', false);

  return isLogged === 'true' ? <Outlet /> : <Navigate replace to={`/login/?next=${q.pathname}`} />;
};

export default PrivateRoute;
