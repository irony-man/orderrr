const User = require('../models/userModel');
const Design = require('../models/designModel');

const cartAdd = (req, res) => {
  const {
    id,
  } = req.body;
  Design.findOne({
      _id: id
    })
    .then(design => {
      if (design) {
        User.updateOne({
            email: req.session.user.email
          }, {
            $push: {
              cart: design
            }
          })
          .then(result => {
            res.json(design)
          })
          .catch(err => {
            res.status(500).json({
              message: 'Unauthorized!!'
            });
          })
      }
      if (!design) {
        res.json({
          message: "No such product!!"
        })
      }
    })
    .catch(err => {
      res.json({
        message: "Something went wrong!!"
      })
    })
}

const cartRemove = (req, res) => {
  const {
    id,
  } = req.body;
  User.updateOne({
      email: req.session.user.email
    }, {
      $pull: {
        cart: id
      }
    })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: 'Unauthorized!!'
      });
    })
}
const wishAdd = (req, res) => {
  const {
    id,
  } = req.body;
  Design.findOne({
      _id: id
    })
    .then(design => {
      if (design) {
        User.updateOne({
            email: req.session.user.email
          }, {
            $push: {
              wishlist: design
            }
          })
          .then(result => {
            res.json(design)
          })
          .catch(err => {
            res.status(500).json({
              message: 'Unauthorized!!'
            });
          })
      }
      if (!design) {
        res.json({
          message: "No such product!!"
        })
      }
    })
    .catch(err => {
      res.json({
        message: "Something went wrong!!"
      })
    })
}

const wishRemove = (req, res) => {
  const {
    id,
  } = req.body;
  User.updateOne({
      email: req.session.user.email
    }, {
      $pull: {
        wishlist: id
      }
    })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: 'Unauthorized!!'
      });
    })
}


module.exports = {
  cartAdd,
  cartRemove,
  wishAdd,
  wishRemove
}