import request from '@/helpers/fetch';

import { Page } from '../type';
import { IStaffPerformance } from './types';

export const fetchList = async (params: Page) => {
  return request.post<{
    list: IStaffPerformance[];
    count: number;
  }>('/backstage/staff-performance/list', params);
};

export const addStaffPerformance = async (
  params: Omit<
    IStaffPerformance,
    | 'departmentCode'
    | 'shopCode'
    | 'realPerformance'
    | 'createTime'
    | 'updateTime'
    | 'staffName'
  >,
) => {
  return request.post('/backstage/staff-performance/add', params);
};
