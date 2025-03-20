import React, { useState, useEffect, useMemo, FC } from 'react';
import { Select } from 'antd';

import { Commodity } from '@/serves/commodity/types';
import { fetchAllCommodity } from '@/serves/commodity';

interface ICommoditySelect {
  value?: Commodity;
  onChange?: (v?: Commodity) => void;
}

export const CommoditySelect: FC<ICommoditySelect> = (props) => {
  const { value, onChange } = props;

  const [allCommodities, setAllCommodities] = useState<Commodity[]>();

  useEffect(() => {
    fetchAllCommodity().then((res) => {
      setAllCommodities(res.data);
    });
  }, []);

  const options = useMemo(() => {
    return allCommodities?.map((item) => ({
      label: item.name + `（${item.sellPrice}）元`,
      value: item.id,
    }));
  }, [allCommodities]);

  const onInternalChange = (id?: string) => {
    if (!id) {
      onChange?.();
      return;
    }
    const _commodity = allCommodities?.find((item) => item.id === id);
    onChange?.(_commodity);
  };

  return (
    <Select
      options={options}
      placeholder="请选择商品"
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
