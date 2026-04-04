const express = require('express');
const router = express.Router();
const { 
  createBanner, 
  getAllBanners, 
  updateBanner, 
  deleteBanner 
} = require('../controllers/banner.controller');

router.post('/', createBanner);
router.get('/', getAllBanners);
router.patch('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;