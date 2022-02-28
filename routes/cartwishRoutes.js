const express = require('express');
const { cartAdd, cartRemove, wishAdd, wishRemove } = require('../controllers/cartwishController');

const router = express.Router();

router.post("/cart/add", cartAdd);
router.post("/cart/remove", cartRemove);
router.post("/wish/add", wishAdd);
router.post("/wish/remove", wishRemove);

module.exports = router;