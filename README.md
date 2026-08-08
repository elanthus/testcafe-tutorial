# TestCafe Tutorial

[![CI](https://github.com/elanthus/testcafe-tutorial/actions/workflows/ci.yml/badge.svg)](https://github.com/elanthus/testcafe-tutorial/actions/workflows/ci.yml)

A worked example of end-to-end browser testing with [TestCafe]: page objects
that stay readable as suites grow, React selectors that query component state
instead of guessing at markup, and accessibility checks that run alongside
functional ones. The architecture here will help you build reliable,
maintainable tests over time.

Needs Node 20 or newer and a local Chrome. TestCafe drives browsers you have
installed rather than bundling its own. If you would rather not install Chrome,
[`./build.sh`](#running) runs everything in a container instead.

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

The 2019 commits are authored as `mswailes-inst`, my Instructure work account.

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
lib/fixturePort.mjs   the fixture app's port, shared by the server and the suite
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
npm run test:live         # React suite in live mode, visible browser
npm run lint
```

Any browser TestCafe supports works:
`npx testcafe firefox theInternet/tests/*.js`. Invoking the React suite
directly also needs `--app 'node fixtures/serve.mjs'`, or it has no fixture app
to talk to. `npm run test:react` and `./build.sh react` already pass it.

To point a suite somewhere else:

```sh
# Any URL, overriding everything below.
TEST_BASE_URL=https://staging.example.com npm run test:the-internet

# The fixture app's port, if something on your machine already wants 7357.
FIXTURE_PORT=7358 npm run test:react
```

`TEST_ENV` selects one of the named environments a suite declares in its
`config.js`. Only `demo` ships, so adding a staging target is a one-line change
local to that suite, and an unknown name fails with the list of valid ones
rather than being silently treated as a URL.

`./build.sh` runs the suites in a Linux container with browsers already
installed. That gets you closer to CI than a run on your own machine, and it is
the way to run without installing Chrome. On macOS, it also allows you to run
without granting TestCafe's browser tools screen-recording permission.

```sh
./build.sh                  # both suites
./build.sh react            # local fixture app only
./build.sh the-internet     # third-party site only
BROWSER=firefox ./build.sh  # any browser the image provides
```

### Live mode

```sh
npm run test:live
```

Keeps a browser open and re-runs the React suite as you work. TestCafe serves
the fixture app itself via `--app`, so there is nothing to start first.

One thing to know: TestCafe watches the files your tests `require` : the tests,
the page objects, and anything under `lib/`. It cannot watch `fixtures/app/`,
because the browser loads that over HTTP and Node never requires it. So:

- Editing a test, a page object, or `lib/` re-runs on its own.
- Editing the app needs the bundler running in a second terminal:

  ```sh
  npm run build:fixture -- --watch=forever
  ```
  plus a `Ctrl+R` in the live-mode terminal to re-run tests.

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

Both suites run [axe-core] against the full WCAG 2.1 Level AA rule set, plus
`best-practice` and `section508`. Axe's WCAG tags are additive per version
rather than inclusive, so covering 2.1 AA means naming all four of `wcag2a`,
`wcag2aa`, `wcag21a`, and `wcag21aa`.

For `fixtures/app`, the accepted-violation list is empty and must stay that way.

For the third-party site, it is not empty, because those violations are not
ours to fix. Rather than disabling accessibility checking, the suite keeps an
explicit, justified baseline. Anything outside it still fails:

```js
const ACCEPTED_VIOLATIONS = {
  // "Form elements must have labels" - the checkbox and text input on
  // /dynamic_controls ship with no associated <label>. A genuine WCAG 2 A
  // failure in the fixture site, verified still present.
  label: {enabled: false},

  // "All page content should be contained by landmarks" - the site predates
  // landmark regions. Best-practice tag rather than a WCAG failure.
  region: {enabled: false},

  // "Elements must meet minimum color contrast ratio thresholds" - the two
  // swap buttons on /dynamic_controls fail WCAG 1.4.3. A genuine Level AA
  // failure, and one the old Level A rule set never looked for; it surfaced
  // the moment this suite moved to the full 2.1 AA tags.
  'color-contrast': {enabled: false},
};
```

Delete an entry to watch axe correctly report the violation. Each one was
re-verified as still present during the 2026 update.

### Why accessibility is tested here

This began as educational software, where accessibility is a legal obligation
rather than a nice-to-have. Public schools and state universities fall under
ADA Title II, private institutions under Title III, and anything taking federal
funds under Section 504 of the Rehabilitation Act.

Title II is the one with a codified technical standard. [DOJ's 2024 rule][doj]
adopts WCAG 2.1 Level AA, due 26 April 2027 for entities serving 50,000 or more
people and 26 April 2028 for smaller ones, dates an interim final rule extended
in April 2026. Title III and Section 504 impose accessibility obligations
without DOJ adopting a single web standard, which is why WCAG 2.1 AA is the
working benchmark rather than a literal citation.

That is also why the accessibility checks here are not decoration. Both suites
run the full 2.1 AA rule set, and `fixtures/app` carries zero violations with
no baseline.

It is an automated check, not a conformance claim. Axe covers roughly a third
of WCAG success criteria; focus order, alt-text quality, and screen-reader
semantics still need manual and assistive-technology testing. What this repo
shows is the automatable portion wired into CI, so a regression fails the build
instead of reaching a student.

[doj]: https://www.ada.gov/resources/2024-03-08-web-rule/

### CI

Three jobs: lint, the local suite, and the third-party suite. The third-party
job is `continue-on-error`, so someone else's outage does not turn this badge
red; the result is still reported, and a weekly scheduled run surfaces drift
even when nothing here changes.

## License

Apache 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

[TestCafe]: https://testcafe.io/
[test_advisory_board]: https://github.com/mswailes-inst/test_advisory_board
[the-internet]: https://the-internet.herokuapp.com/
[axe-core]: https://github.com/dequelabs/axe-core
