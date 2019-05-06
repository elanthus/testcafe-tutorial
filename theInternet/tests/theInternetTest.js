import axeCheck from 'axe-testcafe';

import {TheInternet, DynamicControls} from '../page';
import {getBaseUrl} from '../config';


fixture`TheInternet`
  .page`${getBaseUrl()}`;

const aXeOptions = {
  runOnly: {
    type:    'tag',
    values:  ['wcag2a', 'best-practice', 'section508'],
  },
  rules:  {
    label:          {enabled: false},  // reenable this to see axe fail (correctly)
  },
};

test('dynamic controls test', async (t) => {
  const theInternet = await TheInternet.create();
  await t.click(theInternet.goToPage(DynamicControls.LINK_TEXT));

  const dynamicControls = await DynamicControls.create();

  await dynamicControls.removeCheckbox();
  await dynamicControls.addCheckbox();

  await dynamicControls.enterText('abc');
  await t.expect(dynamicControls.textField.value).contains('abc');
  await t.wait(5000);
});

test('a11y test the dynamic content page', async (t) => {
  const axeContext = 'body'; // whole page
  
  const theInternet = await TheInternet.create();
  await t.click(theInternet.goToPage(DynamicControls.LINK_TEXT));

  const dynamicControls = await DynamicControls.create();

  await axeCheck(t, axeContext, aXeOptions);
});