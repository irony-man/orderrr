const auth = (req, res, next) => {
 if (req.session.user === undefined) {
  res.json({
   message: "Login to continue!!"
  });
 } else {
  next();
 }
};

module.exports = auth;