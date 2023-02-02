import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./home";
import Register from "./register";
import ErrorPage from "./error-page";
import Explore from "./explore";
import ViewTopic from "./viewtopic";

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
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
