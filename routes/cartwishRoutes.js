const express = require('express');
const { cartAdd, cartRemove, wishAddRem } = require('../controllers/cartwishController');
const auth = require("../middlewares/auth")

const router = express.Router();

router.post("/cart/add", auth, cartAdd);
router.post("/cart/remove", auth, cartRemove);
router.post("/wish/addrem", auth, wishAddRem);

module.exports = router;