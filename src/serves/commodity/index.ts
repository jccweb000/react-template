import request from '../../helpers/fetch';

import { Page } from '../type';
import { Commodity } from './types';

export const getPageList = async (page: Page) => {
  return request.post<{ list: Commodity[]; count: number }>(
    '/backstage/commodity/list',
    { ...page },
  );
};

export const addCommodity = async (
  params: Omit<Commodity, 'id' | 'status' | 'createTime'>,
) => {
  return request.post('/backstage/commodity/add', params);
};

export const updateCommodity = async (params: Commodity) => {
  return request.post('/backstage/commodity/update', params);
};

export const fetchDetail = async (id: string) => {
  return request.get(`/backstage/commodity/${id}`);
};

export const fetchAllCommodity = async () => {
  return request.get<{ data: Commodity[] }>('/backstage/commodity');
};
