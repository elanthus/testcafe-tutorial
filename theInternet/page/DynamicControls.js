import {Selector, t} from 'testcafe';

/**
 * The /dynamic_controls example: a checkbox that can be added and removed, and
 * a text field that starts disabled. Both change asynchronously, which makes
 * this a good place to show that TestCafe's assertions wait on their own.
 */
export default class DynamicControls {
  constructor() {
    this.checkbox = Selector('#checkbox');
    this.checkboxButton = Selector('[onclick="swapCheckbox()"]');
    this.textFieldButton = Selector('[onclick="swapInput()"]');
    this.textField = Selector('[type="text"]');
    this.header = Selector('h4').withExactText(DynamicControls.LINK_TEXT);
  }

  static get LINK_TEXT() {
    return 'Dynamic Controls';
  }

  static async create() {
    const dynamicControls = new DynamicControls();

    await t.expect(dynamicControls.checkbox.visible).ok('Expected to see the checkbox');
    return dynamicControls;
  }

  /**
   * Precondition, action, postcondition. The trailing assertion is what waits
   * out the removal animation - no sleep required, because `.exists` retries
   * until it agrees or the assertion times out.
   */
  async removeCheckbox() {
    await t.expect(this.checkbox.exists).ok('Expected a checkbox on the page');
    await t.click(this.checkboxButton);
    await t.expect(this.checkbox.exists).notOk('Expected checkbox to be removed');
  }

  async addCheckbox() {
    await t.expect(this.checkbox.exists).notOk('Did not expect a checkbox on the page');
    await t.click(this.checkboxButton);
    await t.expect(this.checkbox.exists).ok('Expected checkbox to be added');
  }

  async enterText(text) {
    if (await this.textField.hasAttribute('disabled')) {
      await t.click(this.textFieldButton);
      await t.expect(this.textField.hasAttribute('disabled')).notOk(
        'Expected the text field to become enabled',
      );
    }

    await t.typeText(this.textField, text);
  }
}
