import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Register from './pages/Register.jsx';
import User from './pages/User.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import Favourite from './pages/Favourite.jsx';
import Folder from './pages/Folder.jsx';
import FolderDetail from './pages/FolderDetail.jsx';
import Role from './pages/Role.jsx';
import Permission from './pages/Permission.jsx';
import MyProfile from './pages/MyProfile.jsx';
import MyDrive from './pages/MyDrive.jsx';
import MyDriveDetail from './pages/MyDriveDetail.jsx';
import MyTrashDetail from './pages/MyTrashDetail.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "users",
        element: <User />
      },
      {
        path:"favourites",
        element:<Favourite/>
      },
      {
        path:"folders",
        element:<Folder/>
      },
      {
        path:"folders/:id",
        element:<FolderDetail/>
      },
      {
        path:"roles",
        element:<Role/>
      },
      {
        path:"permissions",
        element:<Permission/>
      },
      {
        path:"my-profile",
        element:<MyProfile/>
      },
      {
        path:"my-drive",
        element:<MyDrive/>
      },
      {
        path:"my-drive/:id",
        element:<MyDriveDetail/>
      },
      {
        path:"my-trash/:id",
        element:<MyTrashDetail/>
      }
    ]
  },
  {
    path: "register",
    element: <Register />
  },
  {
    path: "login",
    element: <Login />
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)
