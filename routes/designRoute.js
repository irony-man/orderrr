const { designAdd, designEdit, designDelete, designGet } = require("../controllers/designController");
const router = require('express').Router();
const auth = require('../middlewares/auth');

router.get("/design/:id", designGet).post("/design", auth, designAdd);
router;
router.patch("/design", auth, designEdit);
router.delete("/design", auth, designDelete);

module.exports = router;
