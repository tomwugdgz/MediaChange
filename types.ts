
export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED'
}

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  quantity: number;
  marketPrice: number; // The standard retail price
  costPrice: number;   // The effective cost in ad credits
  lowestPrice?: number; // The lowest price found online
  productUrl?: string; // Link to the product online
  status: InventoryStatus;
  description?: string;
  lastUpdated: string;
}

export interface MediaResource {
  id: string;
  name: string;
  type: string; // '户外媒体' | '数字媒体' etc.
  format: string; // '地铁媒体', '电梯广告'
  location: string;
  rate: string; // '¥15,000/周'
  discount: number; // 0.68 for 68%
  contractStart: string;
  contractEnd: string;
  status: 'active' | 'pending' | 'expiring' | 'expired';
  valuation?: number; // Keep for backward compatibility or calculation
  availableSlots?: number;
}

export interface SalesChannel {
  id: string;
  name: string;
  type: 'Online' | 'Offline' | 'Special';
  subType: string; // e.g., '批发为主', '零售为主'
  features: string; // '最大尾货批发平台...'
  applicableCategories: string; // '全品类'
  pros: string; // '覆盖面广...'
  commissionRate: number;
  contactPerson: string;
  status: 'active' | 'pending';
}

export interface AIAnalysisResult {
  recommendation: string;
  reasoning: string[];
  suggestedPriceRange?: {
    min: number;
    max: number;
  };
  riskScore?: number; // 0-100
}

export interface AppSettings {
  lowStockThreshold: number;
  outOfStockThreshold: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

export interface PricingPlan {
  id: string;
  inventoryId: string;
  inventoryName: string;
  inventoryCost: number;
  mediaId: string;
  mediaName: string;
  mediaCostStr: string;
  channelId: string;
  channelName: string;
  channelBid: number; // Suggested selling price
  roi: number;
  status: 'executed' | 'pending' | 'draft';
  lastUpdated: string;
}
