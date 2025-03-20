import React, { FC, useRef, useEffect } from 'react';
import { Modal } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
} from '@ant-design/pro-components';

import { addCommodity, updateCommodity, fetchDetail } from '@/serves/commodity';
import { CommodityStatus } from '@/serves/commodity/types';

interface ICommodityModal {
  open?: boolean;
  changeOpen: (v?: boolean) => void;
  id?: string;
  refresh: () => void;
}

export const CommodityModal: FC<ICommodityModal> = (props) => {
  const { open, id, changeOpen, refresh } = props;
  const formRef = useRef<ProFormInstance>(null);

  const onInternalClose = () => {
    formRef?.current?.resetFields();
    changeOpen?.(false);
  };

  useEffect(() => {
    if (id && open) {
      (async () => {
        const res = await fetchDetail(id);
        if (res.data) {
          formRef?.current?.setFieldsValue(res.data);
        }
      })();
    }
  }, [id, open]);

  const onFinish = async () => {
    const values = await formRef?.current?.validateFields();
    if (id) {
      const res = await updateCommodity({ ...values, id });
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    } else {
      const res = await addCommodity(values);
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    }
  };

  return (
    <Modal
      title={id ? '编辑商品' : '新增商品'}
      open={open}
      onCancel={onInternalClose}
      footer={null}
    >
      <ProForm formRef={formRef} onFinish={onFinish}>
        <ProFormText
          name="name"
          rules={[{ required: true }]}
          label="商品名称"
        />
        <ProFormDigit
          label="商品价格（元）"
          name="price"
          rules={[{ required: true }]}
        />
        <ProFormDigit label="销售价格" name="sellPrice" />
        {id ? (
          <ProFormSelect
            label="商品状态"
            name="status"
            options={[
              { label: '在售', value: CommodityStatus.normal },
              { label: '预售', value: CommodityStatus.preSale },
              { label: '售罄', value: CommodityStatus.soldOut },
              { label: '下架', value: CommodityStatus.remove },
            ]}
          />
        ) : null}
      </ProForm>
    </Modal>
  );
};
