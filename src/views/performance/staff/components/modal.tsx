import React, { FC, useRef, useEffect, useState } from 'react';
import { Modal } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormInstance,
  ProFormDatePicker,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import dayjs from 'dayjs';

import { updateStaff, getOrgTree } from '@/serves/org';
import { addStaffPerformance } from '@/serves/staff-performance';

interface IStaffPerformanceModal {
  open?: boolean;
  changeOpen: (v?: boolean) => void;
  id?: string;
  refresh: () => void;
}

export const StaffPerformanceModal: FC<IStaffPerformanceModal> = (props) => {
  const { open, id, changeOpen, refresh } = props;
  const formRef = useRef<ProFormInstance>(null);

  const [treeData, setTreeData] = useState<any[]>();

  const onInternalClose = () => {
    formRef?.current?.resetFields();
    changeOpen?.(false);
  };

  const onFinish = async () => {
    const values = await formRef?.current?.validateFields();
    const { belongTime } = values;
    values.belongTime = dayjs(belongTime).valueOf();
    if (id) {
      const res = await updateStaff({ ...values, userId: id });
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    } else {
      const res = await addStaffPerformance(values);
      if (res) {
        refresh();
        formRef?.current?.resetFields();
        changeOpen(false);
      }
    }
  };

  useEffect(() => {
    if (open) {
      getOrgTree().then((res) => {
        if (res.data) {
          const data = res.data.map((shop: any) => ({
            label: shop.shopName,
            key: shop.shopCode,
            value: shop.shopCode,
            selectable: false,
            children: shop.departments?.map((department: any) => ({
              label: department.name,
              key: department.code,
              value: department.code,
              selectable: false,
              children: department.users?.map((user: any) => ({
                label: user.name,
                key: user.userId,
                value: user.userId,
                isLeaf: true,
              })),
            })),
          }));
          setTreeData(data);
        }
      });
    }
  }, [open]);

  console.log('treeData', treeData);

  return (
    <Modal
      title={id ? '编辑单据' : '新增单据'}
      open={open}
      onCancel={onInternalClose}
      footer={null}
    >
      <ProForm formRef={formRef} onFinish={onFinish}>
        {/* <ProFormText name="staffId" rules={[{ required: true }]} label="员工" /> */}
        <ProFormTreeSelect
          name="staffId"
          label="员工"
          rules={[{ required: true }]}
          fieldProps={{
            treeData: treeData,
            placeholder: '请选择员工',
          }}
        />
        <ProFormDigit
          label="业绩"
          name="performance"
          rules={[{ required: true }]}
        />
        <ProFormDigit
          label="提成"
          name="commission"
          rules={[{ required: true }]}
        />
        <ProFormDigit label="挂帐" name="credit" />
        <ProFormDigit label="借帐" name="borrow" />
        <ProFormDatePicker
          label="归属日期"
          name="belongTime"
          rules={[{ required: true }]}
        />
        <ProFormTextArea label="备注" name="remark" />
      </ProForm>
    </Modal>
  );
};
