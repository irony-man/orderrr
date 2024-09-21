import { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Grid,
  CircularProgress,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Paper,
  FormHelperText,
} from "@mui/material";
import { useDispatch } from "react-redux";
import apis from "../../../redux/actions/apis";
import formatLib from "../../../utils/formatLib";
import { Link, useNavigate } from "react-router-dom";
import PriceDetails from "../../common/PriceDetails";
import { alertMessage } from "../../../redux/actions/alertsAction";
import { HttpBadRequestError } from "../../../redux/network";
import { resetCart } from "../../../redux/actions/userAction";
import AddressModal from "../../common/AddressModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CardModal from "../../common/CardModal";

const steps = ["Select Details", "Order Confirmation"];

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openAddress, setOpenAddress] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [instance, setInstance] = useState({});
  const [errors, setErrors] = useState({});
  const [designs, setDesigns] = useState([]);
  const [summary, setSummary] = useState({});
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initiate() {
      try {
        const [a, b, c] = await Promise.all([
          apis.getCartSummary(),
          apis.listAddress(),
          apis.listCard(),
        ]);
        setDesigns([...a.items]);
        setSummary({ ...a.summary });
        setAddresses(b.results);
        setCards(c.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, []);

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const response = await apis.placeOrder(instance);
      dispatch(
        alertMessage({
          message: "Orderrr placed!!",
          type: "success",
          open: true,
        })
      );
      setErrors({});
      dispatch(resetCart());
      setActiveStep(activeStep + 1);
      setInstance(response);
    } catch (error) {
      console.error(error);
      if (error instanceof HttpBadRequestError) {
        setErrors({ ...error.data });
      }
      dispatch(
        alertMessage({
          message: "Error placing the orderrr!!",
          type: "error",
          open: true,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const completeOrder = () => {
    navigate("/");
  };

  const CardPage = ({ card }) => (
    <div
      className={`w-100 row ${instance.card === card.uid ? "fw-bold" : ""}`}
    >
      <div className="col-12 text-uppercase mb-2">{card.name}</div>
      <div className="col-12 mb-1">Card No.: {card.card_number}</div>
      <div className="col-6">Name on Card: {card.name_on_card}</div>
      <div className="col-6">Card Expiry:{card.card_expiry}</div>
    </div>
  );

  return (
    <>
      <title>Place Order | Orderrr</title>
      {loading ? (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="container">
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box
            className="mt-5"
            sx={{
              borderRadius: "5px",
              color: "text.primary",
            }}
          >
            {activeStep ? (
              <Paper className="text-center" sx={{ px: 2, py: 5, mb: 2 }}>
                <Typography variant="h4">
                  Thank you for your <strong>Orderrr</strong>.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Your order is complete.{" "}
                  <strong>Orderrr Id: {instance.uid}</strong>. We have recieved
                  your order confirmation, and will send you an update when
                  your order has shipped.
                </Typography>
                <Button
                  variant="contained"
                  className="py-2 mt-4 px-4"
                  onClick={completeOrder}
                >
                  Complete Orderrr
                </Button>
              </Paper>
            ) : (
              <div className="row">
                <div className="col-lg-6 col-12">
                  <Paper sx={{ p: 3, mb: 2 }}>
                    <div className="mb-5">
                      <Typography variant="h6">Items!!</Typography>
                      {designs.map(({ design, uid }) => (
                        <div key={uid} className="mt-3 border">
                          <Link to={`/design/${design.uid}`} target="_blank">
                            <div className="row">
                              <div className="col-3">
                                <img
                                  className="design-img-small"
                                  src={design.image}
                                  alt={design.title}
                                />
                              </div>
                              <div className="col-9">
                                <Stack
                                  className="h-100 py-2"
                                  justifyContent="space-between"
                                >
                                  <div>
                                    <Typography variant="body1" noWrap={true}>
                                      {design.title}
                                    </Typography>
                                  </div>
                                  <Grid
                                    container
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <div className="d-flex align-items-end">
                                      <Typography
                                        variant="subtitle1"
                                        noWrap={true}
                                        color="text.primary"
                                      >
                                        {formatLib.formatCurrency(
                                          design.final_price
                                        )}
                                      </Typography>
                                      {design.discount ? (
                                        <Typography
                                          variant="body2"
                                          sx={{ ml: 1, mb: "3px" }}
                                          noWrap={true}
                                          color="text.primary"
                                        >
                                          <strike>
                                            {formatLib.formatCurrency(
                                              design.base_price
                                            )}
                                          </strike>
                                        </Typography>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </Grid>
                                </Stack>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>

                    <PriceDetails summary={summary} />
                  </Paper>
                </div>
                <div className="col-lg-6 col-12">
                  <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    sx={{ p: 2, mb: 2 }}
                  >
                    <div className="mb-5 ms-2">
                      <Typography variant="h6">Addresses!!</Typography>
                      {addresses.length ? (
                        <FormControl
                          className="ps-2"
                          fullWidth
                          error={errors.address}
                        >
                          <RadioGroup
                            name="address"
                            value={instance.address}
                            onChange={(e) =>
                              setInstance({
                                ...instance,
                                address: e.target.value,
                              })
                            }
                          >
                            {addresses.map((a) => (
                              <FormControlLabel
                                className="p-2 border w-100 mt-3"
                                key={a.uid}
                                value={a.uid}
                                control={<Radio />}
                                label={
                                  <Typography
                                    className={
                                      a.uid === instance.address
                                        ? "fw-bold"
                                        : ""
                                    }
                                    variant="body1"
                                  >
                                    {a.address_line}, {a.city}, {a.postal_code}
                                    , {a.state}, {a.country_display}
                                  </Typography>
                                }
                              />
                            ))}
                          </RadioGroup>
                          <FormHelperText>{errors.address}</FormHelperText>
                        </FormControl>
                      ) : (
                        <div className="p-3 mt-3 border">
                          <Typography variant="body1" className="mb-3">
                            No saved Addresses!!
                          </Typography>
                          <Button
                            fullWidth
                            onClick={() => setOpenAddress(true)}
                          >
                            <AddCircleIcon className="me-2" />
                            Add Address
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mb-5 ms-2">
                      <Typography variant="h6">Cards!!</Typography>
                      {cards.length ? (
                        <FormControl
                          className="ps-2"
                          fullWidth
                          required
                          error={errors.card}
                        >
                          <RadioGroup
                            name="card"
                            value={instance.card}
                            onChange={(e) =>
                              setInstance({
                                ...instance,
                                card: e.target.value,
                              })
                            }
                          >
                            {cards.map((card) => (
                              <FormControlLabel
                                className="p-2 border w-100 mt-3"
                                key={card.uid}
                                value={card.uid}
                                control={<Radio />}
                                label={
                                  <>
                                    <CardPage card={card} />
                                  </>
                                }
                              />
                            ))}
                          </RadioGroup>
                          <FormHelperText>{errors.card}</FormHelperText>
                        </FormControl>
                      ) : (
                        <div className="p-3 mt-3 border">
                          <Typography variant="body1" className="mb-3">
                            No saved Cards!!
                          </Typography>
                          <Button
                            fullWidth
                            onClick={() => setOpenCard(true)}
                          >
                            <AddCircleIcon className="me-2" />
                            Add Card
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <Button
                        variant="contained"
                        className="py-2 px-4"
                        type="submit"
                        disabled={
                          !designs.length || !addresses.length || !cards.length
                        }
                      >
                        Place Orderrr
                      </Button>
                    </div>
                  </Paper>
                </div>
              </div>
            )}
          </Box>
          <AddressModal
            open={openAddress}
            setOpen={setOpenAddress}
            saveAddress={(address) => setAddresses([...addresses, address])}
          />
          <CardModal
            open={openCard}
            setOpen={setOpenCard}
            saveCard={(card) => setCards([...cards, card])}
          />
        </div>
      )}
    </>
  );
}
