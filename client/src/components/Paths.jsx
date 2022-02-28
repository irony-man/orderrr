import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ProfileDesigns from "./main/Profile/ProfileDesigns";
import ProfileDesignAdd from "./main/Profile/ProfileDesignAdd";
import ProfileEdit from "./main/Profile/ProfileEdit";
import NotFound from "./main/Profile/NotFound";
import DesignPage from "./main/home/DesignPage";

function Paths() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<LoginRoute />}>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/password-reset" element={<Sendmail />} />
            <Route exact path="/verify/" element={<Setpass />} />
          </Route>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/design/:id" element={<DesignPage />} />
          <Route element={<PrivateRoute />}>
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/wishlist" element={<WishList />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/profile/designs" element={<ProfileDesigns />} />
            <Route
              exact
              path="/profile/design-new"
              element={<ProfileDesignAdd />}
            />
            <Route exact path="/profile/edit" element={<ProfileEdit />} />
            <Route exact path="/profile/:id" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default Paths;
