import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MdDeveloperMode,
  MdOutlineBrightnessLow,
  MdOutlineDarkMode,
} from 'react-icons/md';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { asyncPreloadProcess } from './states/isPreload/action';
import { asyncUnsetAuthUser } from './states/authUser/action';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import Navigation from './components/Navigation';
import AddThreadPage from './pages/AddThreadPage';
import Loading from './components/Loading';
import { Container } from './styledComponents/Container';
import DarkThemeProvider from './styledComponents/DarkThemeProvider';
import { toggleDarkThemeThunk } from './states/theme/action';
import { RootState } from './types';

function App(): JSX.Element {
  const authUser = useSelector((state: RootState) => state.authUser);
  const isPreload = useSelector((state: RootState) => state.isPreload);
  const darkTheme = useSelector((state: RootState) => state.darkTheme);
  const themeKey = localStorage.getItem('theme');
  const storedTheme = themeKey ? JSON.parse(themeKey) : darkTheme;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  const onSignOut = (): void => {
    dispatch(asyncUnsetAuthUser());
  };

  if (isPreload) {
    return null;
  }

  if (authUser === null) {
    return (
      <DarkThemeProvider>
        <Container>
          <header className="app-header">
            <div className="app-logo">
              <MdDeveloperMode style={{ fontSize: '64px' }} />
              <h1>Forum App</h1>
              <button
                type="button"
                className="toggle-theme"
                onClick={() => dispatch(toggleDarkThemeThunk())}
              >
                {storedTheme ? (
                  <MdOutlineBrightnessLow />
                ) : (
                  <MdOutlineDarkMode />
                )}
              </button>
            </div>
          </header>
          <Loading />
          <main>
            <Routes>
              <Route path="/*" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
        </Container>
      </DarkThemeProvider>
    );
  }

  return (
    <DarkThemeProvider>
      <Container>
        <header className="app-header">
          <div className="app-logo">
            <MdDeveloperMode style={{ fontSize: '64px' }} />
            <h1>Forum App</h1>
            <button
              type="button"
              className="toggle-theme"
              onClick={() => dispatch(toggleDarkThemeThunk())}
            >
              {storedTheme ? <MdOutlineBrightnessLow /> : <MdOutlineDarkMode />}
            </button>
          </div>
        </header>
        <Loading />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/threads/:id" element={<DetailPage />} />
            <Route path="/threads" element={<AddThreadPage />} />
          </Routes>
        </main>

        <footer>
          <Navigation signOut={onSignOut} />
        </footer>
      </Container>
    </DarkThemeProvider>
  );
}

export default App;
