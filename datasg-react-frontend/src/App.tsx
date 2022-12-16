import React from "react";
import "./App.css";
import { Routes, Route, useRoutes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./home";
import Login from "./login";

function App() {
    const routes = useRoutes([
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
    ]);
    return routes;
}

export default App;
