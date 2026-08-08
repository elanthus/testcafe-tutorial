import {checkForViolations} from '@testcafe-community/axe';

import {TheInternet, DynamicControls} from '../page';
import {getBaseUrl} from '../config';

fixture`TheInternet`
  .page`${getBaseUrl()}`
  // axe-core has to be present in the page before it can be run against it.
  // TestCafe injects it into every page this fixture visits.
  .clientScripts({module: 'axe-core/axe.min.js'});

/**
 * the-internet is a third-party fixture site, so violations it ships with are
 * not ours to fix. Rather than turning accessibility checking off, we keep an
 * explicit baseline of rules we have triaged and accepted; anything outside
 * this list still fails the build.
 *
 * Delete an entry to watch axe correctly report the violation.
 * See README.md - "Accessibility baselines" - for the reasoning.
 */
const ACCEPTED_VIOLATIONS = {
  // "Form elements must have labels" - the checkbox and text input on
  // /dynamic_controls ship with no associated <label>. A genuine WCAG 2 A
  // failure in the fixture site, verified still present.
  label: {enabled: false},

  // "All page content should be contained by landmarks" - the site predates
  // landmark regions. Best-practice tag rather than a WCAG failure.
  region: {enabled: false},
};

const axeOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'best-practice', 'section508'],
  },
  rules: ACCEPTED_VIOLATIONS,
};

test('swapping the checkbox and enabling the text field', async (t) => {
  const theInternet = await TheInternet.create();
  await t.click(theInternet.goToPage(DynamicControls.LINK_TEXT));

  const dynamicControls = await DynamicControls.create();

  await dynamicControls.removeCheckbox();
  await dynamicControls.addCheckbox();

  await dynamicControls.enterText('abc');
  await t.expect(dynamicControls.textField.value).contains('abc');
});

test('the dynamic controls page has no unexpected accessibility violations', async (t) => {
  const theInternet = await TheInternet.create();
  await t.click(theInternet.goToPage(DynamicControls.LINK_TEXT));

  await DynamicControls.create();

  await checkForViolations(t, 'body', axeOptions);
});
