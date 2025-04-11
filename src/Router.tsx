import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ProjectList } from "./pages/projects/list";
import { ProtectedRoute } from "./common/ProtectedRoute";
import { RouterLayout } from "./common/RouterLayout";
import { ServerError } from "./components/ServerError";
import { StageLayout } from "./pages/stages/Stagelayout";
import { A01 } from "./pages/stages/st1/A01";
import { A02 } from "./pages/stages/st1/A02";

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

          {/* ST1 */}
          <Route path="/projects/:projectId/st1" element={<StageLayout />}>
            <Route path="a01" element={<A01 />} />
            <Route path="a02" element={<A02 />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
