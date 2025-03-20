import React, { useEffect, useState } from 'react';
import {
  TableColumnsType,
  Table,
  TablePaginationConfig,
  Button,
  Modal,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';

import { fetchStaffList, deleteStaffByUserId, exportStaff } from '@/serves/org';
import { Staff } from '@/serves/org/types';
import { Page } from '@/serves/type';
import { StaffModal } from './components/modal';

const initPagination = {
  pageNumber: 1,
  pageSize: 10,
};

const Staff = () => {
  const [list, setList] = useState<Staff[]>();
  const [page, setPage] = useState<Page>(initPagination);
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>();
  const [editCode, setEditCode] = useState<string>();

  const { pageNumber, pageSize } = page;

  const fetchList = async () => {
    const res = await fetchStaffList({ pageNumber, pageSize });
    if (res) {
      const { list, count: total } = res;
      setList(list);
      setCount(total);
    }
  };

  const reload = () => {
    if (pageNumber === 1) {
      fetchList();
    } else {
      setPage((r) => ({ ...r, pageNumber: 1 }));
    }
  };

  useEffect(() => {
    fetchList();
  }, [pageNumber, pageSize]);

  const onDelete = async (userId: string) => {
    const res = await deleteStaffByUserId(userId);
    if (res) {
      Modal.success({
        title: '删除成功',
        content: '删除成功',
      });
      reload();
    }
  };

  const columns: TableColumnsType<Staff> = [
    {
      title: '员工姓名',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '所属店铺',
      dataIndex: 'shopName',
      render: (text) => text || '-',
    },
    {
      title: '所属部门',
      dataIndex: 'departmentName',
      render: (text) => text || '-',
    },
    {
      title: '联系方式',
      dataIndex: 'phoneNumber',
    },
    {
      title: '员工id',
      dataIndex: 'id',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => {
        return (
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
                  title: '删除提醒',
                  content: '确认要删除该店铺吗？',
                  onOk: () => onDelete(record.id),
                });
              }}
            >
              删除
            </a>
          </>
        );
      },
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
          新增员工
        </Button>,
        <Button key="export" onClick={exportStaff}>
          导出
        </Button>,
      ]}
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
        rowKey="userId"
      />
      <StaffModal
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

export default Staff;
