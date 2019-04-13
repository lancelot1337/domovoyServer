const express = require('express');

//for verbs and endpoints
const router = express.Router();


//importing controllers
const UsersController = require('../controller/users');
router.get('/', UsersController.home);

module.exports = router;