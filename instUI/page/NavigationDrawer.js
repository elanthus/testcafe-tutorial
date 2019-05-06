import {Selector, t} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';

export default class NavigationDrawer {
  
  constructor() {
    this.hamburger = ReactSelector('HamburgerButton');
    this.searchBox = Selector('[role="search"]').find('input');
    this.componentsSection = ReactSelector('NavToggle').withProps('summary', 'components');
    this.pageLink = (name) => Selector(`[href="#${name}"]`);
  }

  static async create() {
    const navigationDrawer = new NavigationDrawer();

    await t.expect(navigationDrawer.hamburger.visible).ok('Expected to see hamburger');
    return navigationDrawer;
  }


  async openComponentPage(componentName) {
    
    await this.showDrawer();
    await t.hover(this.componentsSection);
    if (await this.componentsSection.getReact(({ props }) => props.expanded) === false)
    {
      await t.click(this.componentsSection);
      await t.expect(this.componentsSection.getReact(({ props }) => props.expanded)).eql(true);
    }
    await t.hover(this.pageLink(componentName));
    await t.click(this.pageLink(componentName));
  }

  async openPage(name) {
    await this.showDrawer();
    await t.typeText(this.searchBox, name);
    await t.hover(this.pageLink(name));
    await t.click(this.pageLink(name));
  }

  async showDrawer()
  {
    if (await this.hamburger.getReact(({ props }) => props.expanded) === false)
    {
      await t.click(this.hamburger);
      await t.expect(this.hamburger.getReact(({ props }) => props.expanded)).eql(true);
    }
  }
}