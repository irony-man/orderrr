const express = require("express");
const Billing = require("../models/billingModel");
const Design = require("../models/designModel");

const router = express.Router();

router.get("/home", (req, res) => {
  const {
    page, limit
  } = req.query;
  const options = {
    page: parseInt(page, 10) || 1,
    limit: limit || 8,
    sort: {
      _id: -1,
    },
    populate: ({
      path: 'owner',
      select: '_id username picture'
    })
  };
  Design.paginate({}, options)
    .then((designs) => {
      res.json({
        designs: designs.docs,
        hasMore: designs.hasNextPage,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});


module.exports = router;