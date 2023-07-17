import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./main/nav/Navbar";
import Login from "./login/Login";
import Signup from "./login/Signup";
import Setpass from "./login/SetPass";
import Sendmail from "./login/SendMail";
import LoginRoute from "../utils/LoginRoute";
import PrivateRoute from "../utils/PrivateRoute";
import Home from "./main/home/Home";
import Cart from "./main/home/Cart";
import WishList from "./main/home/WishList";
import Profile from "./main/Profile/Profile.jsx";
import ProfileDesignAdd from "./main/Profile/ProfileDesignAdd";
import ProfileEdit from "./main/Profile/ProfileEdit";
import NotFound from "./main/NotFound";
import DesignPage from "./main/home/DesignPage";
import Messages from "./main/home/Messages";
import { Box } from "@mui/material";
import ProfileOrders from "./main/Profile/ProfileOrders";
import PlaceOrder from "./main/home/PlaceOrder";

function Paths() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/product/:id" element={<DesignPage />} />
          <Route exact path="/place" element={<PlaceOrder />} />
          <Route element={<LoginRoute />}>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/password-reset" element={<Sendmail />} />
            <Route exact path="/verify/" element={<Setpass />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route exact path="/messages" element={<Messages />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/wishlist" element={<WishList />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/profile/:id" element={<Profile />} />
            <Route exact path="/profile/new" element={<ProfileDesignAdd />} />
            <Route exact path="/profile/edit" element={<ProfileEdit />} />
            <Route exact path="/profile/orders" element={<ProfileOrders />} />
            <Route exact path="/profile/edit/:id" element={<ProfileEdit />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Box sx={{ pb: 5 }}></Box>
      </Router>
    </>
  );
}

export default Paths;
