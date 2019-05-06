import {Selector, t} from 'testcafe';

export default class TheInternet {
  constructor() {
    this.welcome = Selector('h1').withExactText('Welcome to the-internet');
    this.goToPage = (buttonText) => Selector('a').withExactText(buttonText);
    this.elementalLink = Selector('#page-footer').find('[href*="elementalselenium"]');
  }

  static async create() {
    const theInternet = new TheInternet();

    await t.expect(theInternet.welcome.visible).ok('Expected to see welcome page.');
    await t.expect(theInternet.elementalLink.exists).ok('Expect Elemental Selenium link exists.');
    return theInternet;
  }
}