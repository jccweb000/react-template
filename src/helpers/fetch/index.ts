import axios from 'axios';
import { message } from 'antd';

const headers = { 'Content-Type': 'application/json' };
const MOCK_BASE_URL = '';

const instance = axios.create({ baseURL: MOCK_BASE_URL, headers });
const token = localStorage.getItem('TOKEN');

instance.interceptors.request.use((request) => {
  console.log('options', request.fetchOptions);
  if (request.fetchOptions?.noNeedAuth) return request;

  if (!token) {
    window.location.href = '/login';
    return request;
  }
  request.headers['Authorization'] = `Bearer ${token}`;
  return request;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (responseError) => {
    console.log('request error:', responseError);
    if ([401, 404, 403].includes(responseError.status)) {
      const origin = window.location.origin;
      window.localStorage.removeItem('TOKEN');
      window.location.href = origin + '/login';
    } else {
      throw responseError.response;
    }
  },
);

export const get = async <T = any>(
  url: string,
  params?: any,
  config?: Record<string, any>,
): Promise<T> => {
  try {
    const response = await instance.get<T>(MOCK_BASE_URL + url, {
      params,
      fetchOptions: config,
    });
    // TODO: 如何处理返回的接口数据需要根据具体的接口来定义，可提取成公共的处理方法
    return response.data;
  } catch (error) {
    message.error(JSON.stringify(error));
    throw error;
  }
};

export const post = async <T = any>(
  url: string,
  params?: any,
  config?: Record<string, any>,
): Promise<T> => {
  try {
    const res = await instance.post<T>(MOCK_BASE_URL + url, params, config);
    return res.data;
  } catch (error) {
    message.error(JSON.stringify(error));
    throw error;
  }
};

export const drop = async (
  url: string,
  params?: any,
  config?: Record<string, any>,
) => {
  try {
    const res = await instance.delete(MOCK_BASE_URL + url, config);
    return res.data;
  } catch (error) {
    message.error(JSON.stringify(error));
    throw error;
  }
};

export default {
  post,
  get,
  delete: drop,
  instance,
};
