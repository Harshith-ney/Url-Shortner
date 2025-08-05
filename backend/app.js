const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlroutes');
const { redirectUrl } = require('./controller/urlcontroller');

const app = express();
app.use(cors());
app.use(express.json());

// Route to redirect from short URL
app.get('/:slug', redirectUrl);

// All API routes for creating shortened URL
app.use('/api/url', urlRoutes);

// Global error handler
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
const errorHandler = (err, req, res, next) => {
    console.error("Global Error:", err.message);
    res.status(500).json({
        status: "error",
        message: err.message || "Something went wrong",
    });
};

app.use(errorHandler);

module.exports = app;