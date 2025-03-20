import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Shops = lazy(() => import('./shops'));
const Staff = lazy(() => import('./staff'));
const Department = lazy(() => import('./department'));

export const OrgRouter = () => {
  console.log('org');

  return (
    <Routes>
      <Route path="/shops" element={<Shops />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/department" element={<Department />} />
    </Routes>
  );
};
