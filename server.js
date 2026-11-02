const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const enquiriesHandler = require('./api/enquiries');
const searchDemandHandler = require('./api/search-demand');
const exportHandler = require('./api/export');
const statusHandler = require('./api/status');
const dorkMinerHandler = require('./api/dork-miner');
const webhookHandler = require('./api/webhook');
const fetchingAgentHandler = require('./api/fetching-agent');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // Helper for JSON response
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };
  res.send = (data) => {
    res.end(data);
  };

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    req.body = body ? (function() { try { return JSON.parse(body); } catch(e) { return {}; } })() : {};
    req.query = parsed.query;

    if (pathname === '/api/status') {
      return statusHandler(req, res);
    } else if (pathname === '/api/enquiries') {
      return enquiriesHandler(req, res);
    } else if (pathname === '/api/dork-miner') {
      return dorkMinerHandler(req, res);
    } else if (pathname === '/api/webhook') {
      return webhookHandler(req, res);
    } else if (pathname === '/api/fetching-agent') {
      return fetchingAgentHandler(req, res);
    } else if (pathname === '/api/search-demand') {
      return searchDemandHandler(req, res);
    } else if (pathname === '/api/export') {
      return exportHandler(req, res);
    } else {
      // Serve static index.html
      const filePath = path.join(__dirname, 'public', 'index.html');
      fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
          res.statusCode = 404;
          return res.end('Not Found');
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(content);
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`AI Buyer server running on http://localhost:${PORT}`);
});
