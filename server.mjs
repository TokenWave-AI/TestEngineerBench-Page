import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.pdf': 'application/pdf', '.otf': 'font/otf', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) { res.writeHead(403).end(); return; }
  try {
    let content = await readFile(path);
    // Trial fonts stay ignored and local: the production Pages artifact never includes them.
    if (extname(path) === '.html' && url.searchParams.get('font') !== 'compatible' && existsSync(resolve(root, '.local-assets/franie/FranieTest-Regular.otf'))) {
      const previewFonts = `<style>@font-face{font-family:'Franie Test';font-weight:400;font-display:swap;src:url('/.local-assets/franie/FranieTest-Regular.otf')}@font-face{font-family:'Franie Test';font-weight:600 900;font-display:swap;src:url('/.local-assets/franie/FranieTest-SemiBold.otf')}</style>`;
      content = content.toString().replace('</head>', previewFonts + '</head>');
    } res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }).end(content); }
  catch (error) { res.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Unable to serve this file.'); }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('TestEngineerBench: http://localhost:4173'));
