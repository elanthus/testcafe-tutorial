/**
 * A dependency-free static server for the fixture app.
 *
 * TestCafe starts this via its `--app` option and shuts it down when the run
 * finishes, so the suite has no external network dependency at all.
 */
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname, join, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'app');
const PORT = Number(process.env.FIXTURE_PORT) || 3000;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

const server = createServer(async (request, response) => {
  const requested = new URL(request.url, `http://localhost:${PORT}`).pathname;
  const relative = normalize(requested === '/' ? '/index.html' : requested);

  // normalize() resolves any `..` segments, so this rejects path traversal
  // rather than merely discouraging it.
  if (relative.includes('..')) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const body = await readFile(join(ROOT, relative));
    response.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extname(relative)] || 'application/octet-stream',
    });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Fixture app on http://localhost:${PORT}`);
});
