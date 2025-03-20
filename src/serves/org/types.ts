export interface IShop {
  shopName: string;
  shopCode: string;
  address?: string;
  phoneNumber?: string;
  _id: string;
}

export interface Staff {
  name: string;
  age?: number;
  phoneNumber: string;
  id: string;
  shopCode: string;
  shopName?: string;
  departmentCode: string;
  departmentName?: string;
  createTime: number;
  remark?: string;
}

export interface Department {
  name: string;
  code: string;
  shopCode: string;
  shopName?: string;
  createTime: number;
}
