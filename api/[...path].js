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
    console.log('Path array:', req.query.path);
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    
    // In Vercel, catch-all routes receive path as req.query.path (array)
    let urlPath;
    if (req.query.path && Array.isArray(req.query.path)) {
        urlPath = '/' + req.query.path.join('/');
    } else if (req.query.path) {
        urlPath = '/' + req.query.path;
    } else {
        urlPath = req.url.split('?')[0] || '/';
    }
    
    // Ensure it starts with /
    if (!urlPath.startsWith('/')) {
        urlPath = '/' + urlPath;
    }
    
    console.log('Resolved URL path:', urlPath);
    
    const cleanPath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
    console.log('Clean path:', cleanPath);
    
    // Don't serve API routes
    if (cleanPath.startsWith('api/')) {
        console.log('Blocked: API route detected');
        return res.status(404).json({ error: 'Not found' });
    }
    
    // Determine file path - Vercel serves from /var/task in serverless
    // Files are copied to the function directory during build
    let filePath;
    const baseDir = process.cwd();
    
    if (cleanPath === '' || cleanPath === 'index.html' || urlPath === '/') {
        filePath = path.join(baseDir, 'index.html');
    } else {
        filePath = path.join(baseDir, cleanPath);
    }
    
    console.log('Initial file path:', filePath);
    console.log('File exists?', fs.existsSync(filePath));
    
    // List files in current directory for debugging
    try {
        const filesInRoot = fs.readdirSync(baseDir);
        console.log('Files in root directory:', filesInRoot.filter(f => 
            !f.startsWith('.') && 
            f !== 'node_modules' && 
            !f.includes('node_modules') &&
            f !== 'api'
        ));
        
        // Also check if we're in a subdirectory
        const parentDir = path.dirname(baseDir);
        if (fs.existsSync(parentDir)) {
            const parentFiles = fs.readdirSync(parentDir);
            console.log('Files in parent directory:', parentFiles.filter(f => 
                !f.startsWith('.') && 
                f !== 'node_modules'
            ));
        }
    } catch (err) {
        console.log('Error listing directories:', err.message);
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log('File not found, falling back to index.html');
        // For SPA, serve index.html for any non-file route
        filePath = path.join(baseDir, 'index.html');
        console.log('Fallback file path:', filePath);
        console.log('Fallback file exists?', fs.existsSync(filePath));
        
        if (!fs.existsSync(filePath)) {
            // Try alternative locations
            const altPaths = [
                path.join(__dirname, '..', 'index.html'),
                path.join(process.cwd(), 'index.html'),
                '/var/task/index.html',
                path.join('/var/task', 'index.html')
            ];
            
            for (const altPath of altPaths) {
                console.log('Trying alternative path:', altPath);
                if (fs.existsSync(altPath)) {
                    filePath = altPath;
                    console.log('Found file at:', filePath);
                    break;
                }
            }
        }
    }
    
    try {
        const ext = path.extname(filePath);
        console.log('File extension:', ext);
        console.log('Final file path:', filePath);
        console.log('Attempting to read file...');
        
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
        console.log('First 200 chars:', content.substring(0, 200));
        
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
        console.error('Current working directory:', process.cwd());
        console.error('__dirname:', __dirname);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            filePath: filePath,
            cwd: process.cwd(),
            dirname: __dirname,
            url: req.url,
            query: req.query
        });
    }
};
