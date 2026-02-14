const express = require('express');
const USGSController = require('../controllers/usgs.controller');
const auth = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/checkPermission');

const router = express.Router();

router.get('/get-station', auth, checkPermission(['usgs:get-station']), USGSController.getusgsStation)

module.exports = router;
