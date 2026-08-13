import assert from 'node:assert/strict';
import test from 'node:test';

import {resolveBaseUrl} from '../lib/config.js';
import {parseFixturePort} from '../lib/fixturePort.mjs';

test('URL configuration rejects unknown environments', () => {
  assert.throws(
    () => resolveBaseUrl({demo: 'https://example.com/'}, {TEST_ENV: 'staging'}),
    /Unknown TEST_ENV "staging".*demo/,
  );
});

test('URL configuration rejects malformed and non-HTTP URLs', () => {
  for (const value of ['not a URL', 'file:///tmp/fixture', 'javascript:alert(1)']) {
    assert.throws(
      () => resolveBaseUrl({demo: 'https://example.com/'}, {TEST_BASE_URL: value}),
      /TEST_BASE_URL must be a valid HTTP or HTTPS URL/,
    );
  }

  assert.throws(
    () => resolveBaseUrl({demo: 'not a URL'}, {}),
    /URL for TEST_ENV "demo" must be a valid HTTP or HTTPS URL/,
  );
});

test('fixture port accepts only integers from 1 through 65535', () => {
  assert.equal(parseFixturePort(undefined), 7357);
  assert.equal(parseFixturePort('1'), 1);
  assert.equal(parseFixturePort('65535'), 65535);

  for (const value of ['', '0', '-1', '1.5', '65536', 'port', ' 7357']) {
    assert.throws(
      () => parseFixturePort(value),
      /FIXTURE_PORT must be an integer from 1 through 65535/,
    );
  }
});
