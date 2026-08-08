import {useState} from 'react';

/**
 * These component names and prop names are the contract the page objects in
 * reactSelectors/page/ query against. Renaming a component here is a breaking
 * change for the tests - which is the point: the tests are coupled to the
 * component API, not to markup or styling.
 */

export function HamburgerButton({expanded, onToggle}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls="drawer-contents"
      onClick={onToggle}
    >
      {expanded ? 'Close navigation' : 'Open navigation'}
    </button>
  );
}

export function NavToggle({summary, expanded, onToggle, children}) {
  const contentId = `nav-toggle-${summary}`;

  return (
    <div className="drawer-section">
      <button type="button" aria-expanded={expanded} aria-controls={contentId} onClick={onToggle}>
        {summary}
      </button>
      {expanded ? <ul id={contentId}>{children}</ul> : null}
    </div>
  );
}

export function PageLink({name}) {
  return (
    <li>
      <a href={`#${name}`}>{name}</a>
    </li>
  );
}

export function NavigationDrawer({pages}) {
  const [expanded, setExpanded] = useState(false);
  const [componentsExpanded, setComponentsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  const matches = pages.filter((page) => page.toLowerCase().includes(query.toLowerCase()));

  return (
    <nav aria-label="Components">
      <HamburgerButton expanded={expanded} onToggle={() => setExpanded(!expanded)} />

      {expanded ? (
        <div id="drawer-contents">
          <div role="search">
            <label htmlFor="nav-search">Search components</label>{' '}
            <input
              id="nav-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {/* Only one of these renders at a time, so a `[href="#Name"]`
              selector always resolves to exactly one element. */}
          {query ? (
            <ul aria-label="Search results">
              {matches.map((page) => <PageLink key={page} name={page} />)}
            </ul>
          ) : (
            <NavToggle
              summary="components"
              expanded={componentsExpanded}
              onToggle={() => setComponentsExpanded(!componentsExpanded)}
            >
              {pages.map((page) => <PageLink key={page} name={page} />)}
            </NavToggle>
          )}
        </div>
      ) : null}
    </nav>
  );
}
