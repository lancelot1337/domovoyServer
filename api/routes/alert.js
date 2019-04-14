const express = require('express');

//for verbs and endpoints
const router = express.Router();

//importing controllers
const AlertsController = require('../controller/alerts');
router.get('/', AlertsController.alerts_get_all);

router.post('/', AlertsController.alerts_post);

router.get('/:id', AlertsController.alerts_get_single);

router.delete('/:id', AlertsController.alerts_delete);

module.exports = router;