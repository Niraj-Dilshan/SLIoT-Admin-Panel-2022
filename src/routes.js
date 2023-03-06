// import { Navigate, useRoutes } from 'react-router-dom';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

// // layouts
// import DashboardLayout from './layouts/dashboard';
// import SimpleLayout from './layouts/simple';
// //
// import UserPage from './pages/UserPage';
// import LoginPage from './pages/LoginPage';
// import Page404 from './pages/Page404';
// import DashboardAppPage from './pages/DashboardAppPage';

// // ----------------------------------------------------------------------

// export default function Router() {
//   // const currentUser = firebase.auth().currentUser;
//   const { currentUser } = firebase.auth();

//   const routes = useRoutes([
//     {
//       path: '/',
//       element: !currentUser ? <LoginPage /> : <Navigate to="/dashboard/app" />,
//     },
//     {
//       path: '/dashboard',
//       element: currentUser ? <DashboardLayout /> : <Navigate to="/" />,
//       children: [
//         { element: <Navigate to="/dashboard/app" />, index: true },
//         { path: 'app', element: <DashboardAppPage /> },
//         { path: 'user', element: <UserPage /> },
//       ],
//     },
//     {
//       element: <SimpleLayout />,
//       children: [
//         { path: '404', element: <Page404 /> },
//         { path: '*', element: <Navigate to="/404" /> },
//       ],
//     },
//   ]);

//   return routes;
// }
import React, { useState, useEffect } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';

// ----------------------------------------------------------------------

export default function Router() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const routes = useRoutes([
    {
      path: '/',
      element: !currentUser ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard/app" />,
    },
    {
      path: '/dashboard',
      element: currentUser ? <DashboardLayout onLogout={handleLogout} /> : <Navigate to="/" />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
  ]);

  return routes;
}
