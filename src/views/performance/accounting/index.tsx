import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  TableColumnsType,
  Table,
  TablePaginationConfig,
  Drawer,
  Button,
} from 'antd';
import dayjs from 'dayjs';
import { DownloadOutlined } from '@ant-design/icons';

import { fetchAccountedList, download } from '@/serves/performance';
import { Page } from '@/serves/type';
import {
  PerformanceAccount,
  StaffPerformance,
} from '@/serves/performance/types';
import { CreateAccountingModal } from './components/modal';

const initPagination = {
  pageNumber: 1,
  pageSize: 10,
};

const AccountingPage = () => {
  const [page, setPage] = useState<Page>(initPagination);
  const [list, setList] = useState<PerformanceAccount[]>();
  const [count, setCount] = useState<number>(0);
  const [detail, setDetail] = useState<PerformanceAccount>();
  const [open, setOpen] = useState<boolean>();

  const { pageNumber, pageSize } = page;

  const getList = async () => {
    const res = await fetchAccountedList({
      pageNumber,
      pageSize,
    });
    if (res) {
      const { list, count: total } = res;
      setList(list);
      setCount(total);
    }
  };

  useEffect(() => {
    getList();
  }, [pageNumber, pageSize]);

  const reload = () => {
    if (pageNumber === 1 && pageSize === 10) {
      getList();
    } else {
      setPage((r) => ({ ...r, pageNumber: 1, pageSize: 10 }));
    }
  };

  const columns: TableColumnsType<PerformanceAccount> = [
    {
      title: '单据名称',
      dataIndex: 'name',
      fixed: 'left',
      render: (text, record) => <a onClick={() => setDetail(record)}>{text}</a>,
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
    },
    {
      title: '核算范围',
      dataIndex: 'dateRange',
      render: (time: [string, string]) =>
        `${dayjs(time[0]).format('YYYY-MM-DD')} ~ ${dayjs(time[1]).format('YYYY-MM-DD')}`,
    },
    {
      title: '核算时间',
      dataIndex: 'createTime',
      render: (text: number) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const onTableChange = (pagination: TablePaginationConfig) => {
    setPage({
      pageNumber: pagination.current!,
      pageSize: pagination.pageSize!,
    });
  };

  const staffPerformanceColumns: TableColumnsType<StaffPerformance> = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '业绩（元）',
      dataIndex: 'totalAmount',
    },
  ];

  return (
    <PageContainer
      header={{
        extra: [
          <Button key="add" onClick={() => setOpen(true)}>
            新建部门核算
          </Button>,
        ],
      }}
    >
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
      <Drawer
        title={detail?.name}
        open={!!detail}
        onClose={() => setDetail(undefined)}
      >
        <Button
          icon={<DownloadOutlined />}
          onClick={() => download(detail!.id!, detail!.name!)}
        >
          导出报表
        </Button>
        <Table
          columns={staffPerformanceColumns}
          dataSource={detail?.staffPerformances}
          pagination={false}
          rowKey="id"
        />
      </Drawer>
      <CreateAccountingModal
        open={open}
        changeOpen={(v) => setOpen(v)}
        reload={reload}
      />
    </PageContainer>
  );
};

export default AccountingPage;
