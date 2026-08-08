import {resolveBaseUrl} from '../lib/config';

export const environments = {
  // The fixture app is served locally by TestCafe's `--app` option, so this
  // suite has no external dependency and cannot be broken by someone else's
  // redesign. See fixtures/README.md.
  demo: `http://localhost:${process.env.FIXTURE_PORT || 3000}/`,
};

export const getBaseUrl = () => resolveBaseUrl(environments);
