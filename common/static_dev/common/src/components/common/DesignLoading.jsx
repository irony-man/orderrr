import Skeleton from "@mui/material/Skeleton";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

export default function DesignLoading() {
  return (
    <Card>
      <CardHeader
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        }
        title={
          <Typography variant="body1">
            <Skeleton
              animation="wave"
              height={20}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          </Typography>
        }
        subheader={<Skeleton animation="wave" height={16} width="40%" />}
      />
      <Skeleton sx={{ height: 300 }} animation="wave" variant="rectangular" />
      <CardContent>
        <Skeleton animation="wave" height={40} />
      </CardContent>
      <CardActions
        sx={{ p: 2, justifyContent: "space-between" }}
        disableSpacing
      >
        <Typography variant="h5" width="50%">
          <Skeleton animation="wave" />
        </Typography>
        <div className="d-flex">
          <Skeleton
            animation="wave"
            variant="circular"
            width={24}
            height={24}
            className="me-2"
          />
          <Skeleton
            animation="wave"
            variant="circular"
            width={24}
            height={24}
          />
        </div>
      </CardActions>
    </Card>
  );
}
