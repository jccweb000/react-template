import React from 'react';
import { Layout as AntdLayout } from 'antd';
import { Routes, Route } from 'react-router-dom';

import { Slider } from './slider';
import { OrgRouter } from '../organization/router';
import { PerformanceRouter } from '../performance/router';
import { CommodityRouter } from '../commodity/router';

const { Content, Sider, Header } = AntdLayout;

const Layout = () => {
  return (
    <AntdLayout style={{ height: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span>伯爵娱乐</span>
        </div>
        <div></div>
      </Header>
      <AntdLayout>
        <Sider theme="light">
          <Slider />
        </Sider>
        <Content>
          <div
            style={{
              height: '100%',
              overflow: 'scroll',
              boxSizing: 'border-box',
            }}
          >
            <Routes>
              <Route path="/org/*" element={<OrgRouter />} />
              <Route path="/performance/*" element={<PerformanceRouter />} />
              <Route path="/commodity/*" element={<CommodityRouter />} />
            </Routes>
          </div>
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
