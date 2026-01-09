// Serve static files and handle SPA routing
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        // Get the requested path
        let urlPath = req.url.split('?')[0] || '/';
        
        if (req.query.path !== undefined && req.query.path !== null) {
            if (Array.isArray(req.query.path)) {
                urlPath = req.query.path.length === 0 ? '/' : '/' + req.query.path.join('/');
            } else if (typeof req.query.path === 'string') {
                urlPath = '/' + req.query.path;
            }
        }
        
        // Normalize path
        if (!urlPath.startsWith('/')) {
            urlPath = '/' + urlPath;
        }
        
        // Don't serve API routes
        if (urlPath.startsWith('/api/')) {
            return res.status(404).json({ error: 'Not found' });
        }
        
        // Determine file to serve
        let cleanPath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
        
        // In Vercel, the project root is one level up from the api folder
        const baseDir = path.resolve(__dirname, '..');
        
        // Try to serve the requested file first (for static assets like CSS, JS)
        let filePath = path.join(baseDir, cleanPath);
        
        // If file doesn't exist and it's not a root request, try to serve it as a static file
        if (!fs.existsSync(filePath)) {
            // For SPA routing, always fall back to index.html
            filePath = path.join(baseDir, 'index.html');
        }
        
        // Final check
        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            console.error('Base dir:', baseDir);
            console.error('Request URL:', req.url);
            return res.status(404).json({ error: 'Not found' });
        }
        
        const ext = path.extname(filePath);
        
        // Determine content type
        let contentType = 'text/html';
        if (ext === '.css') {
            contentType = 'text/css';
        } else if (ext === '.js') {
            contentType = 'application/javascript';
        } else if (ext === '.json') {
            contentType = 'application/json';
        } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
            contentType = `image/${ext.slice(1)}`;
        } else if (ext === '.svg') {
            contentType = 'image/svg+xml';
        } else if (ext === '.ico') {
            contentType = 'image/x-icon';
        }
        
        // Read and serve file
        if (contentType.startsWith('image/') && ext !== '.svg') {
            const content = fs.readFileSync(filePath);
            res.setHeader('Content-Type', contentType);
            res.send(content);
        } else {
            const content = fs.readFileSync(filePath, 'utf8');
            res.setHeader('Content-Type', contentType);
            res.send(content);
        }
    } catch (error) {
        console.error('Error serving file:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ 
            error: 'Internal server error',
            ...(process.env.NODE_ENV !== 'production' && { message: error.message })
        });
    }
};
