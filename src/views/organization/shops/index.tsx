import React, { useEffect, useState } from 'react';
import {
  Table,
  TableColumnsType,
  TablePaginationConfig,
  Button,
  Modal,
  message,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';

import { fetchShops, deleteShopByCode } from '@/serves/org';
import { IShop } from '@/serves/org/types';
import { Page } from '@/serves/type';
import { ShopModal } from './components/modal';

const initPagination = {
  pageNumber: 1,
  pageSize: 10,
};

const ShopIndex = () => {
  const [list, setList] = useState<IShop[]>();
  const [page, setPage] = useState<Page>(initPagination);
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>();
  const [editCode, setEditCode] = useState<string>();

  const { pageNumber, pageSize } = page;

  const fetchList = async () => {
    const res = await fetchShops({ pageNumber, pageSize });
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

  const deleteShop = async (code: string) => {
    const res = await deleteShopByCode(code);
    if (res) {
      message.success('删除成功!');
      reload();
    }
  };

  useEffect(() => {
    fetchList();
  }, [pageNumber, pageSize]);

  const columns: TableColumnsType<IShop> = [
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      fixed: 'left',
    },
    {
      title: '店铺编码',
      dataIndex: 'shopCode',
    },
    {
      title: '地址',
      dataIndex: 'address',
      render: (text) => text || '-',
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNumber',
      render: (text) => text || '-',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                setOpen(true);
                setEditCode(record.shopCode);
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
                  onOk: () => deleteShop(record.shopCode),
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
        <Button key="add" type="primary" onClick={() => setOpen(true)}>
          新增店铺
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
        rowKey="shopCode"
        scroll={{ x: 'max-content' }}
      />
      <ShopModal
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

export default ShopIndex;
