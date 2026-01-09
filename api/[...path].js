// Serve static files for all non-API routes
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Debug logging
    console.log('=== Static File Request Debug ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Original URL:', req.originalUrl);
    console.log('Query:', req.query);
    console.log('Path params:', req.query.path);
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    
    const urlPath = req.url.split('?')[0]; // Remove query string
    console.log('URL path (after split):', urlPath);
    
    const cleanPath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
    console.log('Clean path:', cleanPath);
    
    // Don't serve API routes
    if (cleanPath.startsWith('api/')) {
        console.log('Blocked: API route detected');
        return res.status(404).json({ error: 'Not found' });
    }
    
    // Determine file path
    let filePath;
    if (cleanPath === '' || cleanPath === 'index.html') {
        filePath = path.join(process.cwd(), 'index.html');
    } else {
        filePath = path.join(process.cwd(), cleanPath);
    }
    
    console.log('Initial file path:', filePath);
    console.log('File exists?', fs.existsSync(filePath));
    
    // List files in current directory for debugging
    try {
        const filesInRoot = fs.readdirSync(process.cwd());
        console.log('Files in root directory:', filesInRoot.filter(f => !f.startsWith('.') && !f.includes('node_modules')));
    } catch (err) {
        console.log('Error listing root directory:', err.message);
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log('File not found, falling back to index.html');
        // For SPA, serve index.html for any non-file route
        filePath = path.join(process.cwd(), 'index.html');
        console.log('Fallback file path:', filePath);
        console.log('Fallback file exists?', fs.existsSync(filePath));
    }
    
    try {
        const ext = path.extname(filePath);
        console.log('File extension:', ext);
        console.log('Attempting to read file:', filePath);
        
        // Check if it's a binary file
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.svg' || ext === '.ico') {
            const binaryContent = fs.readFileSync(filePath);
            const contentType = ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`;
            console.log('Serving binary file, content type:', contentType);
            res.setHeader('Content-Type', contentType);
            return res.send(binaryContent);
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        console.log('File read successfully, content length:', content.length);
        
        // Set content type
        let contentType = 'text/html';
        if (ext === '.css') {
            contentType = 'text/css';
        } else if (ext === '.js') {
            contentType = 'application/javascript';
        } else if (ext === '.json') {
            contentType = 'application/json';
        }
        
        console.log('Content type:', contentType);
        console.log('Sending response...');
        
        res.setHeader('Content-Type', contentType);
        res.send(content);
        console.log('Response sent successfully');
    } catch (error) {
        console.error('=== ERROR SERVING FILE ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('File path attempted:', filePath);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            filePath: filePath,
            cwd: process.cwd()
        });
    }
};
