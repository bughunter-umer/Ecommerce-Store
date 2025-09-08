const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getAll);
router.post('/', customerController.create);

module.exports = router;
