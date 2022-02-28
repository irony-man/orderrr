const User = require("../models/userModel");
const Design = require("../models/designModel");
const { cloudinary } = require("../utils/cloudinaryUpload");

const profileDesignAdd = (req, res) => {
  const { image, type, price, title, description } = req.body;
  cloudinary.uploader
    .upload(image, {
      upload_preset: "orderrr",
      width: 1000,
      crop: "scale",
    })
    .then((result) => {
      const url =
        "https://res.cloudinary.com/shivam2001/image/upload/" +
        "c_fill,h_500,w_500,g_face/v" +
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
                User.updateOne(
                  {
                    email: req.session.user.email,
                  },
                  {
                    $push: {
                      designs: design,
                    },
                  }
                )
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

const profileDesignEdit = (req, res) => {
  const { price, title, description, id } = req.body;
  Design.findOne({ _id: id })
    .populate("owner")
    .then((design) => {
      if (design) {
        if (design.owner.email === req.session.user.email) {
          Design.updateOne({ _id: id }, { price, title, description })
            .then((result) => {
              res.json(result.modifiedCount);
            })
            .catch((err) => {
              res.json({ message: "Internal error" });
            });
        }
      } else {
        res.json({ message: "No such product" });
      }
    })
    .catch((err) => {
      res.json({ message: "Unauthorized User" });
    });
};

const profileDesignDelete = (req, res) => {
  const { id } = req.body;
  Design.findOne({ _id: id })
    .populate("owner")
    .then((design) => {
      if (design) {
        if (design.owner.email === req.session.user.email) {
          Design.deleteOne({ _id: id }).then((result) => {
            res.json(result.deletedCount);
          });
        }
      } else {
        res.json({ message: "No such product" });
      }
    })
    .catch((err) => res.json({ message: "Unauthorized User" }));
};

module.exports = {
  profileDesignAdd,
  profileDesignEdit,
  profileDesignDelete,
};
