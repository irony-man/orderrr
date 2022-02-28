const express = require('express');
const Design = require('../models/designModel');

const router = express.Router();

router.get("/home", (req, res) => {
  const {
    page
  } = req.query;
  const options = {
    page: parseInt(page, 10) || 1,
    limit: 6,
    populate: 'owner',
    sort: {
      _id: -1
    },
  };
  Design.paginate({}, options)
    .then(designs => {
      res.json({
        designs: designs.docs,
        hasMore: designs.hasNextPage
      })
    })
    .catch(err => {
      res.json(err)
    })
});

module.exports = router;