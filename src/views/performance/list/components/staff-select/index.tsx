import React, { useState, useEffect, useMemo, FC } from 'react';
import { Select } from 'antd';

import { fetchAllStaff } from '@/serves/org';
import { Staff } from '@/serves/org/types';

interface IStaffSelect {
  value?: Staff;
  onChange?: (v?: Staff) => void;
}

export const StaffSelect: FC<IStaffSelect> = (props) => {
  const { value, onChange } = props;

  const [allStaffs, setAllStaffs] = useState<Staff[]>();

  useEffect(() => {
    fetchAllStaff().then((res) => {
      setAllStaffs(res);
    });
  }, []);

  const options = useMemo(() => {
    return allStaffs?.map((item) => ({
      label: item.name + `（${item.departmentName}）`,
      value: item.id,
    }));
  }, [allStaffs]);

  const onInternalChange = (id?: string) => {
    if (!id) {
      onChange?.();
      return;
    }
    const staff = allStaffs?.find((item) => item.id === id);
    onChange?.(staff);
  };

  return (
    <Select
      options={options}
      placeholder="请选择员工"
      style={{ width: 200 }}
      onChange={onInternalChange}
      value={value?.id}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};
