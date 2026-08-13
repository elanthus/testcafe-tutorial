import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer as createHttpServer, get} from 'node:http';
import {once} from 'node:events';
import test from 'node:test';

import {createFixtureServer} from '../fixtures/serve.mjs';

function listen(server) {
  server.listen(0, '127.0.0.1');
  return once(server, 'listening');
}

function close(server) {
  server.close();
  return once(server, 'close');
}

function request(server, path) {
  return new Promise((resolve, reject) => {
    const clientRequest = get({
      host: '127.0.0.1',
      port: server.address().port,
      path,
    }, (response) => {
      let body = '';

      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => resolve({
        body,
        headers: response.headers,
        status: response.statusCode,
      }));
    });

    clientRequest.on('error', reject);
  });
}

test('fixture server rejects traversal and serves explicit content types', async () => {
  const server = createFixtureServer();
  await listen(server);

  try {
    for (const path of ['/../package.json', '/%2e%2e/package.json']) {
      const response = await request(server, path);
      assert.equal(response.status, 403);
    }

    const html = await request(server, '/');
    assert.equal(html.status, 200);
    assert.equal(html.headers['content-type'], 'text/html; charset=utf-8');

    const css = await request(server, '/styles.css');
    assert.equal(css.status, 200);
    assert.equal(css.headers['content-type'], 'text/css; charset=utf-8');

    const unknown = await request(server, '/src/index.jsx');
    assert.equal(unknown.status, 200);
    assert.equal(unknown.headers['content-type'], 'application/octet-stream');
  } finally {
    await close(server);
  }
});

test('fixture server reports a port collision and exits', async () => {
  const blocker = createHttpServer();
  await listen(blocker);
  const port = blocker.address().port;
  const child = spawn(process.execPath, ['fixtures/serve.mjs'], {
    cwd: process.cwd(),
    env: {...process.env, FIXTURE_PORT: String(port)},
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  let stderr = '';

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => {
    stderr += chunk;
  });

  try {
    const [code] = await once(child, 'exit');
    assert.equal(code, 1);
    assert.match(stderr, new RegExp(`Port ${port} is already in use`));
  } finally {
    if (child.exitCode === null) {
      child.kill();
    }
    await close(blocker);
  }
});
