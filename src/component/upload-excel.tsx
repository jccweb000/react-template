import React from 'react';
import { Upload, Button, UploadProps, message } from 'antd';
import * as XLSX from 'xlsx';

export const UploadExcelBtn = () => {
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (!file) return false;
    const type = file.name.split('.').pop();
    if (type !== 'xlsx' && type !== 'xls') {
      message.error('请选择以 .xlsx 或 .xls 为后缀的文件！');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e?.target?.result as any);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log('json', json);
    };
    reader.readAsArrayBuffer(file);

    return false;
  };

  return (
    <Upload
      beforeUpload={beforeUpload}
      multiple={false}
      showUploadList={false}
      accept=".xlsx, .xls"
    >
      <Button>Upload</Button>
    </Upload>
  );
};
