import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { RouterLayout } from "./common/RouterLayout";
import { Register } from "./pages/register";

export const AppRouter: React.FC<{}> = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<RouterLayout />}>
                <Route path="/" element={<Login />} />
            </Route>
        </Routes>
    );
};