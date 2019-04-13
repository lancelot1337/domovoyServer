const express = require('express');

//for verbs and endpoints
const router = express.Router();


//importing controllers
const AdminsController = require('../controller/admins');
router.get('/', AdminsController.home);

module.exports = router;