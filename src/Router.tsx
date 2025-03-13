import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Home } from "./pages/home";
import { ProtectedRoute } from "./common/ProtectedRoute";
import { RouterLayout } from "./common/RouterLayout";
import { StageLayout } from "./pages/stages/Stagelayout";
import { A01 } from "./pages/stages/st1/A01";
import { A02 } from "./pages/stages/st1/A02";
import { A03A04 as ST1A03A04 } from "./pages/stages/st1/A03A04";
import { A03A04 as ST2A03A04 } from "./pages/stages/st2/A03A04";
import { A03A04 as ST3A03A04 } from "./pages/stages/st2/A03A04";
import { ServerError } from "./components/ServerError";
import { A05 } from "./pages/stages/st2/A05";
import { A06 } from "./pages/stages/st2/A06";
import { A08 } from "./pages/stages/st3/A08";

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

          {/* ST1 */}
          <Route path="/projects/:projectId/st1" element={<StageLayout />}>
            <Route path="a01" element={<A01 />} />
            <Route path="a02" element={<A02 />} />
            <Route path="a03a04" element={<ST1A03A04 />} />
          </Route>

          {/* ST2 */}
          <Route path="/projects/:projectId/st2" element={<StageLayout />}>
            <Route path="a05" element={<A05 />} />
            <Route path="a03a04" element={<ST2A03A04 />} />
            <Route path="a06" element={<A06 />} />
          </Route>

          {/* ST3 */}
          <Route path="/projects/:projectId/st3" element={<StageLayout />}>
            <Route path="a08" element={<A08 />} />
            <Route path="a03a04" element={<ST3A03A04 />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
