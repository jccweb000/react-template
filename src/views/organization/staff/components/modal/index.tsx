import React, { FC, useRef, useEffect, useState } from 'react';
import { Modal } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';

import {
  addStaff,
  getStaffDetail,
  updateStaff,
  fetchAllShop,
  findDepartmentsByShopCode,
} from '@/serves/org';

interface IStaffModal {
  open?: boolean;
  changeOpen: (v?: boolean) => void;
  id?: string;
  refresh: () => void;
}

export const StaffModal: FC<IStaffModal> = (props) => {
  const { open, id, changeOpen, refresh } = props;
  const formRef = useRef<ProFormInstance>(null);

  const [shops, setShops] = useState<{ label: string; value: string }[]>();
  const [shopCode, setShopCode] = useState<string>();

  const [departments, setDepartments] =
    useState<{ label: string; value: string }[]>();

  const onInternalClose = () => {
    formRef?.current?.resetFields();
    changeOpen?.(false);
  };

  useEffect(() => {
    if (id && open) {
      (async () => {
        const res = await getStaffDetail(id);
        if (res.data) {
          formRef?.current?.setFieldsValue(res.data);
          setShopCode(res.data.shopCode);
        }
      })();
    }
  }, [id, open]);

  useEffect(() => {
    if (shopCode) {
      findDepartmentsByShopCode(shopCode).then((res) => {
        if (res.data) {
          const formatData = res.data.map((item) => ({
            label: item.name,
            value: item.code,
          }));
          setDepartments(formatData);
        }
      });
    }
  }, [shopCode]);

  useEffect(() => {
    fetchAllShop().then((res) => {
      if (res.data) {
        const formatData = res.data.map((item) => ({
          label: item.shopName,
          value: item.shopCode,
        }));
        setShops(formatData);
      }
    });
  }, []);

  const onFinish = async () => {
    const values = await formRef?.current?.validateFields();
    if (id) {
      const res = await updateStaff({ ...values, id });
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    } else {
      const res = await addStaff(values);
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    }
  };

  return (
    <Modal
      title={id ? '编辑员工' : '新增员工'}
      open={open}
      onCancel={onInternalClose}
      footer={null}
    >
      <ProForm formRef={formRef} onFinish={onFinish}>
        <ProFormText
          name="name"
          rules={[{ required: true }]}
          label="员工名称"
        />
        <ProFormText label="联系方式" name="phoneNumber" />
        <ProFormDigit label="年龄" name="age" />
        <ProFormSelect
          label="所属门店"
          name="shopCode"
          rules={[{ required: true }]}
          options={shops}
          onChange={(v) => {
            formRef.current?.setFieldsValue({ departmentCode: undefined });
            setShopCode(v as string | undefined);
          }}
        />
        <ProFormSelect
          label="所属部门"
          rules={[{ required: true }]}
          name="departmentCode"
          options={departments}
        />
        <ProFormTextArea label="备注" name="remark" />
      </ProForm>
    </Modal>
  );
};
