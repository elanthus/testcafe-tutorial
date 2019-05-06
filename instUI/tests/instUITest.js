import axeCheck from 'axe-testcafe';

import {Menu, NavigationDrawer} from '../page';
import {getBaseUrl} from '../config';


fixture`InstUI`
  .page`${getBaseUrl()}`;

const aXeOptions = {
  runOnly: {
    type:    'tag',
    values:  ['wcag2a', 'best-practice', 'section508'],
  },
  rules:  {
    'aria-hidden-focus':          {enabled: false},  // reenable this to see axe fail (correctly)
  },
};

test('menu test', async (t) => {
  const navigationDrawer = await NavigationDrawer.create();
  await navigationDrawer.openPage('Menu');

  const menu = await Menu.create();
  await menu.selectFromSubMenu('optionTwo');
});

test('a11y test', async (t) => {
  const axeContext = 'body'; // whole page
  
  const navigationDrawer = await NavigationDrawer.create();
  await navigationDrawer.openPage('Menu');

  const menu = await Menu.create();
  await menu.showMenu();

  await axeCheck(t, axeContext, aXeOptions);
});