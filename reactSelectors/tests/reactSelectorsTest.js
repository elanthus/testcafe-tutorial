import {checkForViolations} from '@testcafe-community/axe';
import {waitForReact} from 'testcafe-react-selectors';
import {Selector} from 'testcafe';

import {Menu, NavigationDrawer} from '../page';
import {getBaseUrl} from '../config';

fixture`React selectors`
  .page`${getBaseUrl()}`
  .clientScripts({module: 'axe-core/axe.min.js'})
  // React selectors resolve against the mounted React tree, so the tree has to
  // exist before the first one runs.
  .beforeEach(async () => {
    await waitForReact();
  });

/**
 * Empty on purpose. The fixture app is ours, so any violation axe finds is a
 * bug we can fix rather than one we have to accept. Contrast with
 * theInternet/tests/, which runs against a third-party site and therefore
 * carries a documented baseline.
 */
const ACCEPTED_VIOLATIONS = {};

const axeOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice', 'section508'],
  },
  rules: ACCEPTED_VIOLATIONS,
};

test('selecting an option from a hover-revealed submenu', async (t) => {
  const navigationDrawer = await NavigationDrawer.create();
  await navigationDrawer.openPage('Menu');

  const menu = await Menu.create();
  await menu.selectFromSubMenu('optionTwo');

  await t.expect(Selector('main').innerText).contains('Selected: optionTwo');
});

test('navigating via the collapsible components section', async (t) => {
  const navigationDrawer = await NavigationDrawer.create();
  await navigationDrawer.openComponentPage('Popover');

  await t.expect(Selector('main h2').innerText).eql('Popover');
});

test('the open menu state has no accessibility violations', async (t) => {
  const navigationDrawer = await NavigationDrawer.create();
  await navigationDrawer.openPage('Menu');

  const menu = await Menu.create();
  await menu.showMenu();

  await checkForViolations(t, 'body', axeOptions);
});
