export enum CommodityStatus {
  'normal' = 'normal',
  'soldOut' = 'soldOut',
  'preSale' = 'preSale',
  'remove' = 'remove',
}

export interface Commodity {
  id: string;
  name: string;
  price: number;
  sellPrice: number;
  createTime: number;
  updateTime?: number;
  status: 'normal' | 'soldOut' | 'preSale' | 'remove';
}
