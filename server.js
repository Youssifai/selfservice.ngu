// Local development server - uses same data as Vercel deployment
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Import the API routes from api/index.js
const apiApp = require('./api/index.js');

// Mount API routes
app.use('/api', apiApp);

// For local development
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
