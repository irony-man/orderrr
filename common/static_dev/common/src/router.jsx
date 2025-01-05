import {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav/Navbar.jsx";
import NotFound from "./components/NotFound.jsx";

import Login from "./views/login/Login.jsx";
import Signup from "./views/login/Signup.jsx";
import Setpass from "./views/login/SetPass.jsx";
import Sendmail from "./views/login/SendMail.jsx";
import LoginRoute from "./views/LoginRoute.jsx";
import PrivateRoute from "./views/PrivateRoute.jsx";
import Home from "./views/main/Home.jsx";
import Cart from "./views/main/Cart.jsx";
import WishList from "./views/main/WishList.jsx";
import Profile from "./views/profile/Profile.jsx";
import DesignForm from "./views/profile/DesignForm.jsx";
import ProfileEdit from "./views/profile/ProfileEdit.jsx";
import DesignPage from "./views/main/DesignPage.jsx";
import Messages from "./views/main/Messages.jsx";
import ProfileOrders from "./views/profile/ProfileOrders.jsx";
import PlaceOrder from "./views/main/PlaceOrder.jsx";
import DesignsPage from "./views/main/DesignsPage.jsx";

import { useLocation } from 'react-router-dom';
import { Box } from "@mui/material";


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return <></>;
};
function Paths() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/designs" element={<DesignsPage />} />
          <Route exact path="/design/:uid" element={<DesignPage />} />
          <Route element={<LoginRoute />}>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/password-reset" element={<Sendmail />} />
            <Route exact path="/verify/" element={<Setpass />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route exact path="/design/new" element={<DesignForm />} />
            <Route exact path="/design/:uid/edit" element={<DesignForm />} />
            <Route exact path="/messages" element={<Messages />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/wishlist" element={<WishList />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/profile/:uid" element={<Profile />} />
            <Route exact path="/profile/edit" element={<ProfileEdit />} />
            <Route exact path="/profile/edit/:id" element={<ProfileEdit />} />
            <Route exact path="/place" element={<PlaceOrder />} />
            <Route exact path="/orders" element={<ProfileOrders />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Box sx={{ pb: 5 }}></Box>
      </Router>
    </>
  );
}

export default Paths;
