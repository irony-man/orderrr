const User = require("../models/userModel");
const Design = require("../models/designModel");
const {
  cloudinary
} = require("../utils/cloudinaryUpload");

const designGet = (req, res) => {
  const {
    id
  } = req.params;
  Design.findOne({
      _id: id
    })
    .populate("owner", "_id username")
    .then((design) => {
      if (design) {
        res.json(design);
      } else {
        res.status(404).json({
          message: "No such product!!",
        })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!",
      })
    });
};

const designAdd = (req, res) => {
  const {
    image,
    type,
    price,
    title,
    description
  } = req.body;
  cloudinary.uploader
    .upload(image, {
      upload_preset: "orderrr",
      folder: "Orderrr/Designs",
      width: 1000,
      crop: "scale",
    })
    .then((result) => {
      const url =
        "https://res.cloudinary.com/shivam2001/image/upload/" +
        "c_fill,h_400,w_400,g_face/v" +
        result.version +
        "/" +
        result.public_id;
      User.findOne({
          email: req.session.user.email,
        })
        .then((user) => {
          if (user) {
            const created = new Date().toLocaleString("en-US", {
              hour12: true,
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
            Design({
                type,
                title,
                price,
                created,
                description,
                owner: user,
                image: {
                  full: result.secure_url,
                  thumb: url,
                  public_id: result.public_id,
                },
              })
              .save()
              .then((design) => {
                User.updateOne({
                    email: req.session.user.email,
                  }, {
                    $push: {
                      designs: design,
                    },
                  })
                  .then((result) => {
                    res.json(design);
                  })
                  .catch((err) => {
                    res.status(500).json({
                      message: "Something went wrong!",
                    });
                  });
              })
              .catch((err) => {
                res.status(500).json({
                  message: "Something went wrong!",
                });
              });
          } else {
            res.status(401).json({
              message: "Unauthorized!!",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "Something went wrong!",
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!",
      });
    });
};

const designEdit = (req, res) => {
  const {
    price,
    title,
    description,
    id
  } = req.body;
  Design.findOne({
      _id: id
    })
    .populate("owner")
    .then((design) => {
      if (design) {
        if (design.owner.email === req.session.user.email) {
          Design.updateOne({
              _id: id
            }, {
              price,
              title,
              description
            })
            .then((result) => {
              if (result.modifiedCount === 1) {
                res.json({
                  message: "Changes Saved!!",
                  status: true
                });
              } else {
                res.json({
                  message: "No changes to save!!"
                });
              }
            })
            .catch((err) => {
              res.status(500).json({
                message: "Something went wrong!!"
              });
            });
        } else {
          res.json({
            message: "Unauthorized User!!"
          });
        }
      }
      if (!design) {
        res.json({
          message: "No such product!!"
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!!"
      });
    });
};

const designDelete = (req, res) => {
  const {
    id
  } = req.body;
  Design.findOne({
      _id: id
    })
    .populate("owner")
    .then(async (design) => {
      if (design) {
        if (design.owner.email === req.session.user.email) {
          await Design.deleteOne({
            _id: id
          })
          await User.updateOne({
            email: req.session.user.email,
          }, {
            $pull: {
              designs: id,
            }
          });
          User.updateMany({
            cart: {
              $in: id
            }
          }, {
            $pull: {
              cart: id,
            }
          })
          User.updateMany({
            wishlist: {
              $in: id
            }
          }, {
            $pull: {
              wishlist: id,
            }
          })
          cloudinary.uploader.destroy(design.image.public_id);
          res.json({
            deleted: true,
            message: "Deleted the Design!!"
          });
        } else {
          res.json({
            message: "Unauthorized!!"
          })
        }
      }
      if (!design) {
        res.json({
          message: "No such product"
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong"
      })
    });
};

module.exports = {
  designGet,
  designAdd,
  designEdit,
  designDelete,
};