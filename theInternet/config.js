import {resolveBaseUrl} from '../lib/config';

export const environments = {
  demo: 'https://the-internet.herokuapp.com/',
  docker: 'http://the-internet.docker/',
};

export const getBaseUrl = () => resolveBaseUrl(environments);
