import React from "react";
import "./App.css";
import { Routes, Route, useRoutes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./home";
import Register from "./register";

function App() {
    const routes = useRoutes([
        { path: "/", element: <Home /> },
        { path: "/login", element: <Register /> },
    ]);
    return <div className="h-screen bg-gray-100 overflow-auto">{routes}</div>;
}

export default App;
