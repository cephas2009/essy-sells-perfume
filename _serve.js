// Minimal static server for validation (project root -> localhost:8123)
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const types = {
  '.html': 'text/html', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.json': 'application/json'
};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (e, data) => {
    if (e) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(8123, () => console.log('serving project root on http://localhost:8123'));
