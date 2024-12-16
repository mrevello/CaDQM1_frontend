import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { RouterLayout } from "./common/RouterLayout";
import { Register } from "./pages/register";
import { ProtectedRoute } from "./common/ProtectedRoute";

export const AppRouter: React.FC<{}> = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<RouterLayout />}>
          {/* <Route path="/" element={<Home />} /> */}
        </Route>
      </Route>
    </Routes>
  );
};
