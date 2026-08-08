import {useState} from 'react';

export function MenuItem({value, label, onSelect}) {
  return (
    <li>
      <button type="button" onClick={() => onSelect(value)}>
        {label}
      </button>
    </li>
  );
}

export function Popover({children}) {
  return <div className="popover">{children}</div>;
}

/**
 * A menu whose "More Options" entry reveals a submenu on hover or focus.
 * Hover-revealed content is the case where tests are most tempted to sleep;
 * the page object waits on the submenu's own presence instead.
 */
export function Menu({onSelect}) {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  return (
    <div>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        Menu
      </button>

      {open ? (
        <Popover>
          <ul>
            <MenuItem value="optionOne" label="Option One" onSelect={onSelect} />

            <li
              onMouseEnter={() => setSubmenuOpen(true)}
              onMouseLeave={() => setSubmenuOpen(false)}
            >
              <button
                type="button"
                aria-expanded={submenuOpen}
                onClick={() => setSubmenuOpen(!submenuOpen)}
                onFocus={() => setSubmenuOpen(true)}
              >
                More Options
              </button>

              {submenuOpen ? (
                <ul className="submenu">
                  <MenuItem value="optionTwo" label="Option Two" onSelect={onSelect} />
                  <MenuItem value="optionThree" label="Option Three" onSelect={onSelect} />
                </ul>
              ) : null}
            </li>
          </ul>
        </Popover>
      ) : null}
    </div>
  );
}
