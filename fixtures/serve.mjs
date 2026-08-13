/**
 * A dependency-free static server for the fixture app.
 *
 * TestCafe starts this via its `--app` option and shuts it down when the run
 * finishes, so the suite has no external network dependency at all.
 */
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

import {FIXTURE_PORT as PORT} from '../lib/fixturePort.mjs';

const HOST = '127.0.0.1';
const ROOT = resolve(fileURLToPath(new URL('app/', import.meta.url)));

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

export function createFixtureServer() {
  return createServer(async (request, response) => {
    let requested;

    try {
      requested = decodeURIComponent(request.url.split('?')[0]);
    } catch {
      response.writeHead(400).end('Bad request');
      return;
    }

    const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
    const file = resolve(ROOT, relative);

    if (file !== ROOT && !file.startsWith(`${ROOT}${sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    try {
      const body = await readFile(file);
      response.writeHead(200, {
        'Content-Type':
          CONTENT_TYPES[extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      response.end(body);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
}

export function startFixtureServer() {
  const server = createFixtureServer();

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

  server.listen(PORT, HOST, () => {
    console.log(`Fixture app on http://${HOST}:${PORT}`);
  });

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startFixtureServer();
}
