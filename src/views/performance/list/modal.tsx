import React, { FC, useEffect } from 'react';
import {
  Modal,
  Form,
  DatePicker,
  Space,
  Input,
  InputNumber,
  Button,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { addPerformance } from '@/serves/performance';
import { CommoditySelect } from './components/commodity-select';
import { StaffSelect } from './components/staff-select';

interface IPerformanceModal {
  open?: boolean;
  changeOpen: (v?: boolean) => void;
  refresh: () => void;
}

export const PerformanceModal: FC<IPerformanceModal> = (props) => {
  const { open, refresh, changeOpen } = props;
  const [form] = Form.useForm();
  const commoditiesValue = Form.useWatch('commodities', form);

  useEffect(() => {
    const _commoditiesValue = commoditiesValue?.filter((item: any) => !!item);
    if (!_commoditiesValue?.length) {
      form.setFieldsValue({ amount: 0 });
      return;
    }
    const hasNoFinished = _commoditiesValue.some(
      (item: any) => !item?.commodity || !item?.num,
    );
    if (hasNoFinished) {
      return;
    }
    const amount = _commoditiesValue.reduce((total: number, cur: any) => {
      const current = cur.commodity.sellPrice * cur.num;
      return total + current;
    }, 0);
    form.setFieldsValue({ amount });
  }, [commoditiesValue]);

  const onFinish = async () => {
    const values = await form.validateFields();

    const { belongDate, staffInfo, commodities, ...restValues } = values;
    const date = dayjs(belongDate).valueOf();
    const params = {
      belongDate: date,
      staffId: staffInfo.id,
      staffName: staffInfo.name,
      departmentCode: staffInfo.departmentCode,
      departmentName: staffInfo.departmentName,
      shopCode: staffInfo.shopCode,
      shopName: staffInfo.shopName,
      commodities: commodities.map((item: any) => ({
        id: item.commodity.id,
        name: item.commodity.name,
        sellPrice: item.commodity.sellPrice,
        num: item.num,
      })),
      ...restValues,
    };

    const res = await addPerformance(params);
    if (res) {
      refresh();
      form.resetFields();
      changeOpen(false);
    }
  };

  return (
    <Modal
      title="新增单据"
      open={open}
      onOk={onFinish}
      onCancel={() => {
        form.resetFields();
        changeOpen(false);
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="单据归属日期"
          name="belongDate"
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item label="员工" name="staffInfo" rules={[{ required: true }]}>
          <StaffSelect />
        </Form.Item>
        <Form.List name="commodities">
          {(fields, { add, remove }) => (
            <>
              <span style={{ marginBottom: '8px' }}>商品信息</span>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 8,
                    backgroundColor: 'rgb(247, 248, 250)',
                    padding: '10px',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                  }}
                  align="center"
                >
                  <Form.Item
                    {...restField}
                    label="商品"
                    name={[name, 'commodity']}
                    rules={[{ required: true }]}
                  >
                    <CommoditySelect />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="数量"
                    name={[name, 'num']}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={1}
                      placeholder="请输入商品数量"
                      style={{ width: 150 }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  添加一个商品
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          label="合计（元）"
          name="amount"
          rules={[{ required: true }]}
        >
          <InputNumber disabled />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
