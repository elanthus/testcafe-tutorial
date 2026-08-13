/**
 * The port the fixture app is served on.
 *
 * Shared by the server and the suite that talks to it so the two cannot drift
 * apart. Deliberately not 3000, which collides with most dev tooling; override
 * with FIXTURE_PORT if something on your machine already wants this one.
 */
const DEFAULT_FIXTURE_PORT = 7357;

export function parseFixturePort(value) {
  if (value === undefined) {
    return DEFAULT_FIXTURE_PORT;
  }

  if (!/^\d+$/.test(value)) {
    throw new Error('FIXTURE_PORT must be an integer from 1 through 65535.');
  }

  const port = Number(value);

  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error('FIXTURE_PORT must be an integer from 1 through 65535.');
  }

  return port;
}

export const FIXTURE_PORT = parseFixturePort(process.env.FIXTURE_PORT);
