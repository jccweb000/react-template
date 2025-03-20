import request from '../../helpers/fetch';

export const login = (params: { phoneNumber: string; password: string }) => {
  return request.post('/backstage/user/login', params, {
    fetchOptions: { noNeedAuth: true },
  });
};
