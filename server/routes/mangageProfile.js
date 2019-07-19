'use strict'
const express = require('express');
const UserProfile = require('../controller/UserProfileOps');
const router = express.Router();

/* POST new users credentials */
router.post('/register', UserProfile.newUser);

/* POST login credentials */
router.post('/login', UserProfile.signin);
  
module.exports = router;