import { Link } from "react-router-dom";
import {
  CircularProgress,
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import formatLib from "../../utils/formatLib";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const DesignCard = ({ design = {}, wishlistFunc, cartFunc }) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            src={design.user.display_picture_url}
            component={Link}
            to={`/profile/${design.user?.uid}`}
            sx={{
              ":hover": { color: "background.paper" },
            }}
          />
        }
        title={
          <Typography
            variant="body1"
            component={Link}
            to={`/profile/${design.user?.uid}`}
            sx={{
              color: "text.primary",
              ":hover": { color: "text.primary" },
            }}
          >
            {design.user.username}
          </Typography>
        }
        subheader={dayjs(formatLib.formatDateTime(design.created)).fromNow()}
      />
      <Link to={`/design/${design.uid}`} style={{ textDecoration: "none" }}>
        <CardMedia
          component="img"
          height="300"
          image={design.image_thumbnail_url}
          alt={design.title}
        />
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            noWrap={true}
            color="text.primary"
          >
            {design.title}
          </Typography>
        </CardContent>
      </Link>
      <CardActions
        sx={{ p: 2, justifyContent: "space-between" }}
        disableSpacing
      >
        <div className="d-flex align-items-end">
          <Typography variant="h5" noWrap={true} color="text.primary">
            {formatLib.formatCurrency(design.final_price)}
          </Typography>
          {design.discount ? (
            <Typography
              variant="body2"
              sx={{ ml: 1, mb: "3px" }}
              noWrap={true}
              color="text.primary"
            >
              <strike>{formatLib.formatCurrency(design.base_price)}</strike>
            </Typography>
          ) : (
            <></>
          )}
        </div>

        {!design.is_yours ? (
          wishlistFunc ? (
            <div>
              <IconButton
                sx={{ color: "text.primary" }}
                onClick={wishlistFunc}
              >
                {design.wishlistLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Tooltip
                    title={
                      design.cart_uid
                        ? "Remove from wishlist!!"
                        : "Add to wishlist!!"
                    }
                  >
                    {design.wishlist_uid ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </Tooltip>
                )}
              </IconButton>
              <IconButton sx={{ color: "text.primary" }} onClick={cartFunc}>
                {design.cartLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Tooltip
                    title={
                      design.cart_uid
                        ? "Go to cart!!"
                        : design.stock
                          ? "Add to cart!!"
                          : "Not enough stock!!"
                    }
                  >
                    {design.cart_uid ? (
                      <ShoppingCartOutlinedIcon />
                    ) : design.stock ? (
                      <AddShoppingCartIcon />
                    ) : (
                      <ProductionQuantityLimitsIcon />
                    )}
                  </Tooltip>
                )}
              </IconButton>
            </div>
          ) : (
            <></>
          )
        ) : (
          <IconButton
            sx={{ color: "text.primary", ":hover": { color: "text.primary" } }}
            component={Link}
            to={`/design/${design.uid}/edit`}
          >
            <EditIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default DesignCard;
