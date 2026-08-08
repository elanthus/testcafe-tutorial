# Fixture app

A small React app that the `reactSelectors/` suite runs against.

It exists so that suite has a target nobody else can change. The tests
originally ran against a public documentation site; seven years later every
selector in them had rotted, which is the failure mode this directory removes.

## Contract

The tests couple to component and prop names, not to markup. These are the
names they depend on:

| Component | Props queried |
|---|---|
| `HamburgerButton` | `expanded` |
| `NavToggle` | `summary`, `expanded` |
| `MenuItem` | `value` |
| `Popover` | none |

Renaming any of these breaks the suite, and should: it is a change to the
component's public API. Restyling, re-nesting, or rewriting the CSS does not.

## Accessibility

The suite runs axe against this app with an **empty** accepted-violation list.
Any violation is a bug to fix here, not to suppress in the test.

## Running it by hand

```sh
npm run start:fixture   # builds, then serves on http://localhost:7357
```

During a test run TestCafe starts and stops the server itself via its `--app`
option, so there is nothing to manage.

The port lives in [`lib/fixturePort.mjs`](../lib/fixturePort.mjs), shared by the
server and the suite so they cannot disagree. It is not 3000, because that port
collides with most dev tooling. If something on your machine wants 7357 too:

```sh
FIXTURE_PORT=7358 npm run test:react
```
