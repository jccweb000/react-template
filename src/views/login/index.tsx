import React, { useRef } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginFormPage,
  ProFormText,
  ProFormInstance,
} from '@ant-design/pro-components';
import { theme } from 'antd';

import { login } from '@/serves/user';

const Page = () => {
  const { token } = theme.useToken();
  const formRef = useRef<ProFormInstance>(null);

  const handleValue = async () => {
    const values = await formRef?.current?.validateFields();
    const res = await login(values);
    if (res) {
      window.localStorage.setItem('TOKEN', res.token);
      window.localStorage.setItem('username', res.username);
      const origin = location.origin;
      window.location.href = origin + '/org/shops';
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        logo="https://github.githubassets.com/favicons/favicon.png"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="伯爵娱乐"
        containerStyle={{
          backgroundColor: 'rgba(255, 255, 255,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        subTitle="小麦果汁"
        formRef={formRef}
        onFinish={handleValue}
      >
        <>
          <ProFormText
            name="account"
            fieldProps={{
              size: 'large',
              prefix: (
                <UserOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={'prefixIcon'}
                />
              ),
            }}
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: (
                <LockOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={'prefixIcon'}
                />
              ),
            }}
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </>
      </LoginFormPage>
    </div>
  );
};

export default Page;
