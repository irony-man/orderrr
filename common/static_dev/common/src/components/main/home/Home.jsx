import { Box, Typography } from "@mui/material";
import DesignCards from "../../common/DesignCards";
import apis from "../../../redux/actions/apis";

const Home = () => {
  return (
    <div className="container">
      <title>Orderrr</title>
      <div className="hero-container ">
        <Box
          className="text-center "
          sx={{ maxWidth: "920px", color: "text.primary" }}
        >
          <Typography variant="h2" className="fw-normal mb-2">
            Welcome to <strong>Orderrr</strong>
          </Typography>
          <Typography variant="body1">
            Are you a designer with a passion for turning ideas into stunning
            visuals? <strong>Orderrr</strong> is the perfect platform for you
            to showcase and sell your unique designs to a global audience.
            Whether you specialize in graphics, illustrations, templates, or
            any other creative work, our marketplace is designed to help you
            reach potential buyers and turn your creative talents into profit.
          </Typography>
        </Box>
      </div>
      <DesignCards
        query={{ exclude_user_designs: true }}
        fetchFunc={apis.listDesign}
      />
    </div>
  );
};

export default Home;
