import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const StaffPerformance = lazy(() => import('./staff'));
const List = lazy(() => import('./list'));
const AccountingPage = lazy(() => import('./accounting'));

export const PerformanceRouter = () => {
  return (
    <Routes>
      <Route path="/performanceList" element={<List />} />
      <Route path="/staffPerformance" element={<StaffPerformance />} />
      <Route path="/accounting" element={<AccountingPage />} />
    </Routes>
  );
};
