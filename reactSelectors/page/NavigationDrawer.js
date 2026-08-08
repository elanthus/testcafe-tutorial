import {Selector, t} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';

/**
 * The docs site's left-hand navigation.
 *
 * `showDrawer` and `openComponentPage` read the component's own `expanded`
 * prop to decide whether they need to click, instead of sleeping and hoping.
 * That is the whole argument for React selectors over CSS ones: the test asks
 * the component what state it is in.
 */
export default class NavigationDrawer {
  constructor() {
    this.hamburger = ReactSelector('HamburgerButton');
    this.searchBox = Selector('[role="search"]').find('input');
    // A React selector resolves to the component's *root* element, which here
    // is a wrapper div rather than anything clickable. Querying state and
    // driving interaction are separate jobs, so they get separate selectors.
    this.componentsSection = ReactSelector('NavToggle').withProps('summary', 'components');
    this.componentsToggle = this.componentsSection.find('button');
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

    if (!await this.componentsSection.getReact(({props}) => props.expanded)) {
      await t.click(this.componentsToggle);
      await t.expect(this.componentsSection.getReact(({props}) => props.expanded)).eql(true);
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

  async showDrawer() {
    if (!await this.hamburger.getReact(({props}) => props.expanded)) {
      await t.click(this.hamburger);
      await t.expect(this.hamburger.getReact(({props}) => props.expanded)).eql(true);
    }
  }
}
