import { CommodityStatus } from '@/serves/commodity/types';

export const StatusMap = {
  [CommodityStatus.normal]: '正常',
  [CommodityStatus.preSale]: '预售',
  [CommodityStatus.soldOut]: '售罄',
  [CommodityStatus.remove]: '已下架',
};
