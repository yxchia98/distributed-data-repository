import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./home";
import Register from "./register";
import ErrorPage from "./error-page";

const router = createBrowserRouter([
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
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
