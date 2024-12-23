import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';

const Navbar = lazy(() => import('./components/Navbar'));
const Homepage = lazy(() => import('./views/Home'));

import './App.css';

function App() {
  const isHomePage = useSelector((state) => state.image.isHomePage);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <Homepage isHomePage={isHomePage} />
    </Suspense>
  );
}

export default App;
