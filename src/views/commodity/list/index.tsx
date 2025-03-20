import React, { useEffect, useState } from 'react';
import {
  Table,
  TableColumnsType,
  Button,
  Modal,
  TablePaginationConfig,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import dayjs from 'dayjs';

import { getPageList } from '@/serves/commodity';
import { Page } from '@/serves/type';
import { Commodity, CommodityStatus } from '@/serves/commodity/types';
import { StatusMap } from '../const';
import { CommodityModal } from './components/modal';

const initPagination = {
  pageNumber: 1,
  pageSize: 10,
};

const CommodityListPage = () => {
  const [list, setList] = useState<Commodity[]>();
  const [page, setPage] = useState<Page>(initPagination);
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>();
  const [editCode, setEditCode] = useState<string>();
  const { pageNumber, pageSize } = page;

  const getList = async () => {
    const res = await getPageList({ pageNumber, pageSize });
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

  const columns: TableColumnsType<Commodity> = [
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '商品价格',
      dataIndex: 'price',
    },
    {
      title: '销售价格',
      dataIndex: 'sellPrice',
    },
    {
      title: '销售状态',
      dataIndex: 'status',
      render: (text: CommodityStatus) => StatusMap[text],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text) =>
        text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : null,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text) =>
        text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              setOpen(true);
              setEditCode(record.id);
            }}
            style={{ marginRight: 8 }}
          >
            编辑
          </a>
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
        <Button key="add" onClick={() => setOpen(true)} type="primary">
          新增商品
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
        rowKey="id"
      />
      <CommodityModal
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

export default CommodityListPage;
