const {
  encrypt,
  decrypt
} = require("../utils/crypto");
const Address = require("../models/addressModel");

const addressGet = (req, res) => {
  Address.find({
      owner: req.session.user._id,
    })
    .then((addresses) => {
      addresses.forEach((address) => {
        address.pincode = decrypt(address.pincode)
        address.fullAddress = decrypt(address.fullAddress)
      });
      res.json(addresses);
    })
    .catch((err) =>
      res.status(500).json({
        message: "Something went wrong!!",
      })
    );
};

const addressEdit = (req, res) => {
  var {
    pincode,
    fullAddress,
    id
  } = req.body;
  pincode = encrypt(pincode.toString());
  fullAddress = encrypt(fullAddress);
  Address.findOne({
      _id: id,
    })
    .then((address) => {
      if (address) {
        Address.updateOne({
          _id: id,
        }, {
          pincode,
          fullAddress,
        }).then((result) => {
          if (result.modifiedCount === 1) {
            res.json({
              message: "Address updated!!",
              id: id,
            });
          } else {
            res.json({
              message: "Nothing to update!!",
            });
          }
        });
      }
      if (!address) {
        if (id === "" || id === undefined) {
          Address({
              pincode,
              fullAddress,
              owner: req.session.user._id,
            })
            .save()
            .then((address) => {
              res.json({
                message: "Address Added!!",
                id: address._id,
              });
            })
            .catch((err) =>
              res.status(500).json({
                message: "Something went wrong!!",
              })
            );
        } else {
          res.json({
            message: "Invalid ID!!",
          });
        }
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!!",
      });
    });
};

const addressDelete = (req, res) => {
  const {
    id
  } = req.body;
  Address.deleteOne({
      _id: id,
      owner: req.session.user._id,
    })
    .then((result) => {
      if (result.deletedCount === 1) {
        res.json({
          message: "Address deleted!!",
          deleted: true,
        });
      } else {
        res.json({
          message: "Unauthorized user!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!!",
      });
    });
};

module.exports = {
  addressGet,
  addressEdit,
  addressDelete,
};