// Serve static files for all non-API routes
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const urlPath = req.url.split('?')[0]; // Remove query string
    const cleanPath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
    
    // Don't serve API routes
    if (cleanPath.startsWith('api/')) {
        return res.status(404).json({ error: 'Not found' });
    }
    
    // Determine file path
    let filePath;
    if (cleanPath === '' || cleanPath === 'index.html') {
        filePath = path.join(process.cwd(), 'index.html');
    } else {
        filePath = path.join(process.cwd(), cleanPath);
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        // For SPA, serve index.html for any non-file route
        filePath = path.join(process.cwd(), 'index.html');
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const ext = path.extname(filePath);
        
        // Set content type
        let contentType = 'text/html';
        if (ext === '.css') {
            contentType = 'text/css';
        } else if (ext === '.js') {
            contentType = 'application/javascript';
        } else if (ext === '.json') {
            contentType = 'application/json';
        } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.svg') {
            contentType = `image/${ext.slice(1)}`;
            const binaryContent = fs.readFileSync(filePath);
            res.setHeader('Content-Type', contentType);
            return res.send(binaryContent);
        }
        
        res.setHeader('Content-Type', contentType);
        res.send(content);
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(500).send('Internal server error');
    }
};
