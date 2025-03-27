import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ProjectList } from "./pages/projects/list";
import { ProtectedRoute } from "./common/ProtectedRoute";
import { RouterLayout } from "./common/RouterLayout";
import { ServerError } from "./components/ServerError";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RouterLayout />}>
          <Route path="/server-error" element={<ServerError />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="*" element={<Navigate to="/projects" />} />
        </Route>
      </Route>
    </Routes>
  );
};
