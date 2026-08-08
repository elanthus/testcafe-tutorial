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
export function resolveBaseUrl(environments) {
  const explicitUrl = process.env.TEST_BASE_URL;

  if (explicitUrl) {
    return explicitUrl;
  }

  const name = process.env.TEST_ENV || 'demo';
  const url = environments[name];

  if (!url) {
    const known = Object.keys(environments).join(', ');
    throw new Error(
      `Unknown TEST_ENV "${name}". Declared environments: ${known}. ` +
      'Pass TEST_BASE_URL to point at an arbitrary URL instead.',
    );
  }

  return url;
}
