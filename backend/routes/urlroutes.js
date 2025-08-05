const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getUrlStats } = require('../controller/urlcontroller');
const ClickLog = require('../models/clickLog');

router.post('/shorten', shortenUrl);
router.get('/stats/:slug', getUrlStats);
router.get('/:slug', redirectUrl);  // This will handle redirect + clicks


// GET /api/url/clicks/:slug - Returns all click logs for a slug
router.get('/clicks/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
      const logs = await ClickLog.find({ slug }).sort({ timestamp: 1 });
      res.json(logs);
    } catch (err) {
      console.error("Failed to fetch click logs:", err);
      res.status(500).json({ error: 'Failed to fetch click logs' });
    }
  });

module.exports = router;