import {Selector, t} from 'testcafe';

/**
 * The site's landing page, which links out to every example.
 */
export default class TheInternet {
  constructor() {
    this.welcome = Selector('h1').withExactText('Welcome to the-internet');
    this.goToPage = (linkText) => Selector('a').withExactText(linkText);
  }

  /**
   * Asserting readiness in the factory means every caller gets a page object
   * that is already known to be usable, so individual tests do not each have
   * to remember to check.
   */
  static async create() {
    const theInternet = new TheInternet();

    await t.expect(theInternet.welcome.visible).ok('Expected to see the landing page.');
    return theInternet;
  }
}
