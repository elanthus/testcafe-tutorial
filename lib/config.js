/**
 * Resolves the base URL a fixture should run against.
 *
 * Precedence:
 *   1. TEST_BASE_URL - an explicit URL, overrides everything
 *   2. TEST_ENV      - the name of an environment the suite declares
 *   3. 'demo'        - the suite's default, publicly reachable target
 *
 * Suites declare their own environment map, so adding a staging target is a
 * one-line change local to that suite.
 */
function validateUrl(value, source) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${source} must be a valid HTTP or HTTPS URL.`);
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${source} must be a valid HTTP or HTTPS URL.`);
  }

  return value;
}

export function resolveBaseUrl(environments, environment = process.env) {
  const explicitUrl = environment.TEST_BASE_URL;

  if (explicitUrl) {
    return validateUrl(explicitUrl, 'TEST_BASE_URL');
  }

  const name = environment.TEST_ENV || 'demo';
  const url = environments[name];

  if (!url) {
    const known = Object.keys(environments).join(', ');
    throw new Error(
      `Unknown TEST_ENV "${name}". Declared environments: ${known}. ` +
      'Pass TEST_BASE_URL to point at an arbitrary URL instead.',
    );
  }

  return validateUrl(url, `URL for TEST_ENV "${name}"`);
}
