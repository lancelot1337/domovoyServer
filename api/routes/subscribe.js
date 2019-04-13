const express = require('express');

//for verbs and endpoints
const router = express.Router();

//importing controllers
const SubscribesController = require('../controller/subscription');
router.get('/', SubscribesController.subscribes_get_all);

router.post('/', SubscribesController.subscribes_post);

router.get('/:id', SubscribesController.subscribes_get_single);

router.delete('/:id', SubscribesController.subscribes_delete);

module.exports = router;