import React, { useEffect, useState } from 'react';
import { Table, TableColumnsType, Button, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import dayjs from 'dayjs';

import { fetchAllDepartment, deleteDepartmentByCode } from '@/serves/org';
import { Department } from '@/serves/org/types';
import { DepartmentModal } from './components/modal';

const DepartmentIndex = () => {
  const [list, setList] = useState<Department[]>();
  const [editCode, setEditCode] = useState<string>();
  const [open, setOpen] = useState<boolean>();

  const getDepartments = async () => {
    const res = await fetchAllDepartment();
    if (res) {
      setList(res.data);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const columns: TableColumnsType<Department> = [
    {
      title: '部门名称',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '部门code',
      dataIndex: 'code',
    },
    {
      title: '所属门店',
      dataIndex: 'shopName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '操作',
      dataIndex: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setOpen(true);
              setEditCode(record.code);
            }}
            style={{ marginRight: 8 }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              Modal.confirm({
                title: '删除提醒',
                content: '确认要删除该部门吗？',
                onOk: async () => {
                  const res = await deleteDepartmentByCode(record.code);
                  if (res) {
                    getDepartments();
                  }
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

  return (
    <PageContainer
      extra={[
        <Button
          key="add"
          onClick={() => {
            setOpen(true);
          }}
          type="primary"
        >
          新增部门
        </Button>,
      ]}
    >
      <Table
        pagination={false}
        dataSource={list}
        columns={columns}
        rowKey="code"
        scroll={{ x: 'max-content' }}
      />
      <DepartmentModal
        open={open}
        changeOpen={(v) => {
          setOpen(v);
          setEditCode(undefined);
        }}
        refresh={getDepartments}
        id={editCode}
      />
    </PageContainer>
  );
};

export default DepartmentIndex;
