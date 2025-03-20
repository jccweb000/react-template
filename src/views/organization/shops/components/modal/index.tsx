import React, { FC, useRef, useEffect } from 'react';
import { Modal } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormInstance,
} from '@ant-design/pro-components';

import { addShop, getShopDetail, updateShop } from '@/serves/org';

interface IShopModal {
  open?: boolean;
  changeOpen: (v?: boolean) => void;
  id?: string;
  refresh: () => void;
}

export const ShopModal: FC<IShopModal> = (props) => {
  const { open, id, changeOpen, refresh } = props;
  const formRef = useRef<ProFormInstance>(null);
  const onInternalClose = () => {
    formRef?.current?.resetFields();
    changeOpen?.(false);
  };

  useEffect(() => {
    if (id && open) {
      (async () => {
        const res = await getShopDetail(id);
        if (res.data) {
          formRef?.current?.setFieldsValue(res.data);
        }
      })();
    }
  }, [id, open]);

  const onFinish = async () => {
    const values = await formRef?.current?.validateFields();
    if (id) {
      const res = await updateShop({ ...values, shopCode: id });
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    } else {
      const res = await addShop(values);
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    }
  };

  return (
    <Modal
      title={id ? '编辑店铺' : '新增店铺'}
      open={open}
      onCancel={onInternalClose}
      footer={null}
    >
      <ProForm formRef={formRef} onFinish={onFinish}>
        <ProFormText
          name="shopName"
          rules={[{ required: true }]}
          label="店铺名称"
        />
        <ProFormText label="店铺地址" name="address" />
        <ProFormText label="联系方式" name="phoneNumber" />
      </ProForm>
    </Modal>
  );
};
