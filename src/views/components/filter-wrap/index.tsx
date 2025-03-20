import React, { FC } from 'react';
import { Space } from 'antd';

interface IFilterWrap {
  children?: React.ReactNode;
}

export const FilterWrap: FC<IFilterWrap> = (props) => {
  return (
    <Space style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
      {props?.children && props.children}
    </Space>
  );
};
