import { Page } from '../type';

export interface Performance {
  id: string;
  staffId: string;
  staffName: string;
  shopCode: string;
  shopName?: string;
  departmentCode: string;
  departmentName?: string;
  commodities: { id: string; name: string; sellPrice: number; num: number }[];
  amount: number;
  belongDate: number;
  remark?: string;
  createTime: number;
  status: 'Accounted' | 'NotAccount' | 'Voided';
}

export interface SearchParams extends Page {
  keyword?: string;
  belongDate?: number;
  departmentCode?: string;
  status?: 'Accounted' | 'NotAccount' | 'Voided';
}

export interface StaffPerformance {
  id: string;
  name: string;
  totalAmount: number;
}

export interface PerformanceAccount {
  id: string;
  createTime: number;
  name: string;
  departmentCode: string;
  departmentName: string;
  dateRange: [number, number];
  staffPerformances: StaffPerformance[];
}
