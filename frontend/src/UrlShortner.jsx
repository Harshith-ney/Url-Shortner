import React, { useState } from 'react';
import './styles/UrlShortner.css';
import axios from 'axios';
import ClickCharts from './components/ClickCharts';

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [clicks, setClicks] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [clickLogs, setClickLogs] = useState([]);

  const fetchClickLogs = async (slug) => {
    console.log("Fetching click logs for slug:", slug);
    try {
      const res = await axios.get(`http://localhost:3000/api/url/clicks/${slug}`);
      console.log("Click logs fetched:", res.data);
      setClickLogs(res.data);
    } catch (err) {
      console.error("Error fetching click logs:", err);
    }
  };

  const handleLongUrl = async () => {
    console.log("Shortening URL:", longUrl);
    try {
      const res = await axios.post('http://localhost:3000/api/url/shorten', {
        originalUrl: longUrl,
      });

      const short = res.data.shortUrl;
      console.log("Shortened URL:", short);
      setShortUrl(short);
      setError('');

      const slug = short.split('/').pop();
      console.log("Extracted slug:", slug);
      await fetchStats(slug);
    } catch (err) {
      console.error('Failed to shorten URL:', err);
      setError('Oops! Could not shorten the URL. Please try again.');
    }
  };

  const handleCopy = async () => {
    if (!shortUrl.trim()) return;

    console.log("Copying short URL:", shortUrl);
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);

      // Open in new tab
      window.open(shortUrl, '_blank');

      const slug = shortUrl.split('/').pop();
      console.log("Fetching stats after copy for slug:", slug);

      // Fetch stats immediately after copying
      await fetchStats(slug);

      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const fetchStats = async (slug) => {
    console.log("Fetching stats for slug:", slug);
    try {
      setLoadingStats(true);
      const statsRes = await axios.get(`http://localhost:3000/api/url/stats/${slug}`);
      console.log("Stats fetched:", statsRes.data);
      setClicks(Number(statsRes.data.clicks)); // Update clicks with the latest value
      setExpiry(new Date(statsRes.data.expiresAt).toLocaleString());
      await fetchClickLogs(slug); 
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleRefreshStats = async () => {
    if (!shortUrl) return;
    const slug = shortUrl.split('/').pop();
    console.log("Refreshing stats for slug:", slug);

    try {
      await fetchStats(slug); // Directly fetch stats without delay
    } catch (err) {
      console.error('Error refreshing stats:', err);
      setError('Failed to refresh stats. Please try again.');
    }
  };

  return (
    <div className="url-shortener-container">
      <div className="url-box">
        <h1>Shorten a long link</h1>
        <label className="input-label">Paste your long link here</label>
        <input
          className="url-input"
          type="text"
          placeholder="https://example.com/my-long-url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <button className="submit-btn" onClick={handleLongUrl}>
          Get your link for free <span className="arrow">→</span>
        </button>

        {shortUrl && (
          <div className="result-section">
            <div className="short-link-row">
              <a
                className="short-url-display short-link"
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortUrl}
              </a>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="stats-row">
              <span><strong>Clicks:</strong> {clicks}</span>
              <span><strong>Expires At:</strong> {expiry}</span>
            </div>

            <button
              className="refresh-btn"
              onClick={handleRefreshStats}
              disabled={loadingStats}
            >
              {loadingStats ? '🔄 Refreshing...' : '🔄 Refresh Stats'}
            </button>

            {clickLogs.length > 0 && (
              <div className="chart-section">
                <h3>Clicks Over Time</h3>
                <ClickCharts clickLogs={clickLogs} />
              </div>
            )}
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default UrlShortener;