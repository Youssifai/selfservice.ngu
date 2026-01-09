// Serve static files for all non-API routes
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        // In Vercel, catch-all routes receive path as req.query.path (array)
        let urlPath;
        if (req.query.path === undefined || req.query.path === null) {
            urlPath = '/';
        } else if (Array.isArray(req.query.path)) {
            urlPath = req.query.path.length === 0 ? '/' : '/' + req.query.path.join('/');
        } else if (typeof req.query.path === 'string') {
            urlPath = '/' + req.query.path;
        } else {
            urlPath = req.url.split('?')[0] || '/';
        }
        
        // Ensure it starts with /
        if (!urlPath.startsWith('/')) {
            urlPath = '/' + urlPath;
        }
        
        // For root, serve index.html
        const cleanPath = (urlPath === '/' || urlPath === '') ? 'index.html' : urlPath.replace(/^\//, '');
        
        // Don't serve API routes
        if (cleanPath.startsWith('api/')) {
            return res.status(404).json({ error: 'Not found' });
        }
        
        // In Vercel, files are in the project root, but we need to go up from api/
        const baseDir = path.join(__dirname, '..');
        
        // Determine file path
        let filePath;
        if (cleanPath === 'index.html' || urlPath === '/') {
            filePath = path.join(baseDir, 'index.html');
        } else {
            filePath = path.join(baseDir, cleanPath);
        }
        
        // Check if file exists
        const fileExists = fs.existsSync(filePath);
        
        // If file doesn't exist, fall back to index.html for SPA routing
        if (!fileExists) {
            filePath = path.join(baseDir, 'index.html');
        }
        
        // Final check - if still no file, return 404
        if (!fs.existsSync(filePath)) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('File not found:', filePath);
            }
            return res.status(404).json({ error: 'Not found' });
        }
        
        const ext = path.extname(filePath);
        
        // Check if it's a binary file
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.svg' || ext === '.ico') {
            const binaryContent = fs.readFileSync(filePath);
            const contentType = ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`;
            res.setHeader('Content-Type', contentType);
            res.send(binaryContent);
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Set content type
        let contentType = 'text/html';
        if (ext === '.css') {
            contentType = 'text/css';
        } else if (ext === '.js') {
            contentType = 'application/javascript';
        } else if (ext === '.json') {
            contentType = 'application/json';
        }
        
        res.setHeader('Content-Type', contentType);
        res.send(content);
    } catch (error) {
        console.error('Error serving file:', error.message);
        res.status(500).json({ 
            error: 'Internal server error',
            ...(process.env.NODE_ENV !== 'production' && { message: error.message })
        });
    }
};
