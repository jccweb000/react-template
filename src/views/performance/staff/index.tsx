import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  TableColumnsType,
  Table,
  TablePaginationConfig,
  Button,
  Modal,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';

import { IStaffPerformance } from '@/serves/staff-performance/types';
import { fetchList } from '@/serves/staff-performance';
import { Page } from '@/serves/type';
import { StaffPerformanceModal } from './components/modal';

const initPagination = {
  pageNumber: 1,
  pageSize: 10,
};

const StaffPerformancePage = () => {
  const [list, setList] = useState<IStaffPerformance[]>();
  const [page, setPage] = useState<Page>(initPagination);
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>();
  const [editCode, setEditCode] = useState<string>();

  const { pageNumber, pageSize } = page;

  const getList = async () => {
    const res = await fetchList({ pageNumber, pageSize });
    if (res) {
      const { list, count: total } = res;
      setList(list);
      setCount(total);
    }
  };

  const reload = () => {
    if (pageNumber === 1) {
      getList();
    } else {
      setPage((r) => ({ ...r, pageNumber: 1 }));
    }
  };

  useEffect(() => {
    getList();
  }, [pageNumber, pageSize]);

  const columns: TableColumnsType<IStaffPerformance> = [
    {
      title: '员工姓名',
      dataIndex: 'staffName',
      fixed: 'left',
    },
    {
      title: '业绩总额',
      dataIndex: 'performance',
    },
    {
      title: '提成',
      dataIndex: 'commission',
    },
    {
      title: '挂帐',
      dataIndex: 'credit',
      render: (text) => text || 0,
    },
    {
      title: '借帐',
      dataIndex: 'borrow',
      render: (text) => text || 0,
    },
    {
      title: '实际应发',
      dataIndex: 'realPerformance',
    },
    {
      title: '所属部门',
      dataIndex: 'departmentName',
    },
    {
      title: '所属店铺',
      dataIndex: 'shopName',
    },
    {
      title: '归属日期',
      dataIndex: 'belongTime',
      render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text) =>
        text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text) =>
        text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            <a>备注</a>
          </Tooltip>
        ) : (
          '无'
        ),
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setOpen(true);
              setEditCode(record.id);
            }}
            style={{ marginRight: 8 }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              Modal.confirm({
                title: '删除',
                content: '确认删除吗？',
                onOk: async () => {
                  // await deleteStaffByUserId(record.userId);
                  reload();
                },
              });
            }}
          >
            删除
          </a>
        </>
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
      extra={[
        <Button type="primary" key="add" onClick={() => setOpen(true)}>
          新增单据
        </Button>,
      ]}
    >
      <Table
        columns={columns}
        dataSource={list}
        pagination={{
          total: count,
          current: pageNumber,
          pageSize,
        }}
        onChange={onTableChange}
        scroll={{ x: 'max-content' }}
      />
      <StaffPerformanceModal
        open={open}
        changeOpen={(v) => {
          setOpen(v);
          setEditCode(undefined);
        }}
        refresh={reload}
        id={editCode}
      />
    </PageContainer>
  );
};

export default StaffPerformancePage;
