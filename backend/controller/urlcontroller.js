const Url = require('../models/url');
const { nanoid } = require('nanoid');
const redisClient = require('../utils/redisClient');
const { isValidUrl } = require('../utils/validators');
const ClickLog = require('../models/clickLog'); // Ensure this model exists and is imported

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const DEFAULT_TTL_SECONDS = 15 * 24 * 60 * 60; // 15 days

exports.shortenUrl = async (req, res) => {
  console.log("Received request to shorten URL:", req.body);
  const { originalUrl } = req.body;

  if (!isValidUrl(originalUrl)) {
    console.error("Invalid URL:", originalUrl);
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const slug = nanoid(6);
  const expiresAt = new Date(Date.now() + DEFAULT_TTL_SECONDS * 1000);

  try {
    console.log("Creating URL with slug:", slug);
    await Url.create({ slug, originalUrl, expiresAt });

    console.log("Saving to Redis with TTL:", DEFAULT_TTL_SECONDS);
    await redisClient.setEx(slug, DEFAULT_TTL_SECONDS, originalUrl);

    res.json({ 
      shortUrl: `${BASE_URL}/${slug}`,
      expiresAt
    });
  } catch (err) {
    console.error("Error in shortenUrl:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.redirectUrl = async (req, res) => {
  const { slug } = req.params;
  console.log("Redirecting for slug:", slug);

  try {
    const cachedUrl = await redisClient.get(slug);
    if (cachedUrl) {
      console.log("Found URL in Redis:", cachedUrl);
      const cachedClicks = await redisClient.incr(`clicks:${slug}`);
      console.log(`Updated Redis clicks for slug ${slug}: ${cachedClicks}`);

      await ClickLog.create({
        slug,
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.redirect(cachedUrl);
    }

    console.log("URL not found in Redis, falling back to MongoDB");
    const url = await Url.findOne({ slug });
    if (url) {
      console.log("Found URL in MongoDB:", url.originalUrl);
      url.clicks++;
      await url.save();

      console.log("Syncing Redis with MongoDB data");
      await redisClient.setEx(slug, DEFAULT_TTL_SECONDS, url.originalUrl);
      await redisClient.set(`clicks:${slug}`, url.clicks);

      await ClickLog.create({
        slug,
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.redirect(url.originalUrl);
    } else {
      console.error("Slug not found:", slug);
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (err) {
    console.error("Error in redirectUrl:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getUrlStats = async (req, res) => {
  const { slug } = req.params;
  console.log("Fetching stats for slug:", slug);

  try {
    const url = await Url.findOne({ slug });
    if (!url) {
      console.error("Slug not found in MongoDB:", slug);
      return res.status(404).json({ error: 'URL not found' });
    }

    const cachedClicks = await redisClient.get(`clicks:${slug}`);
    console.log("Cached clicks from Redis:", cachedClicks);
    const clicks = cachedClicks ? parseInt(cachedClicks, 10) : url.clicks;

    if (!cachedClicks || clicks !== url.clicks) {
      console.log("Syncing Redis clicks with MongoDB clicks");
      await redisClient.set(`clicks:${slug}`, clicks);
    }

    res.json({
      originalUrl: url.originalUrl,
      shortUrl: `${BASE_URL}/${slug}`,
      clicks,
      expiresAt: url.expiresAt,
    });
  } catch (err) {
    console.error("Error in getUrlStats:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

