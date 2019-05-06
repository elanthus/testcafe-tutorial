import {ClientFunction} from 'testcafe';
import minimist from 'minimist';

const args = minimist(process.argv.slice(1));
const environment = args.env;
const featureFlagsArgs = args.features ? args.features.split(' ') : undefined;

export const getBaseUrl = () => {
  if (environment === '' || environment === undefined || environment === 'demo') {
  // default environment
    return 'http://the-internet.herokuapp.com/';
  } else if (environment === 'docker') {
    return 'http://the-internet.docker';  // may not get to setting up docker for hack week
  }
  return environment;  // for passing custom url
};
