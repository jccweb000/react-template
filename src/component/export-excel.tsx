import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from 'antd';

const data = [
  { name: '张三', age: 30, city: '北京' },
  { name: '李四', age: 24, city: '上海' },
  { name: '王五', age: 28, city: '广州' },
];

export const ExportExcelBtn = () => {
  // 将数据转换为Excel文件
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 自定义表头
    const header = [
      ['年龄', '姓名', '城市'], // 表头数组
    ];

    // 将自定义表头添加到工作表
    XLSX.utils.sheet_add_aoa(ws, header, { origin: 'A1' });

    // 生成Excel文件并下载
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // 创建一个临时的URL对象来触发下载
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '用户数据.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={exportToExcel} type="primary">
      export
    </Button>
  );
};
