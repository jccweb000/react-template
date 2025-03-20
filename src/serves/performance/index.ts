import request from '../../helpers/fetch';

import { Performance, SearchParams, PerformanceAccount } from './types';
import { Page } from '../type';

export const addPerformance = async (params: Omit<Performance, 'id'>) => {
  return request.post('/backstage/performance/add', params);
};

export const fetchList = async (params: SearchParams) => {
  return request.post<{
    list: Performance[];
    count: number;
  }>('/backstage/performance/list', params);
};

export const fetchAccountedList = async (params: Page) => {
  return request.post<{ list: PerformanceAccount[]; count: number }>(
    '/backstage/departmentPerformance/list',
    params,
  );
};

export const download = async (id: string, filename: string) => {
  const res = await request.instance.post(
    `/backstage/departmentPerformance/export`,
    { id },
    {
      responseType: 'blob', // 指定响应类型为二进制数据
    },
  );

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.xlsx`); // 设置下载文件名
  document.body.appendChild(link);
  link.click(); // 触发下载

  // 清理 URL 对象
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

export const createAccounting = async (params: {
  dateRange: [number, number];
  name: string;
  departmentCode: string;
}) => {
  return request.post('/backstage/departmentPerformance/add', params);
};
