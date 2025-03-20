import React, { FC, useState, useEffect } from 'react';
import { Select, SelectProps } from 'antd';

import { fetchAllDepartment } from '@/serves/org';

export const DepartmentSelect: FC<Omit<SelectProps, 'options'>> = (props) => {
  const { ...restProps } = props;
  const [options, setOptions] = useState<{ label: string; value: string }[]>();

  useEffect(() => {
    fetchAllDepartment().then((res) => {
      if (res.data) {
        const formatData = res.data.map((item) => ({
          label: item.name,
          value: item.code,
        }));

        setOptions(formatData);
      }
    });
  }, []);

  return (
    <Select
      options={options}
      placeholder="请选择部门"
      allowClear
      showSearch
      filterOption={(input, option) =>
        ((option?.label ?? '') as string).includes(input)
      }
      {...restProps}
    />
  );
};
