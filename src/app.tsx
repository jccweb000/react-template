import React from 'react';
import { ConfigProvider, Modal } from 'antd';

import { ExportExcelBtn } from './component/export-excel';
import { UploadExcelBtn } from './component/upload-excel';

export const App = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#000',
            colorPrimaryHover: '#333',
            borderRadius: 10,
          },
        },
      }}
    >
      {/* <Modal title="test" open={true}>
        111
      </Modal> */}
      <UploadExcelBtn />
      {/* <ExportExcelBtn /> */}
    </ConfigProvider>
  );
};
