import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./home";
import Register from "./register";
import ErrorPage from "./error-page";
import Explore from "./explore";
import ViewTopic from "./viewtopic";
import Publish from "./publish";
import PublishTopic from "./publishtopic";
import Profile from "./profile";
import ProfileDetail from "./profile/profiledetail";
import ProfileRequest from "./profile/profilerequest";
import ProfileTopic from "./profile/profiletopic";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/explore",
    element: <Explore />,
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/viewTopic",
    element: <ViewTopic />,
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/publish",
    element: <Publish />,
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/publishTopic",
    element: <PublishTopic />,
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/publishTopicFile",
    element: <Publish />,
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "details",
        element: <ProfileDetail />,
      },
      {
        path: "requests",
        element: <ProfileRequest />,
      },
      {
        path: "topics",
        element: <ProfileTopic />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
