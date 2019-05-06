import {Selector, t} from 'testcafe';

export default class DynamicControls {
  
  constructor() {
    this.checkbox = Selector('#checkbox');
    this.checkboxButton = Selector('[onclick="swapCheckbox()"]');
    this.textFieldButton = Selector('[onclick="swapInput()"]');
    this.textField = Selector('[type="text"]');
    this.header = Selector('h4').withExactText(DynamicControls.LINK_TEXT);
  }

  static get LINK_TEXT() {
    return "Dynamic Controls";
  }

  static async create() {
    const dynamicControls = new DynamicControls();

    await t.expect(dynamicControls.checkbox.visible).ok('Expected to see checkbox');
    return dynamicControls;
  }

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
    if (await this.textField.hasAttribute('disabled'))
    {
      await t.click(this.textFieldButton);
      await t.expect(this.textField.hasAttribute('disabled')).notOk();
    }
    await t.typeText(this.textField, text);
  }
}