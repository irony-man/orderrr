import { Box, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import BasicEdit from "./Edit/BasicEdit";
import AddressEdit from "./Edit/AddressEdit";
import BillingEdit from "./Edit/BillingEdit";
import NotFound from "../NotFound";

const ProfileEdit = () => {
  const links = [
    "/profile/edit",
    "/profile/edit/billing",
    "/profile/edit/address",
  ];
  const comp = [<><BasicEdit /></>, <><BillingEdit /></>, <><AddressEdit /></>];
  const [value, setValue] = useState(links.indexOf(window.location.pathname));
  const icons = [<><InfoIcon /></>, <><AccountBalanceIcon /></>, <><HomeIcon /></>];
  function handleChange(e, v) {
    setValue(v);
  }
  return (
    <>
      <Box className="container text-center" sx={{ color: "text.primary",
        bgcolor: "background.paper", }}>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
        >
          {["Basic Info", "Billing", "Address"].map((text, index) => (
            <Tab
              key={index}
              component={Link}
              to={links[index]}
              iconPosition="start"
              icon={<div className="mr-2">{icons[index]}</div>}
              label={text}
              value={index}
              sx={{ ":hover": { color: "inherit" } }}
            />
          ))}
        </Tabs>
        <Box sx={{py: 5}}>
          {comp[value] || <NotFound />}
        </Box>
      </Box>
    </>
  );
};

export default ProfileEdit;
