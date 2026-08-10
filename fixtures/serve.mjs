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

import {FIXTURE_PORT as PORT} from '../lib/fixturePort.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'app');

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
      'Content-Type':
        CONTENT_TYPES[extname(relative)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

// Without this, a busy port surfaces as an unhandled 'error' event: a stack
// trace that buries the one line telling you what to do about it.
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use, so the fixture app could not start.\n` +
        'Stop whatever is holding it, or pick another port:\n' +
        `  FIXTURE_PORT=${PORT + 1} npm run test:react`,
    );
    process.exit(1);
  }

  throw error;
});

server.listen(PORT, () => {
  console.log(`Fixture app on http://localhost:${PORT}`);
});
