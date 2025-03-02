import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Home } from "./pages/home";
import { ProtectedRoute } from "./common/ProtectedRoute";
import { RouterLayout } from "./common/RouterLayout";
import { StageLayout } from "./pages/stages/Stagelayout";
import { Stage } from "./types/stage";
import { A01 } from "./pages/stages/st1/a01";
import { A02 } from "./pages/stages/st1/a02";
import { A03 } from "./pages/stages/st1/a03";
import { A04 } from "./pages/stages/st1/a04";
import { ServerError } from "./components/ServerError";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RouterLayout />}>
          <Route path="/" element={<Home />} index />
          <Route path="/server-error" element={<ServerError />} />

          {/* <Route path="projects" element={<ProjectsList />} /> */}

          <Route
            path="/projects/:projectId/st1"
            element={<StageLayout stage={Stage.ST1} />}
          >
            <Route path="a01" element={<A01 />} />
            <Route path="a02" element={<A02 />} />
            <Route path="a03" element={<A03 />} />
            <Route path="a04" element={<A04 />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
