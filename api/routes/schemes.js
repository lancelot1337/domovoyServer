const express = require('express');

//for verbs and endpoints
const router = express.Router();

//importing controllers
const SchemesController = require('../controller/schemes');
router.get('/', SchemesController.schemes_get_all);

router.post('/', SchemesController.schemes_post);

router.get('/:id', SchemesController.schemes_get_single);

router.delete('/:id', SchemesController.schemes_delete);

module.exports = router;