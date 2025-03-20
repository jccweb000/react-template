import React, { FC } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';

import { DepartmentSelect } from '@/views/components/department-select';
import { createAccounting } from '@/serves/performance';

interface ICreateAccountingModal {
  open?: boolean;
  changeOpen?: (v?: boolean) => void;
  reload: () => void;
}

const { RangePicker } = DatePicker;

export const CreateAccountingModal: FC<ICreateAccountingModal> = (props) => {
  const { open, changeOpen, reload } = props;

  const [form] = Form.useForm();

  const onInternalClose = () => {
    form.resetFields();
    changeOpen?.();
  };

  const handleFormValues = () => {
    form.validateFields().then((values) => {
      const { name, dateRange, departmentCode } = values;
      const range: [number, number] = [
        dayjs(dateRange[0]).startOf('day').valueOf(),
        dayjs(dateRange[1]).endOf('day').valueOf(),
      ];
      const params = {
        name,
        dateRange: range,
        departmentCode,
      };

      (async () => {
        await createAccounting(params);
        onInternalClose();
        reload();
      })();
    });
  };

  return (
    <Modal
      title="新增部门核算单据"
      open={open}
      onCancel={onInternalClose}
      onOk={handleFormValues}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="单据名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入核算单据名称" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          label="选择核算时间范围"
          name="dateRange"
          rules={[{ required: true }]}
        >
          <RangePicker style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          label="选择需要核算的部门"
          name="departmentCode"
          rules={[{ required: true }]}
        >
          <DepartmentSelect style={{ width: 300 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
