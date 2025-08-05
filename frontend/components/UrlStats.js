import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UrlStats = ({ slug }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/api/stats/${slug}`);
      setStats(response.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError('Failed to fetch stats. Please try again.');
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [slug]);

  if (!stats) return <p>{error || 'Loading...'}</p>;

  return (
    <div>
      <p>Original URL: {stats.originalUrl}</p>
      <p>Short URL: {stats.shortUrl}</p>
      <p>Clicks: {stats.clicks}</p>
      <p>Expires At: {new Date(stats.expiresAt).toLocaleString()}</p>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default UrlStats;
