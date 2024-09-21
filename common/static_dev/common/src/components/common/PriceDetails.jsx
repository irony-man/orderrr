import { Tooltip, Typography } from "@mui/material";
import GapLine from "./GapLine";
import formatLib from "../../utils/formatLib";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function PriceDetails({ summary }) {
  return (
    <div>
      <Typography variant="h6">Price Details</Typography>
      <hr />
      <GapLine
        alignValue="end"
        heading="Total items in the cart"
        value={summary.total_items.toString().padStart(2, "0")}
      />
      <GapLine
        alignValue="end"
        heading="Total price of items"
        value={formatLib.formatCurrency(summary.item_total)}
      />
      <GapLine
        alignValue="end"
        heading={
          <>
            Delivery Charges
            <Tooltip
              sx={{ ml: 1 }}
              title={summary.delivery_text}
            >
              <InfoOutlinedIcon />
            </Tooltip>
          </>
        }
        value={
          summary.delivery_charge ? (
            formatLib.formatCurrency(summary.delivery_charge)
          ) : (
            <span className="text-success">FREE</span>
          )
        }
      ></GapLine>
      <hr />
      <GapLine
        alignValue="end"
        heading="Total Amount"
        value={formatLib.formatCurrency(summary.total_price)}
      />
    </div>
  );
}
