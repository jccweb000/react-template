import request from '../../helpers/fetch';

import { Page } from '../type';
import { IShop, Staff, Department } from './types';

/** =====================部门======================= */
export const fetchAllDepartment = async () => {
  return request.get<{ data: Department[] }>('/backstage/departments/all');
};

export const addDepartment = async (params: Omit<Department, 'code'>) => {
  return request.post('/backstage/departments/add', params);
};

export const deleteDepartmentByCode = async (code: string) => {
  return request.delete(`/backstage/departments/${code}`);
};

export const updateDepartment = async (params: Department) => {
  return request.post('/backstage/departments/update', params);
};

export const getDepartmentDetail = async (code: string) => {
  return request.get(`/backstage/departments/${code}`);
};

export const findDepartmentsByShopCode = async (shopCode: string) => {
  return request.get<{ data: Department[] }>(
    `/backstage/departments/findListByShopCode/${shopCode}`,
  );
};

/** ======================店铺======================== */
export const fetchShops = async (params: Page) => {
  return request.post<{ list: IShop[]; count: number }>(
    '/backstage/shops/list',
    params,
  );
};

export const addShop = async (params: Omit<IShop, 'shopCode'>) => {
  return request.post('/backstage/shops/add', params);
};

export const deleteShopByCode = async (code: string) => {
  return request.delete(`/backstage/shops/delete/${code}`);
};

export const getShopDetail = async (code: string) => {
  return request.get('/backstage/shops/detail', { code });
};

export const updateShop = async (params: IShop) => {
  return request.post('/backstage/shops/update', params);
};

export const fetchAllShop = async () => {
  return request.get<{ data: IShop[] }>('/backstage/shops');
};

export const getOrgTree = async () => {
  return request.get('/backstage/shops/tree');
};

/** ======================员工=========================== */
type FetchStaffListParams = Page & {
  shopCode?: string;
};
export const fetchStaffList = async (params: FetchStaffListParams) => {
  return request.post<{ list: Staff[]; count: number }>(
    '/backstage/staff/list',
    params,
  );
};

export const addStaff = async (
  params: Omit<Staff, 'userId' | 'createTime'>,
) => {
  return request.post('/backstage/staff/add', params);
};

export const updateStaff = async (params: Staff) => {
  return request.post('/backstage/staff/update', params);
};

export const getStaffDetail = async (userId: string) => {
  return request.get(`/backstage/staff/${userId}`);
};

export const deleteStaffByUserId = async (userId: string) => {
  return request.get(`/backstage/staff/delete/${userId}`);
};

export const exportStaff = async () => {
  const res = await request.instance.post(
    '/backstage/staff/export',
    undefined,
    {
      responseType: 'blob', // 指定响应类型为二进制数据
    },
  );

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'staff.xlsx'); // 设置下载文件名
  document.body.appendChild(link);
  link.click(); // 触发下载

  // 清理 URL 对象
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

export const fetchAllStaff = async () => {
  return request.get('/backstage/staff');
};
