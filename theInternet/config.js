import {resolveBaseUrl} from '../lib/config';

export const environments = {
  demo: 'https://the-internet.herokuapp.com/',
};

export const getBaseUrl = () => resolveBaseUrl(environments);
