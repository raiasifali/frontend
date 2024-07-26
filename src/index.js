import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/fonts/stylesheet.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './dashboard';
import Header from './components/header';
import UserManagment from './user-management';
import ManageVideos from './manage-videos';
import Register from './Pages/Register/Register';
import News from './News';
import Testimonial from './testimonial';
import Players from './players';
import Leads from './Pages/Leads/Leads';
import About from './Pages/About/About';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: (
      <Header>
        <Dashboard />
      </Header>
    ),
  },
  {
    path: '/user-management',
    element: (
      <Header>
        <UserManagment />
      </Header>
    ),
  },
  {
    path: '/players',
    element: (
      <Header>
        <UserManagment />
      </Header>
    ),
  },
  {
    path: '/manage-videos',
    element: (
      <Header>
        <ManageVideos />
      </Header>
    ),
  },
  {
    path: '/leads',
    element: (
      <Header>
        <Leads />
      </Header>
    ),
  },
  {
    path: '/about',
    element: (
      <Header>
        <About />
      </Header>
    ),
  },
  {
    path: '/news',
    element: (
      <Header>
        <News />
      </Header>
    ),
  },
  {
    path: '/testimonial',
    element: (
      <Header>
        <Testimonial />
      </Header>
    ),
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
