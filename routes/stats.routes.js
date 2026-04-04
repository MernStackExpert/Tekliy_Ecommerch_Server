const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/stats.controller');

router.get('/dashboard-stats', getAdminStats);

module.exports = router;