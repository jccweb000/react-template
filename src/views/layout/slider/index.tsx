import React, { useState, useEffect, Children } from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router';

const menus = [
  {
    label: '组织管理',
    key: '/org',
    children: [
      {
        label: '店铺',
        key: '/shops',
      },
      {
        label: '部门',
        key: '/department',
      },
      {
        label: '员工',
        key: '/staff',
      },
    ],
  },
  {
    label: '单据管理',
    key: '/performance',
    children: [
      {
        label: '单据列表',
        key: '/performanceList',
      },
      {
        label: '单据核算',
        key: '/accounting',
      },
    ],
  },
  {
    label: '商品管理',
    key: '/commodity',
    children: [
      {
        label: '商品库',
        key: '/list',
      },
    ],
  },
];

export const Slider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectKeys, setSelectKeys] = useState<string[]>(['/shops']);
  const [openKeys, setOpenKeys] = useState<string[]>(['/org']);

  useEffect(() => {
    const selectedRouters = location.pathname
      ?.split('/')
      .filter((item) => item !== '');
    const key = selectedRouters
      ? selectedRouters[selectedRouters.length - 1]
      : '';
    setSelectKeys(key ? [`/${key}`] : []);
  }, [location.pathname]);

  const onMenuSelect = (e: any) => {
    const { keyPath } = e;
    setOpenKeys((r) => [...r, ...keyPath]);
    const pathName = keyPath.reverse().join('');
    navigate(pathName);
  };

  return (
    <Menu
      items={menus}
      mode="inline"
      onSelect={onMenuSelect}
      selectedKeys={selectKeys}
      openKeys={openKeys}
      onOpenChange={(keys) => setOpenKeys(keys)}
    />
  );
};
