const express = require('express');
const { profileDesignAdd, profileDesignEdit, profileDesignDelete } = require('../controllers/profileController');

const router = express.Router();

router.post("/designadd", profileDesignAdd);
router.patch("/designadd", profileDesignEdit);
router.delete("/designadd", profileDesignDelete);

module.exports = router;