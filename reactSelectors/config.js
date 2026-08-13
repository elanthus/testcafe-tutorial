import {resolveBaseUrl} from '../lib/config.js';
import {FIXTURE_PORT} from '../lib/fixturePort.mjs';

export const environments = {
  // The fixture app is served locally by TestCafe's `--app` option, so this
  // suite has no external dependency and cannot be broken by someone else's
  // redesign. See fixtures/README.md.
  demo: `http://127.0.0.1:${FIXTURE_PORT}/`,
};

export const getBaseUrl = () => resolveBaseUrl(environments);
