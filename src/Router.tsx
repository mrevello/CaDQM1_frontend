import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { ProjectsList } from './pages/projects/list';
import { ProtectedRoute } from './common/ProtectedRoute';
import { RouterLayout } from './common/RouterLayout';
import { ServerError } from './components/ServerError';
import { StageLayout } from './pages/stages/Stagelayout';
import { A01 } from './pages/stages/st1/A01';
import { A02 } from './pages/stages/st1/A02';
import { A03 as ST1A03 } from './pages/stages/st1/A03';
import { A04 as ST1A04 } from './pages/stages/st1/A04';
import { A03 as ST2A03 } from './pages/stages/st2/A03';
import { A07 as ST2A07 } from './pages/stages/st2/A07';
import { A03 as ST3A03 } from './pages/stages/st3/A03';
import { A07 as ST3A07 } from './pages/stages/st3/A07';
import { A05 } from './pages/stages/st2/A05';
import { A06 } from './pages/stages/st2/A06';
import { A08 } from './pages/stages/st3/A08';
import { Context } from './pages/context';
import { ROUTES } from './constants';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RouterLayout />}>
          <Route path={ROUTES.SERVER_ERROR} element={<ServerError />} />
          <Route path={ROUTES.PROJECTS} element={<ProjectsList />} />
          <Route path={ROUTES.PROJECT_CONTEXT} element={<Context />} />

          <Route path="*" element={<Navigate to={ROUTES.PROJECTS} />} />

          {/* ST1 */}
          <Route path={ROUTES.STAGE_1} element={<StageLayout />}>
            <Route path={ROUTES.ST1_A01} element={<A01 />} />
            <Route path={ROUTES.ST1_A02} element={<A02 />} />
            <Route path={ROUTES.ST1_A03} element={<ST1A03 />} />
            <Route path={ROUTES.ST1_A04} element={<ST1A04 />} />
          </Route>

          {/* ST2 */}
          <Route path={ROUTES.STAGE_2} element={<StageLayout />}>
            <Route path={ROUTES.ST2_A05} element={<A05 />} />
            <Route path={ROUTES.ST2_A03} element={<ST2A03 />} />
            <Route path={ROUTES.ST2_A06} element={<A06 />} />
            <Route path={ROUTES.ST2_A07} element={<ST2A07 />} />
          </Route>

          {/* ST3 */}
          <Route path={ROUTES.STAGE_3} element={<StageLayout />}>
            <Route path={ROUTES.ST3_A08} element={<A08 />} />
            <Route path={ROUTES.ST3_A03} element={<ST3A03 />} />
            <Route path={ROUTES.ST3_A07} element={<ST3A07 />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
