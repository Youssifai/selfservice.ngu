// Serve static files for all non-API routes
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Debug logging - ALWAYS log, even for errors
    try {
        console.log('=== Static File Request Debug ===');
        console.log('Method:', req.method);
        console.log('URL:', req.url);
        console.log('Original URL:', req.originalUrl);
        console.log('Query:', JSON.stringify(req.query));
        console.log('Path array:', req.query.path);
        console.log('Current working directory:', process.cwd());
        console.log('__dirname:', __dirname);
        
        // In Vercel, catch-all routes receive path as req.query.path (array)
        // But for root path, it might be empty or undefined
        let urlPath;
        if (req.query.path === undefined || req.query.path === null) {
            // Root path - no path parameter
            urlPath = '/';
        } else if (Array.isArray(req.query.path)) {
            if (req.query.path.length === 0) {
                urlPath = '/';
            } else {
                urlPath = '/' + req.query.path.join('/');
            }
        } else if (typeof req.query.path === 'string') {
            urlPath = '/' + req.query.path;
        } else {
            urlPath = req.url.split('?')[0] || '/';
        }
        
        // Ensure it starts with /
        if (!urlPath.startsWith('/')) {
            urlPath = '/' + urlPath;
        }
        
        console.log('Resolved URL path:', urlPath);
        
        // For root, serve index.html
        const cleanPath = (urlPath === '/' || urlPath === '') ? 'index.html' : urlPath.replace(/^\//, '');
        console.log('Clean path:', cleanPath);
        
        // Don't serve API routes
        if (cleanPath.startsWith('api/')) {
            console.log('Blocked: API route detected');
            return res.status(404).json({ error: 'Not found' });
        }
        
        // In Vercel, files are in the project root, but we need to go up from api/
        const baseDir = path.join(__dirname, '..');
        console.log('Base directory (parent of api/):', baseDir);
        
        // Determine file path
        let filePath;
        if (cleanPath === 'index.html' || urlPath === '/') {
            filePath = path.join(baseDir, 'index.html');
        } else {
            filePath = path.join(baseDir, cleanPath);
        }
        
        console.log('Initial file path:', filePath);
        
        // Check if file exists
        const fileExists = fs.existsSync(filePath);
        console.log('File exists?', fileExists);
        
        // List files in base directory for debugging
        try {
            const filesInRoot = fs.readdirSync(baseDir);
            const relevantFiles = filesInRoot.filter(f => 
                !f.startsWith('.') && 
                f !== 'node_modules' && 
                !f.includes('node_modules') &&
                f !== 'api' &&
                !f.endsWith('.db')
            );
            console.log('Files in base directory:', relevantFiles);
            
            // Check if index.html exists
            const indexPath = path.join(baseDir, 'index.html');
            console.log('Checking for index.html at:', indexPath);
            console.log('index.html exists?', fs.existsSync(indexPath));
        } catch (err) {
            console.log('Error listing base directory:', err.message);
        }
        
        // If file doesn't exist, fall back to index.html for SPA routing
        if (!fileExists) {
            console.log('File not found, falling back to index.html for SPA routing');
            filePath = path.join(baseDir, 'index.html');
            console.log('Fallback file path:', filePath);
            console.log('Fallback file exists?', fs.existsSync(filePath));
        }
        
        // Final check - if still no file, return detailed error
        if (!fs.existsSync(filePath)) {
            console.error('ERROR: index.html not found!');
            console.error('Searched at:', filePath);
            console.error('Base directory:', baseDir);
            console.error('Current working directory:', process.cwd());
            console.error('__dirname:', __dirname);
            
            return res.status(404).json({ 
                error: 'index.html not found',
                debug: {
                    filePath,
                    baseDir,
                    cwd: process.cwd(),
                    dirname: __dirname,
                    url: req.url,
                    cleanPath,
                    query: req.query
                }
            });
        }
        
        const ext = path.extname(filePath);
        console.log('File extension:', ext);
        console.log('Final file path:', filePath);
        console.log('Attempting to read file...');
        
        // Check if it's a binary file
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.svg' || ext === '.ico') {
            const binaryContent = fs.readFileSync(filePath);
            const contentType = ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`;
            console.log('Serving binary file, content type:', contentType, 'size:', binaryContent.length);
            res.setHeader('Content-Type', contentType);
            res.send(binaryContent);
            console.log('Binary response sent successfully');
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        console.log('File read successfully, content length:', content.length);
        console.log('First 100 chars:', content.substring(0, 100));
        
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
        console.log('Response sent successfully - Status 200');
    } catch (error) {
        console.error('=== FATAL ERROR SERVING FILE ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Request URL:', req.url);
        console.error('Request query:', req.query);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            stack: error.stack,
            url: req.url,
            query: req.query
        });
    }
};
