const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/create-auth', authController.createAuth)

module.exports = router;