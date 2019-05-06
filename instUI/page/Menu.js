import {Selector, t} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';

export default class Menu {
  
  constructor() {
    this.menuButton = Selector('button').withText('Menu');
    this.popover = ReactSelector('Popover');
    this.menuItem = (property, value) => ReactSelector('MenuItem').withProps(property, value);
    this.subMenu = (property, value) => ReactSelector('MenuItem').withProps(property, value);
    this.moreOptions = Selector('button').withText('More Options');
  }

  static async create() {
    const menu = new Menu();

    await t.expect(menu.menuButton.visible).ok('Expected to see a menu');
    return menu;
  }

  async selectFromSubMenu(value) {
    const optionToSelect = this.menuItem('value', value);

    await this.showMenu();
    await t.hover(this.moreOptions);
    await t.click(optionToSelect);
  }

  async showMenu() {
    if (await this.moreOptions.exists === false) {
      await t.click(this.menuButton);
    }
  }
}