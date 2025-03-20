import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  TableColumnsType,
  Tag,
  Space,
  Table,
  TablePaginationConfig,
  Tooltip,
  Input,
  DatePicker,
  Badge,
  Row,
  Col,
  Select,
} from 'antd';
import dayjs from 'dayjs';

import { PerformanceModal } from './modal';
import { Performance } from '@/serves/performance/types';
import { Page } from '@/serves/type';
import { fetchList } from '@/serves/performance';
import { DepartmentSelect } from '@/views/components/department-select';

const initPagination = {
  pageNumber: 1,
  pageSize: 10,
};

const statusOptions = [
  { label: '已核算', value: 'Accounted' },
  { label: '未核算', value: 'NotAccount' },
  { label: '已作废', value: 'Voided' },
];

const PerformancePage = () => {
  const [list, setList] = useState<Performance[]>();
  const [page, setPage] = useState<Page>(initPagination);
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>();
  const [keyword, setKeyword] = useState<string>();
  const [belongDate, setBelongDate] = useState<number>();
  const [departmentCode, setDepartmentCode] = useState<string>();
  const [status, setStatus] = useState<'Accounted' | 'NotAccount' | 'Voided'>(
    'NotAccount',
  );

  const { pageNumber, pageSize } = page;
  const fetchPageList = async () => {
    const res = await fetchList({
      pageNumber,
      pageSize,
      keyword,
      belongDate,
      departmentCode,
      status,
    });
    if (res) {
      const { list, count: total } = res;
      setList(list);
      setCount(total);
    }
  };
  const reload = () => {
    if (pageNumber === 1) {
      fetchPageList();
    } else {
      setPage((r) => ({ ...r, pageNumber: 1 }));
    }
  };

  useEffect(() => {
    fetchPageList();
  }, [pageNumber, pageSize, keyword, belongDate, departmentCode, status]);

  const columns: TableColumnsType<Performance> = [
    {
      title: '员工姓名',
      dataIndex: 'staffInfo',
      render: (_, record) => record.staffName,
      fixed: 'left',
      width: 120,
    },
    {
      title: '金额合计(元)',
      dataIndex: 'amount',
      render: (text: number) => text || 0,
      fixed: 'left',
    },
    {
      title: '单据状态',
      dataIndex: 'status',
      fixed: 'left',
      render: (text: string) => {
        switch (text) {
          case 'Accounted':
            return <Badge status="success" text="已核算" />;
          case 'NotAccount':
            return <Badge status="warning" text="未核算" />;
          case 'Voided':
            return <Badge status="default" text="已作废" />;
          default:
            return null;
        }
      },
    },
    {
      title: '归属日期',
      dataIndex: 'belongDate',
      render: (text: number) => dayjs(text).format('YYYY-MM-DD'),
      fixed: 'left',
    },
    {
      title: '商品信息',
      dataIndex: 'commodities',
      render: (commodities: any) => {
        return (
          <Space
            align="center"
            style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 300 }}
          >
            {commodities?.map((item: any, idx: number) => (
              <Tag key={`${item.id}_${idx}`} color="blue">
                {item.name} *{item.num}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '所属部门',
      dataIndex: 'departmentName',
      render: (text: any) => text || '',
    },
    {
      title: '所属门店',
      dataIndex: 'shopName',
      render: (text: any) => text || '',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: any) =>
        text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (text: string) =>
        text ? (
          <Tooltip title={text}>
            <a>查看备注</a>
          </Tooltip>
        ) : (
          '-'
        ),
    },
  ];

  const onTableChange = (pagination: TablePaginationConfig) => {
    setPage({
      pageNumber: pagination.current!,
      pageSize: pagination.pageSize!,
    });
  };

  return (
    <PageContainer
      header={{
        extra: [
          <Button key="add" type="primary" onClick={() => setOpen(true)}>
            新增单据
          </Button>,
        ],
      }}
    >
      <Row gutter={[24, 8]} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <p>员工姓名:</p>
          <Input.Search
            placeholder="员工姓名"
            allowClear
            onSearch={(v) => setKeyword(v || undefined)}
          />
        </Col>
        <Col span={6}>
          <p>部门:</p>
          <DepartmentSelect
            style={{ width: 200 }}
            onChange={(code) => setDepartmentCode(code)}
          />
        </Col>
        <Col span={6}>
          <p>归属日期:</p>
          <DatePicker
            onChange={(e) => {
              setBelongDate(e ? dayjs(e).valueOf() : undefined);
            }}
          />
        </Col>
        <Col>
          <p>单据状态:</p>
          <Select
            options={statusOptions}
            style={{ width: 200 }}
            placeholder="请选择单据状态"
            value={status}
            onChange={(v) => {
              setPage(initPagination);
              setStatus(v);
            }}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={list}
        pagination={{
          current: pageNumber,
          pageSize,
          total: count,
          showTotal: (t) => `共 ${t} 条`,
          showSizeChanger: true,
          size: 'small',
        }}
        onChange={onTableChange}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />
      <PerformanceModal
        open={open}
        changeOpen={(v) => setOpen(v)}
        refresh={reload}
      />
    </PageContainer>
  );
};

export default PerformancePage;
