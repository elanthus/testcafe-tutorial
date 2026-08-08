# TestCafe Tutorial

[![CI](https://github.com/elanthus/testcafe-tutorial/actions/workflows/ci.yml/badge.svg)](https://github.com/elanthus/testcafe-tutorial/actions/workflows/ci.yml)

A worked example of end-to-end browser testing with [TestCafe]: page objects
that stay readable as suites grow, React selectors that query component state
instead of guessing at markup, and accessibility checks that run alongside
functional ones. The architecture here will help you build reliable, 
maintainable tests over time.

```sh
npm install
npm test
```

## Provenance

The TestCafe examples here began as a tutorial project inside Instructure 
for teams new to TestCafe, or new to maintainable test architecture, 
and was hosted at [test_advisory_board], an Apache-2.0 repository at 
Instructure. I wrote that tutorial code in May 2019; the repository's 
other examples (Pact for Ruby and Java) were written by colleagues and 
are not included here. The original commits are preserved in this 
repository's history. (See [NOTICE](NOTICE).)

Everything since is a 2026 modernization: TestCafe 1.x to 3.x, a rewritten
test target, GitHub Actions in place of the old internal CI, and the cleanups
described below.

## What's in here

| Suite | Target | Demonstrates |
|---|---|---|
| `reactSelectors/` | `fixtures/app` - a minimal React app in this repo | React selectors, prop-based state queries, accessibility with a zero-violation policy |
| `theInternet/` | [the-internet], a third-party fixture site | Dynamic content, auto-waiting assertions, accessibility with a documented baseline |

```
lib/config.js         environment resolution shared by both suites
fixtures/app/         the React app the local suite runs against
fixtures/serve.mjs    dependency-free static server, started by TestCafe
*/page/               page objects: selectors and behavior
*/tests/              the tests themselves
```

## Running

```sh
npm test                  # both suites, headless Chrome
npm run test:react        # local fixture app only, no network needed
npm run test:the-internet # third-party site only
npm run test:live         # live mode, watches for changes, visible chrome browser
npm run lint
```

Any browser TestCafe supports works: `npx testcafe firefox theInternet/tests/*.js`.

To point a suite somewhere else:

```sh
TEST_BASE_URL=https://staging.example.com npm run test:the-internet
```

`./build.sh` runs the suite in Docker, which is the closest local equivalent to
CI. It is also the way to run on macOS without granting screen-recording
permission to TestCafe's browser tools.

## Design notes

**No sleeps.** TestCafe's assertions retry until they pass or time out, so
waiting is expressed as an assertion about the thing you are waiting for:

```js
await t.click(this.checkboxButton);
await t.expect(this.checkbox.exists).notOk('Expected checkbox to be removed');
```

Precondition, action, postcondition, with a message that explains the failure
when it comes. There is not a single `t.wait()` in the suite.

**Page objects assert their own readiness.** Each one is built through an async
static factory that will not hand you an object until the page is usable:

```js
const menu = await Menu.create();  // throws if the menu never appeared
```

That moves "is the page ready?" out of every individual test.

**React selectors query the component, not the markup.** The navigation drawer
decides whether it needs to click by reading the component's own state:

```js
if (!await this.hamburger.getReact(({props}) => props.expanded)) {
  await t.click(this.hamburger);
}
```

Restyling the drawer cannot break this. Renaming its `expanded` prop can, and
should, because that is a real change to the component's contract.

**The local suite owns its target.** `fixtures/app` is a small React app served
from this repo. The original version of these tests ran against a public
documentation site, and by 2026 every selector in them had rotted. Owning the
fixture makes the suite deterministic. The accessibility test there runs with 
an empty violation baseline, because any violation it finds is one we can 
actually fix.

### Accessibility baselines

Both suites run [axe-core] against `wcag2a`, `best-practice`, and `section508`.

For `fixtures/app`, the accepted-violation list is empty and must stay that way.

For the third-party site, it is not empty, because those violations are not
ours to fix. Rather than disabling accessibility checking, the suite keeps an
explicit, justified baseline — anything outside it still fails:

```js
const ACCEPTED_VIOLATIONS = {
  // "Form elements must have labels" - the checkbox and text input on
  // /dynamic_controls ship with no associated <label>. A genuine WCAG 2 A
  // failure in the fixture site, verified still present.
  label: {enabled: false},
  ...
};
```

Delete an entry to watch axe correctly report the violation. Each one was
re-verified as still present during the 2026 update.

### CI

Three jobs: lint, the local suite, and the third-party suite. The third-party
job is `continue-on-error`, so someone else's outage does not turn this badge
red; the result is still reported, and a weekly scheduled run surfaces drift
even when nothing here changes.

## License

Apache 2.0 see [LICENSE](LICENSE) and [NOTICE](NOTICE).

[TestCafe]: https://testcafe.io/
[test_advisory_board]: https://github.com/mswailes-inst/test_advisory_board
[the-internet]: https://the-internet.herokuapp.com/
[axe-core]: https://github.com/dequelabs/axe-core
