const express = require("express");
const Design = require("../models/designModel");

const router = express.Router();

router.get("/product/:id", (req, res) => {
  const { id } = req.params;
  Design.findOne({ _id: id })
  .populate("owner")
    .then((design) => {
      res.json(design);
    })
    .catch((err) => {
      res.status(500);
    });
});

module.exports = router;
