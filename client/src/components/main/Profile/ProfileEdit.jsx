import { Box, Grid, useMediaQuery, Tabs, Tab, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const links = [
    "/profile/edit",
    "/profile/edit/billing",
    "/profile/edit/address",
  ];
  const comp = [<><BasicEdit /></>, <><BillingEdit /></>, <><AddressEdit /></>];
  const [value, setValue] = useState(links.indexOf(window.location.pathname));
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const icons = [<><InfoIcon /></>, <><AccountBalanceIcon /></>, <><HomeIcon /></>];
  function handleChange(e, v) {
    setValue(v);
  }
  return (
    <>
      <Box sx={{ m: "20px 5vw 0", color: "text.primary" }}>
        <Grid container justifyContent="space-between">
          <Grid item md={2} xs={12}>
            <Tabs
              value={value}
              onChange={handleChange}
              orientation={isMatch ? "horizontal" : "vertical"}
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {["Basic Info", "Billing", "Address"].map((text, index) => (
                <Tab
                  key={index}
                  component={Link}
                  to={links[index]}
                  icon={icons[index]}
                  label={text}
                  iconPosition="start"
                  value={index}
                  sx={{ ":hover": { color: "inherit" } }}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid md={9.5} xs={12} item>
            <Box sx={{ mt: isMatch ? 5 : 0 }}></Box>
            {comp[value] || <NotFound />}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileEdit;
