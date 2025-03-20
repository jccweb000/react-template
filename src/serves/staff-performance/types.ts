export interface IStaffPerformance {
  id: string;
  staffId: string;
  staffName: string;
  performance: number;
  commission: number;
  createTime: number;
  credit?: number;
  borrow?: number;
  realPerformance: number;
  remark?: string;
  updateTime?: number;
  belongTime: number;
  departmentCode: string;
  departmentName?: string;
  shopCode: string;
  shopName?: string;
}
