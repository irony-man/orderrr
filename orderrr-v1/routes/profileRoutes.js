const { addressGet, addressEdit, addressDelete } = require("../controllers/addressController");
const { profileGet, cardGet, profileEdit, cardEdit, cardDelete } = require("../controllers/profileController");
const router = require('express').Router();
const auth = require('../middlewares/auth');

router.get("/account/:id", profileGet);
router.patch("/account", auth, profileEdit);
router.get("/card", auth, cardGet);
router.post("/card", auth, cardEdit);
router.delete("/card", auth, cardDelete);
router.get("/address", auth, addressGet);
router.post("/address", auth, addressEdit);
router.delete("/address", auth, addressDelete);


module.exports = router;