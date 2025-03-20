import React, { FC, useRef, useEffect, useState } from 'react';
import { Modal } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  getDepartmentDetail,
  addDepartment,
  updateDepartment,
  fetchAllShop,
} from '@/serves/org';

interface IDepartmentModal {
  open?: boolean;
  changeOpen: (v?: boolean) => void;
  id?: string;
  refresh: () => void;
}
export const DepartmentModal: FC<IDepartmentModal> = (props) => {
  const { open, id, changeOpen, refresh } = props;
  const formRef = useRef<ProFormInstance>(null);

  const [shops, setShops] = useState<{ label: string; value: string }[]>();

  const fetchShops = async () => {
    const res = await fetchAllShop();
    if (res) {
      const formatData = res.data.map((item) => ({
        label: item.shopName,
        value: item.shopCode,
      }));
      setShops(formatData);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (id && open) {
      (async () => {
        const res = await getDepartmentDetail(id);
        if (res.data) {
          formRef?.current?.setFieldsValue(res.data);
        }
      })();
    }
  }, [id, open]);

  const onInternalClose = () => {
    formRef?.current?.resetFields();
    changeOpen?.(false);
  };

  const onFinish = async () => {
    const values = await formRef?.current?.validateFields();
    if (id) {
      const res = await updateDepartment({ ...values, code: id });
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    } else {
      const res = await addDepartment(values);
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    }
  };

  return (
    <Modal
      title={id ? '编辑部门' : '新增部门'}
      open={open}
      onCancel={onInternalClose}
      footer={null}
    >
      <ProForm formRef={formRef} onFinish={onFinish}>
        <ProFormText
          name="name"
          rules={[{ required: true }]}
          label="部门名称"
        />
        <ProFormSelect
          name="shopCode"
          rules={[{ required: true }]}
          label="所属店铺"
          options={shops}
        />
      </ProForm>
    </Modal>
  );
};
