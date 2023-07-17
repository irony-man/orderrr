const express = require('express');
const { signup, login, sendMailPass, setPass, postPass, logout } = require('../controllers/loginController')

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendmailpass", sendMailPass);
router.get("/setpass/:url", setPass);
router.post("/setpass/:url", postPass);
router.get("/logout", logout);

module.exports = router;