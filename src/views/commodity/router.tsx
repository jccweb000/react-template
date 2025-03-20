import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const List = lazy(() => import('./list'));

export const CommodityRouter = () => {
  return (
    <Routes>
      <Route path="/list" element={<List />} />
    </Routes>
  );
};
