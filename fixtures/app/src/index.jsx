import {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {NavigationDrawer} from './Navigation';
import {Menu} from './Menu';

const PAGES = ['Menu', 'Popover', 'Tooltip'];

function currentPage() {
  return window.location.hash.replace('#', '') || 'Home';
}

function App() {
  const [page, setPage] = useState(currentPage());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const onHashChange = () => {
      setPage(currentPage());
      setSelected(null);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <>
      <header>
        <h1>Component Gallery</h1>
      </header>

      <NavigationDrawer pages={PAGES} />

      <main>
        <h2>{page}</h2>
        {page === 'Menu' ? (
          <>
            <Menu onSelect={setSelected} />
            <p>Selected: {selected || 'nothing'}</p>
          </>
        ) : (
          <p>Choose a component from the navigation.</p>
        )}
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
