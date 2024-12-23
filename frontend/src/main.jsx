import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto/400.css';

import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./views/Home.jsx'));
const Login = lazy(() => import('./views/Login.jsx'));
const SignUp = lazy(() => import('./views/Signup.jsx'));
const App = lazy(() => import('./App.jsx'));
const CreatePost = lazy(() => import('./views/CreatePost.jsx'));
const ImageDetails = lazy(() => import('./views/ImageDetails.jsx'));
const Profile = lazy(() => import('./views/Profile.jsx'));

import './index.css';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/blog" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/image/:id" element={<ImageDetails />} />
            <Route path="/create" element={<CreatePost />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </ThemeProvider>
    </Suspense>
  </Provider>
);
