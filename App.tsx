
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import StatCard from './components/StatCard';
import MediaModal from './components/MediaModal';
import ChannelModal from './components/ChannelModal';
import InventoryModal from './components/InventoryModal';
import { 
  Package, DollarSign, TrendingUp, Users, Plus, Edit2, Trash2, Search, 
  Filter, FileText, CheckCircle, AlertCircle, RefreshCw, BarChart3,
  Calculator, AlertTriangle, Tv, ShoppingCart, Settings, Save, MinusCircle, X,
  Monitor, Clock, Download, ChevronDown, MoreHorizontal, Globe, Store, Star, Link2,
  Smartphone, Home, BriefcaseMedical, Droplets, ExternalLink, TrendingDown,
  ArrowRight, Equal, Percent, Activity, Calendar, Database, Upload, ChevronLeft, ChevronRight,
  FileBarChart, PieChart as PieChartIcon, LineChart as LineChartIcon, RotateCcw, Award, Lightbulb
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
  LineChart, Line, AreaChart, Area, ComposedChart, ReferenceLine
} from 'recharts';
import { InventoryItem, InventoryStatus, AIAnalysisResult, MediaResource, SalesChannel, AppSettings, Notification, PricingPlan } from './types';
import { analyzePricing, assessRisk, runFinancialSimulation, FinancialSimulationResult, optimizePricingStrategy, PricingStrategyResult } from './services/geminiService';

// --- MOCK DATA ---
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: '讯飞X10语音文本', brand: '科大讯飞', category: '电子产品', quantity: 1085, marketPrice: 4999, lowestPrice: 4299, costPrice: 2000, productUrl: 'https://www.jd.com', status: InventoryStatus.IN_STOCK, lastUpdated: '2023-10-25' },
  { id: '2', name: '科大讯飞 (样品) X3', brand: '科大讯飞', category: '家用电器', quantity: 2788, marketPrice: 1973, lowestPrice: 1680, costPrice: 800, productUrl: '', status: InventoryStatus.IN_STOCK, lastUpdated: '2023-10-24' },
  { id: '3', name: '读书郎学习P6', brand: '读书郎', category: '电子产品', quantity: 1988, marketPrice: 600, lowestPrice: 499, costPrice: 250, productUrl: 'https://www.taobao.com', status: InventoryStatus.IN_STOCK, lastUpdated: '2023-10-26' },
  { id: '4', name: '中老年补钙高蛋白', brand: '诺崔特', category: '保健品', quantity: 526, marketPrice: 4894, lowestPrice: 3500, costPrice: 1200, productUrl: '', status: InventoryStatus.LOW_STOCK, lastUpdated: '2023-10-20' },
  { id: '5', name: '燕京至简苏打水 (渠道回收)', brand: '燕京', category: '食品饮料', quantity: 42, marketPrice: 18775, lowestPrice: 15000, costPrice: 8000, productUrl: '', status: InventoryStatus.OUT_OF_STOCK, lastUpdated: '2023-10-22' },
  // Generate more dummy data for pagination testing
  ...Array.from({ length: 25 }).map((_, i) => ({
    id: `dummy-${i}`,
    name: `测试商品 ${i + 6}`,
    brand: i % 2 === 0 ? '科大讯飞' : '读书郎',
    category: i % 3 === 0 ? '电子产品' : '食品饮料',
    quantity: (i + 1) * 50,
    marketPrice: 100 + i * 10,
    lowestPrice: 80 + i * 10,
    costPrice: 50 + i * 5,
    status: InventoryStatus.IN_STOCK,
    lastUpdated: '2023-10-01'
  }))
];

const INITIAL_MEDIA: MediaResource[] = [
  { 
    id: 'm1', 
    name: '德高中国 (JCDecaux)', 
    type: '户外媒体', 
    format: '地铁媒体',
    location: '全国主要城市地铁网络', 
    rate: '¥15,000/周',
    discount: 0.68,
    contractStart: '2023-05-01',
    contractEnd: '2025-04-30',
    status: 'active',
    valuation: 50000 
  },
  { 
    id: 'm2', 
    name: '分众传媒 (Focus Media)', 
    type: '户外媒体', 
    format: '电梯楼宇广告',
    location: '一线城市核心写字楼', 
    rate: '¥8,000/天',
    discount: 0.75,
    contractStart: '2023-01-01',
    contractEnd: '2024-12-31',
    status: 'active',
    valuation: 30000 
  },
  { 
    id: 'm3', 
    name: '腾讯视频 (Tencent Video)', 
    type: '数字媒体', 
    format: '前贴片广告',
    location: '全网投放', 
    rate: 'CPM ¥65',
    discount: 0.85,
    contractStart: '2023-06-15',
    contractEnd: '2023-12-31',
    status: 'expiring',
    valuation: 15000 
  },
  { 
    id: 'm4', 
    name: '新潮传媒', 
    type: '户外媒体', 
    format: '社区电梯屏',
    location: '主要二线城市社区', 
    rate: '¥5,000/周',
    discount: 0.60,
    contractStart: '2023-09-01',
    contractEnd: '2024-08-31',
    status: 'pending',
    valuation: 10000 
  },
  { 
    id: 'm5', 
    name: '亲邻科技', 
    type: '社区媒体', 
    format: '社区广告门',
    location: '全国主要城市社区', 
    rate: '¥9,000/周',
    discount: 0.85,
    contractStart: '2023-01-01',
    contractEnd: '2024-12-31',
    status: 'active',
    valuation: 12000 
  },
  { 
    id: 'm6', 
    name: '皓邻传媒', 
    type: '社区媒体', 
    format: '单元门智能框架',
    location: '全国高端社区', 
    rate: '¥1,180/周',
    discount: 0.80,
    contractStart: '2023-03-15',
    contractEnd: '2025-03-14',
    status: 'active',
    valuation: 8000 
  },
    // Generate dummy data
    ...Array.from({ length: 15 }).map((_, i) => ({
    id: `dummy-m-${i}`,
    name: `测试媒体资源 ${i + 7}`,
    type: '户外媒体',
    format: '大牌',
    location: '城市中心',
    rate: '¥10,000/周',
    discount: 0.8,
    contractStart: '2023-01-01',
    contractEnd: '2024-01-01',
    status: 'active' as const,
    valuation: 10000
  }))
];

const INITIAL_CHANNELS: SalesChannel[] = [
  { 
    id: 'c1', 
    name: '1688 (阿里巴巴)', 
    type: 'Online', 
    subType: '批发为主',
    features: '最大尾货批发平台，支持一件代发，覆盖全品类',
    applicableCategories: '全品类',
    pros: '覆盖面广，支持一件代发',
    status: 'active',
    commissionRate: 0.05, 
    contactPerson: 'Alice Wu' 
  },
  { 
    id: 'c2', 
    name: '淘宝/天猫', 
    type: 'Online', 
    subType: '零售为主',
    features: '适合打造低价爆款',
    applicableCategories: '服装鞋帽、家居用品、美妆护肤',
    pros: '流量大，用户基数大',
    status: 'active',
    commissionRate: 0.10, 
    contactPerson: 'Bob Chen' 
  },
  { 
    id: 'c3', 
    name: '拼多多', 
    type: 'Online', 
    subType: '零售为主',
    features: '"清仓特卖"板块适合走量，尤其适合1-10元低价尾货',
    applicableCategories: '低价尾货、日用百货',
    pros: '价格敏感用户多，适合走量',
    status: 'active',
    commissionRate: 0.08, 
    contactPerson: 'Charlie Zhang' 
  },
  { 
    id: 'c4', 
    name: '品牌官方/京东', 
    type: 'Online', 
    subType: '品牌官方',
    features: '常设尾货清仓专区，品质有保障',
    applicableCategories: '品牌商品、高价值商品',
    pros: '品质有保障，品牌形象好',
    status: 'pending',
    commissionRate: 0.12, 
    contactPerson: 'David Li' 
  },
    // Generate dummy data
    ...Array.from({ length: 12 }).map((_, i) => ({
    id: `dummy-c-${i}`,
    name: `分销渠道 ${i + 5}`,
    type: 'Offline' as const,
    subType: '实体店',
    features: '线下门店销售',
    applicableCategories: '全品类',
    pros: '体验好',
    status: 'active' as const,
    commissionRate: 0.15,
    contactPerson: `Manager ${i}`
  }))
];

const INITIAL_PRICING_PLANS: PricingPlan[] = [
  { id: 'PA-2023-001', inventoryId: '1', inventoryName: '智能手机 X10', inventoryCost: 2800, mediaId: 'm1', mediaName: '德高中国 (地铁广告)', mediaCostStr: '¥15,000/周', channelId: 'c1', channelName: '1688 (阿里巴巴)', channelBid: 3299, roi: 17.8, status: 'executed', lastUpdated: '2023-10-01' },
  { id: 'PA-2023-002', inventoryId: '2', inventoryName: '家居用品套装', inventoryCost: 950, mediaId: 'm2', mediaName: '分众传媒 (楼宇电视)', mediaCostStr: '¥8,500/周', channelId: 'c2', channelName: '淘宝/天猫', channelBid: 1299, roi: 36.7, status: 'executed', lastUpdated: '2023-10-02' },
  { id: 'PA-2023-003', inventoryId: '3', inventoryName: '运动服装系列', inventoryCost: 420, mediaId: 'm3', mediaName: '白马户外 (候车亭媒体)', mediaCostStr: '¥8,000/周', channelId: 'c3', channelName: '拼多多', channelBid: 599, roi: 42.6, status: 'pending', lastUpdated: '2023-10-05' },
  { id: 'PA-2023-004', inventoryId: '4', inventoryName: '厨房电器组合', inventoryCost: 1850, mediaId: 'm4', mediaName: '首都机场传媒', mediaCostStr: '¥25,000/周', channelId: 'c4', channelName: '抖音/快手直播', channelBid: 2499, roi: 35.1, status: 'draft', lastUpdated: '2023-10-10' },
  { id: 'PA-2023-005', inventoryId: '5', inventoryName: '美妆护肤礼盒', inventoryCost: 680, mediaId: 'm5', mediaName: '兆讯传媒 (高铁媒体)', mediaCostStr: '¥20,000/周', channelId: 'c5', channelName: '爱库存/好衣库', channelBid: 899, roi: 32.2, status: 'draft', lastUpdated: '2023-10-12' },
];

const DEFAULT_SETTINGS: AppSettings = {
  lowStockThreshold: 50,
  outOfStockThreshold: 0
};

// --- LOCAL STORAGE HELPERS ---
const STORAGE_KEYS = {
  INVENTORY: 'barterflow_inventory',
  MEDIA: 'barterflow_media',
  CHANNELS: 'barterflow_channels',
  SETTINGS: 'barterflow_settings',
  PLANS: 'barterflow_plans'
};

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage:`, error);
    return fallback;
  }
};

// --- TOAST COMPONENT ---
const ToastContainer = ({ notifications, removeToast }: { notifications: Notification[], removeToast: (id: string) => void }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
      {notifications.slice(0, 3).map((note) => (
        <div 
          key={note.id} 
          className={`
            pointer-events-auto transform transition-all duration-300 ease-in-out
            min-w-[320px] max-w-sm bg-white rounded-lg shadow-lg border-l-4 p-4 flex items-start
            ${note.type === 'error' ? 'border-red-500' : note.type === 'warning' ? 'border-amber-500' : 'border-indigo-500'}
          `}
        >
          <div className="flex-1">
            <h4 className={`text-sm font-bold ${note.type === 'error' ? 'text-red-600' : note.type === 'warning' ? 'text-amber-600' : 'text-indigo-600'}`}>
              {note.title}
            </h4>
            <p className="text-sm text-slate-600 mt-1">{note.message}</p>
          </div>
          <button onClick={() => removeToast(note.id)} className="text-slate-400 hover:text-slate-600 ml-2">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- PAGINATION COMPONENT ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, totalItems, startIndex, endIndex }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
      <span className="text-sm text-slate-500">
        显示 {startIndex + 1} 到 {Math.min(endIndex, totalItems)} 条，共 {totalItems} 条
      </span>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded border border-slate-300 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum = i + 1;
          if (totalPages > 5 && currentPage > 3) {
             pageNum = currentPage - 2 + i;
             if (pageNum > totalPages) pageNum = totalPages - (4 - i);
             if (pageNum < 1) pageNum = 1 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 border rounded text-sm font-medium transition-colors
                ${currentPage === pageNum 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded border border-slate-300 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};


// --- HELPER FOR CSV IMPORT ---
const parseCSV = (text: string): Record<string, string>[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    // Simple regex to handle comma splitting but respecting quotes
    const values: string[] = [];
    let inQuote = false;
    let val = '';
    for(let char of currentLine) {
        if(char === '"') {
            inQuote = !inQuote;
        } else if(char === ',' && !inQuote) {
            values.push(val.trim().replace(/^"|"$/g, ''));
            val = '';
        } else {
            val += char;
        }
    }
    values.push(val.trim().replace(/^"|"$/g, ''));

    if (values.length > 0) {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      result.push(obj);
    }
  }
  return result;
};


// --- APP COMPONENT ---

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialize state from LocalStorage with fallback to Mock Data
  const [inventory, setInventory] = useState<InventoryItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY)
  );
  const [media, setMedia] = useState<MediaResource[]>(() => 
    loadFromStorage(STORAGE_KEYS.MEDIA, INITIAL_MEDIA)
  );
  const [channels, setChannels] = useState<SalesChannel[]>(() => 
    loadFromStorage(STORAGE_KEYS.CHANNELS, INITIAL_CHANNELS)
  );
  const [settings, setSettings] = useState<AppSettings>(() => 
    loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(() => 
    loadFromStorage(STORAGE_KEYS.PLANS, INITIAL_PRICING_PLANS)
  );
  
  // New States for Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Selection State
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<string[]>([]);

  // State for Modals
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaResource | null>(null);

  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<SalesChannel | null>(null);

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<InventoryItem | null>(null);

  // --- FILTER STATES ---
  // Inventory Filters
  const [invFilter, setInvFilter] = useState({ name: '', category: '全部分类', status: '全部状态', brand: '全部品牌' });
  // Media Filters - REFINED
  const [medFilter, setMedFilter] = useState({ name: '', type: '全部类型', status: '全部状态', expiring: '不限' });
  // Channel Filters - REFINED
  const [chnFilter, setChnFilter] = useState({ name: '', type: '全部类型', status: '全部状态', commission: '全部比例' });
  
  // Dashboard Metrics
  const totalValue = inventory.reduce((acc, item) => acc + (item.marketPrice * item.quantity), 0);
  const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockCount = inventory.filter(i => i.status === InventoryStatus.LOW_STOCK).length;

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(pricingPlans));
  }, [pricingPlans]);

  // Notification Logic
  const addNotification = (title: string, message: string, type: 'info' | 'warning' | 'error' | 'success') => {
    const newNote: Notification = {
      id: Date.now().toString() + Math.random().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const removeToast = (id: string) => {
    markAsRead(id);
  };

  // --- EXPORT FUNCTIONALITY ---
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) {
      addNotification("导出失败", "没有数据可导出", "warning");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(fieldName => {
        const val = row[fieldName] !== undefined && row[fieldName] !== null ? row[fieldName] : '';
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addNotification("导出成功", `数据已成功导出为 ${filename}`, "success");
    }
  };

  const handleExportInventory = () => {
    const data = getFilteredInventory().map(item => ({
      '商品ID': item.id,
      '商品名称': item.name,
      '品牌': item.brand,
      '分类': item.category,
      '库存数量': item.quantity,
      '市场单价': item.marketPrice,
      '最低价': item.lowestPrice || '',
      '成本价': item.costPrice,
      '状态': item.status,
      '产品链接': item.productUrl || '',
      '最后更新': item.lastUpdated
    }));
    exportToCSV(data, '库存清单.csv');
  };

  const handleExportMedia = () => {
    const data = getFilteredMedia().map(item => ({
      '媒体ID': item.id,
      '媒体名称': item.name,
      '类型': item.type,
      '广告形式': item.format,
      '覆盖范围': item.location,
      '刊例价格': item.rate,
      '折扣': item.discount,
      '合同开始': item.contractStart,
      '合同结束': item.contractEnd,
      '状态': item.status
    }));
    exportToCSV(data, '媒体资源表.csv');
  };

  const handleExportChannels = () => {
    const data = getFilteredChannels().map(item => ({
      '渠道ID': item.id,
      '渠道名称': item.name,
      '类型': item.type,
      '子类型': item.subType,
      '适用品类': item.applicableCategories,
      '特点': item.features,
      '优势': item.pros,
      '佣金比例': item.commissionRate,
      '联系人': item.contactPerson,
      '状态': item.status
    }));
    exportToCSV(data, '销售渠道表.csv');
  };

  const evaluateStatus = (quantity: number, currentSettings: AppSettings): InventoryStatus => {
    if (quantity <= currentSettings.outOfStockThreshold) return InventoryStatus.OUT_OF_STOCK;
    if (quantity <= currentSettings.lowStockThreshold) return InventoryStatus.LOW_STOCK;
    return InventoryStatus.IN_STOCK;
  };

  const applySettings = (newSettings: AppSettings) => {
    setInventory(prev => prev.map(item => {
      const newStatus = evaluateStatus(item.quantity, newSettings);
      return { ...item, status: newStatus };
    }));
    setSettings(newSettings);
    addNotification("系统设置已更新", "新的库存预警阈值已应用。", "success");
  };

  // Inventory Handlers
  const openAddInventoryModal = () => {
    setEditingInventory(null);
    setIsInventoryModalOpen(true);
  };

  const openEditInventoryModal = (item: InventoryItem) => {
    setEditingInventory(item);
    setIsInventoryModalOpen(true);
  };

  const handleSaveInventory = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'> & { id?: string }) => {
    if (editingInventory) {
      setInventory(prev => prev.map(item => item.id === editingInventory.id ? { 
        ...item, 
        ...itemData, 
        lastUpdated: new Date().toISOString().split('T')[0],
        status: evaluateStatus(itemData.quantity, settings) 
      } : item));
      addNotification("商品更新", `商品 "${itemData.name}" 信息已更新。`, "success");
    } else {
      const newItem: InventoryItem = {
        ...itemData,
        id: `i${Date.now()}`,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: evaluateStatus(itemData.quantity, settings)
      };
      setInventory(prev => [newItem, ...prev]);
      addNotification("商品添加", `新商品 "${itemData.name}" 已成功添加。`, "success");
    }
    setIsInventoryModalOpen(false);
    setEditingInventory(null);
  };

  const handleDeleteInventory = (id: string, name: string) => {
    if (window.confirm(`确定要删除商品 "${name}" 吗？此操作无法撤销。`)) {
      setInventory(prev => prev.filter(item => item.id !== id));
      setSelectedInventoryIds(prev => prev.filter(i => i !== id));
      addNotification("商品删除", `商品 "${name}" 已被删除。`, "info");
    }
  };


  // Media Handlers
  const openAddMediaModal = () => {
    setEditingMedia(null);
    setIsMediaModalOpen(true);
  };

  const openEditMediaModal = (item: MediaResource) => {
    setEditingMedia(item);
    setIsMediaModalOpen(true);
  };

  const handleSaveMedia = (mediaData: Omit<MediaResource, 'id'> & { id?: string }) => {
    if (editingMedia) {
      setMedia(prev => prev.map(item => item.id === editingMedia.id ? { ...mediaData, id: item.id } : item));
      addNotification("媒体更新", `媒体 "${mediaData.name}" 信息已更新。`, "success");
    } else {
      const newMedia: MediaResource = {
        ...mediaData,
        id: `m${Date.now()}`
      };
      setMedia(prev => [newMedia, ...prev]);
      addNotification("媒体添加", `新媒体 "${mediaData.name}" 已成功添加。`, "success");
    }
    setIsMediaModalOpen(false);
    setEditingMedia(null);
  };

  const handleDeleteMedia = (id: string, name: string) => {
    if (window.confirm(`确定要删除媒体 "${name}" 吗？此操作无法撤销。`)) {
      setMedia(prev => prev.filter(item => item.id !== id));
      addNotification("媒体删除", `媒体 "${name}" 已被删除。`, "info");
    }
  };

  // Channel Handlers
  const openAddChannelModal = () => {
    setEditingChannel(null);
    setIsChannelModalOpen(true);
  };

  const openEditChannelModal = (item: SalesChannel) => {
    setEditingChannel(item);
    setIsChannelModalOpen(true);
  };

  const handleSaveChannel = (channelData: Omit<SalesChannel, 'id'> & { id?: string }) => {
    if (editingChannel) {
      setChannels(prev => prev.map(item => item.id === editingChannel.id ? { ...channelData, id: item.id } : item));
      addNotification("渠道更新", `渠道 "${channelData.name}" 信息已更新。`, "success");
    } else {
      const newChannel: SalesChannel = {
        ...channelData,
        id: `c${Date.now()}`
      };
      setChannels(prev => [newChannel, ...prev]);
      addNotification("渠道添加", `新渠道 "${channelData.name}" 已成功添加。`, "success");
    }
    setIsChannelModalOpen(false);
    setEditingChannel(null);
  };

  const handleDeleteChannel = (id: string, name: string) => {
    if (window.confirm(`确定要删除渠道 "${name}" 吗？`)) {
      setChannels(prev => prev.filter(item => item.id !== id));
      addNotification("渠道删除", `渠道 "${name}" 已被删除。`, "info");
    }
  };

  // --- FILTERING LOGIC ---
  const getFilteredInventory = () => {
    return inventory.filter(item => {
      const matchName = item.name.toLowerCase().includes(invFilter.name.toLowerCase());
      const matchCategory = invFilter.category === '全部分类' || item.category === invFilter.category;
      const matchBrand = invFilter.brand === '全部品牌' || item.brand === invFilter.brand;
      
      let matchStatus = true;
      if (invFilter.status !== '全部状态') {
        if (invFilter.status === '库存充足') matchStatus = item.status === InventoryStatus.IN_STOCK;
        else if (invFilter.status === '库存预警') matchStatus = item.status === InventoryStatus.LOW_STOCK;
        else if (invFilter.status === '缺货') matchStatus = item.status === InventoryStatus.OUT_OF_STOCK;
        else if (invFilter.status === '已下架') matchStatus = item.status === InventoryStatus.DISCONTINUED;
      }
      return matchName && matchCategory && matchBrand && matchStatus;
    });
  };

  const getFilteredMedia = () => {
    return media.filter(item => {
      const matchName = item.name.toLowerCase().includes(medFilter.name.toLowerCase());
      const matchType = medFilter.type === '全部类型' || item.type === medFilter.type;
      
      let matchStatus = true;
      if (medFilter.status !== '全部状态') {
         if (medFilter.status === '活跃') matchStatus = item.status === 'active';
         else if (medFilter.status === '待审核') matchStatus = item.status === 'pending';
         else if (medFilter.status === '即将到期') matchStatus = item.status === 'expiring';
         else if (medFilter.status === '已过期') matchStatus = item.status === 'expired';
      }

      let matchExpiring = true;
      if (medFilter.expiring !== '不限') {
        const today = new Date();
        const end = new Date(item.contractEnd);
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (medFilter.expiring === '30天内') matchExpiring = diffDays <= 30 && diffDays >= 0;
        else if (medFilter.expiring === '90天内') matchExpiring = diffDays <= 90 && diffDays >= 0;
        else if (medFilter.expiring === '半年内') matchExpiring = diffDays <= 180 && diffDays >= 0;
      }

      return matchName && matchType && matchStatus && matchExpiring;
    });
  };

  const getFilteredChannels = () => {
    return channels.filter(item => {
      const matchName = item.name.toLowerCase().includes(chnFilter.name.toLowerCase());
      
      let matchType = true;
      if (chnFilter.type !== '全部类型') {
        if (chnFilter.type === '线上渠道') matchType = item.type === 'Online';
        else if (chnFilter.type === '线下渠道') matchType = item.type === 'Offline';
        else if (chnFilter.type === '特殊渠道') matchType = item.type === 'Special';
      }

      let matchStatus = true;
      if (chnFilter.status !== '全部状态') {
        if (chnFilter.status === '活跃') matchStatus = item.status === 'active';
        else if (chnFilter.status === '待接入') matchStatus = item.status === 'pending';
      }

      let matchCommission = true;
      if (chnFilter.commission !== '全部比例') {
          const rate = item.commissionRate;
          if (chnFilter.commission === '低 (5%以下)') matchCommission = rate < 0.05;
          else if (chnFilter.commission === '中 (5%-15%)') matchCommission = rate >= 0.05 && rate <= 0.15;
          else if (chnFilter.commission === '高 (15%以上)') matchCommission = rate > 0.15;
      }

      return matchName && matchType && matchStatus && matchCommission;
    });
  };

  // --- SUB-PAGES COMPONENTS ---

  const DashboardPage = () => {
    const data = inventory.map(item => ({
      name: item.name.substring(0, 10) + '...',
      value: item.marketPrice * item.quantity,
    }));

    const statusData = [
      { name: 'In Stock', value: inventory.filter(i => i.status === InventoryStatus.IN_STOCK).length, color: '#10b981' },
      { name: 'Low Stock', value: inventory.filter(i => i.status === InventoryStatus.LOW_STOCK).length, color: '#f59e0b' },
      { name: 'Out of Stock', value: inventory.filter(i => i.status === InventoryStatus.OUT_OF_STOCK).length, color: '#ef4444' },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="总库存价值 (市场价)" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} trend="12% vs last month" trendUp={true} />
          <StatCard title="库存商品总数" value={totalItems.toLocaleString()} icon={Package} />
          <StatCard title="库存预警商品" value={lowStockCount} icon={AlertCircle} trend="Requires Attention" trendUp={false} colorClass={lowStockCount > 0 ? "bg-amber-50 border-amber-200" : "bg-white"} />
          <StatCard title="活跃销售渠道" value={channels.length} icon={Users} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">库存价值分布</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Value']} cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4">库存状态概览</h3>
             <div className="h-64 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={statusData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center space-x-4 mt-2">
                {statusData.map(item => (
                  <div key={item.name} className="flex items-center text-sm text-slate-600">
                    <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: item.color}}></span>
                    {item.name} ({item.value})
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  };

  const InventoryPage = () => {
     const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => { setCurrentPage(1); }, [invFilter]);

    const getIcon = (category: string) => {
      switch(category) {
        case '电子产品': return Smartphone;
        case '家用电器': return Home;
        case '保健品': return BriefcaseMedical;
        case '食品饮料': return Droplets;
        default: return Package;
      }
    };
    
    const totalCount = inventory.length;
    const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * item.marketPrice), 0);
    const lowStockCount = inventory.filter(item => item.status === InventoryStatus.LOW_STOCK).length;
    const outStockCount = inventory.filter(item => 
      item.status === InventoryStatus.OUT_OF_STOCK || item.status === InventoryStatus.DISCONTINUED
    ).length;

    const formatValue = (val: number) => {
      if (val > 1000000) return `¥${(val / 1000000).toFixed(2)}M`;
      if (val > 1000) return `¥${(val / 1000).toFixed(0)}k`;
      return `¥${val}`;
    };
    
    const filteredList = getFilteredInventory();
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredList.slice(startIndex, endIndex);

    const toggleInventorySelection = (id: string) => {
      setSelectedInventoryIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    };

    const toggleSelectAllInventory = () => {
      const currentIds = currentData.map(i => i.id);
      const allSelected = currentIds.every(id => selectedInventoryIds.includes(id));
      
      if (allSelected) {
        setSelectedInventoryIds(prev => prev.filter(id => !currentIds.includes(id)));
      } else {
        const newIds = [...new Set([...selectedInventoryIds, ...currentIds])];
        setSelectedInventoryIds(newIds);
      }
    };

    const handleBatchDeleteInventory = () => {
       if (selectedInventoryIds.length === 0) return;
       if (window.confirm(`确定要删除选中的 ${selectedInventoryIds.length} 个商品吗？此操作无法撤销。`)) {
          setInventory(prev => prev.filter(item => !selectedInventoryIds.includes(item.id)));
          setSelectedInventoryIds([]);
          addNotification("批量删除", `已成功删除 ${selectedInventoryIds.length} 个商品。`, "success");
       }
    };

    const handleImportInventory = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const rows = parseCSV(text);
          if (rows.length === 0) throw new Error("File is empty or invalid format");

          const newItems: InventoryItem[] = rows.map((row, index) => ({
             id: row['商品ID'] || `import-${Date.now()}-${index}`,
             name: row['商品名称'] || '未命名商品',
             brand: row['品牌'] || 'Unknown',
             category: row['分类'] || '其他',
             quantity: parseInt(row['库存数量']) || 0,
             marketPrice: parseFloat(row['市场单价']) || 0,
             lowestPrice: parseFloat(row['最低价']) || 0,
             costPrice: parseFloat(row['成本价']) || 0,
             productUrl: row['产品链接'] || '',
             status: (row['状态'] as InventoryStatus) || InventoryStatus.IN_STOCK,
             lastUpdated: row['最后更新'] || new Date().toISOString().split('T')[0],
             description: ''
          }));

          const merged = [...inventory];
          newItems.forEach(newItem => {
             const idx = merged.findIndex(i => i.id === newItem.id);
             if (idx >= 0) merged[idx] = newItem;
             else merged.unshift(newItem);
          });

          setInventory(merged);
          addNotification("导入成功", `成功导入/更新了 ${newItems.length} 条商品数据`, "success");
        } catch (error) {
           console.error(error);
           addNotification("导入失败", "文件解析错误，请确保使用正确的CSV格式", "error");
        }
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">库存管理</h2>
          <div className="flex space-x-3">
             {selectedInventoryIds.length > 0 && (
                <button 
                  onClick={handleBatchDeleteInventory}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm animate-fade-in"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> 批量删除 ({selectedInventoryIds.length})
                </button>
             )}

            <button 
              onClick={openAddInventoryModal}
              className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" /> 添加库存
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              <Filter className="h-4 w-4 mr-2" /> 筛选
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{display: 'none'}} 
              accept=".csv" 
              onChange={handleImportInventory} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" /> 导入
            </button>

            <button 
              onClick={handleExportInventory}
              className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> 导出
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="总商品数" value={totalCount.toLocaleString()} icon={Package} trend="Live Data" trendUp={true} iconBgClass="bg-blue-100" iconColorClass="text-blue-600" />
          <StatCard title="库存总值" value={formatValue(totalInventoryValue)} icon={DollarSign} trend="Live Data" trendUp={true} iconBgClass="bg-green-100" iconColorClass="text-green-600" />
          <StatCard title="库存预警" value={lowStockCount} icon={Clock} trend="需要关注" trendUp={false} iconBgClass="bg-amber-100" iconColorClass="text-amber-600" />
          <StatCard title="缺货/下架" value={outStockCount} icon={AlertTriangle} trend="补货建议" trendUp={false} iconBgClass="bg-red-100" iconColorClass="text-red-600" />
        </div>

        {showFilters && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 animate-fade-in-down">
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium ml-1">商品名称</label>
                    <div className="relative">
                        <input 
                          type="text" 
                          value={invFilter.name}
                          onChange={(e) => setInvFilter({...invFilter, name: e.target.value})}
                          placeholder="搜索商品..." 
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium ml-1">商品分类</label>
                    <div className="relative">
                      <select 
                        value={invFilter.category}
                        onChange={(e) => setInvFilter({...invFilter, category: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all"
                      >
                        <option>全部分类</option>
                        <option>电子产品</option>
                        <option>家用电器</option>
                        <option>食品饮料</option>
                        <option>保健品</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium ml-1">库存状态</label>
                    <div className="relative">
                      <select 
                        value={invFilter.status}
                        onChange={(e) => setInvFilter({...invFilter, status: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all"
                      >
                        <option>全部状态</option>
                        <option>库存充足</option>
                        <option>库存预警</option>
                        <option>缺货</option>
                        <option>已下架</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium ml-1">品牌</label>
                    <div className="relative">
                      <select 
                        value={invFilter.brand}
                        onChange={(e) => setInvFilter({...invFilter, brand: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all"
                      >
                        <option>全部品牌</option>
                        <option>科大讯飞</option>
                        <option>读书郎</option>
                        <option>诺崔特</option>
                        <option>燕京</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-50">
                  <button 
                    onClick={() => setInvFilter({ name: '', category: '全部分类', status: '全部状态', brand: '全部品牌' })}
                    className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" /> 重置筛选
                  </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer" 
                      checked={currentData.length > 0 && currentData.every(i => selectedInventoryIds.includes(i.id))}
                      onChange={toggleSelectAllInventory}
                    />
                  </th>
                  <th className="px-6 py-4 font-medium">商品图片</th>
                  <th className="px-6 py-4 font-medium">商品名称</th>
                  <th className="px-6 py-4 font-medium">分类</th>
                  <th className="px-6 py-4 font-medium">品牌</th>
                  <th className="px-6 py-4 font-medium">数量</th>
                  <th className="px-6 py-4 font-medium">单价</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center">
                        <Search className="h-10 w-10 mb-2 opacity-20" />
                        <p>未找到符合条件的商品</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((item) => {
                     const CategoryIcon = getIcon(item.category);
                     return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="px-6 py-4">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer" 
                                checked={selectedInventoryIds.includes(item.id)}
                                onChange={() => toggleInventorySelection(item.id)}
                              />
                           </td>
                           <td className="px-6 py-4">
                              <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                                 <CategoryIcon size={20} />
                              </div>
                           </td>
                           <td className="px-6 py-4 font-medium text-slate-900">
                              <div className="flex flex-col">
                                 <span>{item.name}</span>
                                 {item.productUrl && (
                                    <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center mt-0.5">
                                       <Link2 size={10} className="mr-0.5" /> 链接
                                    </a>
                                 )}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-slate-500">{item.category}</td>
                           <td className="px-6 py-4 text-slate-500">{item.brand}</td>
                           <td className="px-6 py-4 font-medium">{item.quantity}</td>
                           <td className="px-6 py-4">
                              <div className="flex flex-col">
                                 <span className="font-medium text-slate-900">¥{item.marketPrice}</span>
                                 {item.lowestPrice && <span className="text-xs text-indigo-600">低: ¥{item.lowestPrice}</span>}
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                 ${item.status === InventoryStatus.IN_STOCK ? 'bg-green-100 text-green-800' : 
                                   item.status === InventoryStatus.LOW_STOCK ? 'bg-amber-100 text-amber-800' : 
                                   'bg-red-100 text-red-800'}`}>
                                 {item.status === InventoryStatus.IN_STOCK ? '充足' : 
                                  item.status === InventoryStatus.LOW_STOCK ? '预警' : 
                                  item.status === InventoryStatus.OUT_OF_STOCK ? '缺货' : '下架'}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex space-x-3">
                                 <button onClick={() => openEditInventoryModal(item)} className="text-indigo-600 hover:text-indigo-900 flex items-center">
                                    <Edit2 size={16} className="mr-1" /> 编辑
                                 </button>
                                 <button onClick={() => handleDeleteInventory(item.id, item.name)} className="text-red-600 hover:text-red-900 flex items-center">
                                    <Trash2 size={16} className="mr-1" /> 删除
                                 </button>
                              </div>
                           </td>
                        </tr>
                     );
                  })
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={setCurrentPage}
             totalItems={filteredList.length}
             startIndex={startIndex}
             endIndex={endIndex}
          />
        </div>
      </div>
    );
  };
  
  const MediaPage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [medFilter, setMedFilter] = useState({ name: '', type: '全部类型', status: '全部状态', expiring: '不限' });
    const itemsPerPage = 10;

    useEffect(() => { setCurrentPage(1); }, [medFilter]);

    const filteredList = getFilteredMedia();
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredList.slice(startIndex, endIndex);

    const handleImportMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const rows = parseCSV(text);
                if(rows.length === 0) throw new Error("Empty CSV");
                const newItems: MediaResource[] = rows.map((row, idx) => ({
                    id: row['媒体ID'] || `import-m-${Date.now()}-${idx}`,
                    name: row['媒体名称'] || 'Unknown Media',
                    type: row['类型'] || '户外媒体',
                    format: row['广告形式'] || '',
                    location: row['覆盖范围'] || '',
                    rate: row['刊例价格'] || '',
                    discount: parseFloat(row['折扣']) || 0.8,
                    contractStart: row['合同开始'] || new Date().toISOString().split('T')[0],
                    contractEnd: row['合同结束'] || new Date().toISOString().split('T')[0],
                    status: (row['状态'] as any) || 'active',
                    valuation: 0
                }));
                const merged = [...media];
                newItems.forEach(newItem => {
                    const existingIdx = merged.findIndex(m => m.id === newItem.id);
                    if(existingIdx >= 0) merged[existingIdx] = newItem;
                    else merged.unshift(newItem);
                });
                setMedia(merged);
                addNotification("导入成功", `成功导入 ${newItems.length} 条媒体数据`, "success");
            } catch(e) {
                console.error(e);
                addNotification("导入失败", "文件格式错误", "error");
            }
        };
        reader.readAsText(file);
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">媒体资源库</h2>
          <div className="flex space-x-3">
            <button onClick={openAddMediaModal} className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm">
              <Plus className="h-4 w-4 mr-2" /> 新增媒体
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              <Filter className="h-4 w-4 mr-2" /> 筛选
            </button>
            <input type="file" ref={fileInputRef} style={{display:'none'}} accept=".csv" onChange={handleImportMedia} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
               <Upload className="h-4 w-4 mr-2" /> 导入
            </button>
            <button onClick={handleExportMedia} className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
               <Download className="h-4 w-4 mr-2" /> 导出
            </button>
          </div>
        </div>

        {showFilters && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 animate-fade-in-down">
                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 font-medium ml-1">媒体名称</label>
                        <div className="relative">
                          <input 
                              type="text" value={medFilter.name} onChange={(e) => setMedFilter({...medFilter, name: e.target.value})}
                              placeholder="搜索媒体..." className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                          />
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 font-medium ml-1">媒体类型</label>
                        <div className="relative">
                          <select value={medFilter.type} onChange={(e) => setMedFilter({...medFilter, type: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all">
                              <option>全部类型</option>
                              <option>户外媒体</option>
                              <option>数字媒体</option>
                              <option>电视媒体</option>
                              <option>平面媒体</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 font-medium ml-1">状态</label>
                        <div className="relative">
                          <select value={medFilter.status} onChange={(e) => setMedFilter({...medFilter, status: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all">
                              <option>全部状态</option>
                              <option>活跃</option>
                              <option>待审核</option>
                              <option>即将到期</option>
                              <option>已过期</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 font-medium ml-1 flex items-center"><Clock size={10} className="mr-1"/>即将到期</label>
                        <div className="relative">
                          <select value={medFilter.expiring} onChange={(e) => setMedFilter({...medFilter, expiring: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all">
                              <option>不限</option>
                              <option>30天内</option>
                              <option>90天内</option>
                              <option>半年内</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-slate-50">
                        <button onClick={() => setMedFilter({name:'', type:'全部类型', status:'全部状态', expiring:'不限'})} className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                          <RotateCcw className="h-3 w-3 mr-1" /> 重置筛选
                        </button>
                  </div>
                </div>
            </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">媒体名称</th>
                  <th className="px-6 py-4 font-medium">类型</th>
                  <th className="px-6 py-4 font-medium">广告形式</th>
                  <th className="px-6 py-4 font-medium">价格/折扣</th>
                  <th className="px-6 py-4 font-medium">合同期</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.length === 0 ? (
                   <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">无数据</td></tr>
                ) : (
                    currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                        <td className="px-6 py-4 text-slate-500">{item.type}</td>
                        <td className="px-6 py-4 text-slate-500">{item.format}</td>
                        <td className="px-6 py-4 text-slate-500">{item.rate} <span className="text-xs text-green-600">({Math.round(item.discount * 100)}%)</span></td>
                        <td className="px-6 py-4 text-slate-500">{item.contractEnd}</td>
                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${item.status === 'active' ? 'bg-green-100 text-green-800' : 
                            item.status === 'expiring' ? 'bg-amber-100 text-amber-800' : 
                            item.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-800'}`}>
                            {item.status === 'active' ? '活跃' : item.status === 'expiring' ? '即将到期' : item.status === 'pending' ? '待审核' : '已过期'}
                        </span>
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex space-x-3">
                            <button onClick={() => openEditMediaModal(item)} className="text-indigo-600 hover:text-indigo-900 flex items-center"><Edit2 size={16} className="mr-1"/> 编辑</button>
                            <button onClick={() => handleDeleteMedia(item.id, item.name)} className="text-red-600 hover:text-red-900 flex items-center"><Trash2 size={16} className="mr-1"/> 删除</button>
                        </div>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
             currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}
             totalItems={filteredList.length} startIndex={startIndex} endIndex={endIndex}
          />
        </div>
      </div>
    );
  };

  const ChannelsPage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [chnFilter, setChnFilter] = useState({ name: '', type: '全部类型', status: '全部状态', commission: '全部比例' });
    const itemsPerPage = 10;
    
    useEffect(() => { setCurrentPage(1); }, [chnFilter]);

    const filteredList = getFilteredChannels();
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredList.slice(startIndex, endIndex);

    const handleImportChannels = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
             const text = e.target?.result as string;
             try {
                 const rows = parseCSV(text);
                 const newItems: SalesChannel[] = rows.map((row, idx) => ({
                    id: row['渠道ID'] || `import-c-${Date.now()}-${idx}`,
                    name: row['渠道名称'] || 'Unknown Channel',
                    type: (row['类型'] as any) || 'Online',
                    subType: row['子类型'] || '',
                    features: row['特点'] || '',
                    applicableCategories: row['适用品类'] || '全品类',
                    pros: row['优势'] || '',
                    commissionRate: parseFloat(row['佣金比例']) || 0.1,
                    contactPerson: row['联系人'] || '',
                    status: (row['状态'] as any) || 'active'
                 }));
                 const merged = [...channels];
                 newItems.forEach(newItem => {
                     const idx = merged.findIndex(c => c.id === newItem.id);
                     if(idx >= 0) merged[idx] = newItem;
                     else merged.unshift(newItem);
                 });
                 setChannels(merged);
                 addNotification("导入成功", `成功导入 ${newItems.length} 条渠道数据`, "success");
             } catch(e) {
                 console.error(e);
                 addNotification("导入失败", "CSV格式错误", "error");
             }
        };
        reader.readAsText(file);
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">销售渠道管理</h2>
          <div className="flex space-x-3">
            <button onClick={openAddChannelModal} className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm">
              <Plus className="h-4 w-4 mr-2" /> 新增渠道
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              <Filter className="h-4 w-4 mr-2" /> 筛选
            </button>
            <input type="file" ref={fileInputRef} style={{display:'none'}} accept=".csv" onChange={handleImportChannels} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
               <Upload className="h-4 w-4 mr-2" /> 导入
            </button>
            <button onClick={handleExportChannels} className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
               <Download className="h-4 w-4 mr-2" /> 导出
            </button>
          </div>
        </div>

        {showFilters && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 animate-fade-in-down">
                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                          <label className="text-xs text-slate-500 font-medium ml-1">渠道名称</label>
                          <div className="relative">
                            <input type="text" value={chnFilter.name} onChange={(e) => setChnFilter({...chnFilter, name: e.target.value})} placeholder="搜索渠道..." className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                          </div>
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs text-slate-500 font-medium ml-1">渠道类型</label>
                          <div className="relative">
                            <select value={chnFilter.type} onChange={(e) => setChnFilter({...chnFilter, type: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all">
                                <option>全部类型</option>
                                <option>线上渠道</option>
                                <option>线下渠道</option>
                                <option>特殊渠道</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                          </div>
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs text-slate-500 font-medium ml-1">状态</label>
                          <div className="relative">
                            <select value={chnFilter.status} onChange={(e) => setChnFilter({...chnFilter, status: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all">
                                <option>全部状态</option>
                                <option>活跃</option>
                                <option>待接入</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                          </div>
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs text-slate-500 font-medium ml-1 flex items-center"><Percent size={10} className="mr-1"/>佣金比例</label>
                          <div className="relative">
                            <select value={chnFilter.commission} onChange={(e) => setChnFilter({...chnFilter, commission: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all">
                                <option>全部比例</option>
                                <option>低 (5%以下)</option>
                                <option>中 (5%-15%)</option>
                                <option>高 (15%以上)</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-slate-50">
                        <button onClick={() => setChnFilter({name:'', type:'全部类型', status:'全部状态', commission:'全部比例'})} className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                          <RotateCcw className="h-3 w-3 mr-1" /> 重置筛选
                        </button>
                  </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentData.map((channel) => (
            <div key={channel.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${channel.type === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    <ShoppingCart size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-slate-900">{channel.name}</h3>
                    <p className="text-xs text-slate-500">{channel.subType}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${channel.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {channel.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <p><span className="font-medium">适用品类:</span> {channel.applicableCategories}</p>
                <p className="line-clamp-2"><span className="font-medium">特点:</span> {channel.features}</p>
                <p><span className="font-medium">佣金:</span> {(channel.commissionRate * 100).toFixed(0)}%</p>
                <p><span className="font-medium">对接人:</span> {channel.contactPerson}</p>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-end space-x-3">
                <button onClick={() => openEditChannelModal(channel)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                  <Edit2 size={14} className="mr-1" /> 编辑
                </button>
                <button onClick={() => handleDeleteChannel(channel.id, channel.name)} className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center">
                  <Trash2 size={14} className="mr-1" /> 删除
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
            <Pagination 
                currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}
                totalItems={filteredList.length} startIndex={startIndex} endIndex={endIndex}
            />
        </div>
      </div>
    );
  };

  const PricingPage = () => {
    // New Implementation
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Metrics calculation
    const avgRoi = pricingPlans.length > 0 
        ? pricingPlans.reduce((sum, p) => sum + p.roi, 0) / pricingPlans.length 
        : 0;
    const bestPlan = pricingPlans.length > 0 
        ? pricingPlans.reduce((prev, curr) => (prev.roi > curr.roi) ? prev : curr) 
        : null;
    const profitMargin = 24.3; // Mocked for display as per screenshot, or calculate if needed

    // Pagination for table
    const totalPages = Math.ceil(pricingPlans.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPlans = pricingPlans.slice(startIndex, startIndex + itemsPerPage);

    const handleDeletePlan = (id: string) => {
        if(window.confirm("确定删除该分析方案吗？")) {
            setPricingPlans(prev => prev.filter(p => p.id !== id));
            addNotification("删除成功", "定价方案已移除", "info");
        }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-slate-900">定价分析</h2>
             <div className="flex space-x-3">
                 <button 
                    onClick={() => setIsAnalysisModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm"
                 >
                    <Plus className="h-4 w-4 mr-2"/> 新建分析
                 </button>
                 <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    <Download className="h-4 w-4 mr-2"/> 导出
                 </button>
             </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-blue-600 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                 <div className="relative z-10">
                     <p className="text-blue-100 text-sm font-medium mb-1">平均ROI</p>
                     <h3 className="text-3xl font-bold">{avgRoi.toFixed(1)}%</h3>
                     <p className="text-blue-200 text-xs mt-2 flex items-center">
                         <TrendingUp className="h-3 w-3 mr-1"/> 2.3% 较上月
                     </p>
                 </div>
                 <LineChartIcon className="absolute right-4 top-4 text-blue-500 opacity-30 h-12 w-12"/>
             </div>
             
             <div className="bg-green-600 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10">
                     <p className="text-green-100 text-sm font-medium mb-1">最高ROI方案</p>
                     <h3 className="text-3xl font-bold">{bestPlan ? bestPlan.roi : 0}%</h3>
                     <p className="text-green-200 text-xs mt-2 truncate">
                         {bestPlan ? `${bestPlan.inventoryName.substring(0,6)}... - ${bestPlan.mediaName.substring(0,4)}...` : '无数据'}
                     </p>
                 </div>
                 <Award className="absolute right-4 top-4 text-green-500 opacity-30 h-12 w-12"/>
             </div>

             <div className="bg-amber-600 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                 <div className="relative z-10">
                     <p className="text-amber-100 text-sm font-medium mb-1">平均利润率</p>
                     <h3 className="text-3xl font-bold">{profitMargin}%</h3>
                     <p className="text-amber-200 text-xs mt-2 flex items-center">
                         <TrendingUp className="h-3 w-3 mr-1"/> 1.8% 较上月
                     </p>
                 </div>
                 <Percent className="absolute right-4 top-4 text-amber-500 opacity-30 h-12 w-12"/>
             </div>

              <div className="bg-purple-600 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                 <div className="relative z-10">
                     <p className="text-purple-100 text-sm font-medium mb-1">分析方案数</p>
                     <h3 className="text-3xl font-bold">{pricingPlans.length}</h3>
                     <p className="text-purple-200 text-xs mt-2 flex items-center">
                         <Plus className="h-3 w-3 mr-1"/> 4 本月新增
                     </p>
                 </div>
                 <FileText className="absolute right-4 top-4 text-purple-500 opacity-30 h-12 w-12"/>
             </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                 <div className="space-y-1">
                     <label className="text-xs text-slate-500">商品分类</label>
                     <select className="w-full border-slate-300 rounded-md text-sm">
                         <option>服装鞋帽</option>
                         <option>电子产品</option>
                     </select>
                 </div>
                 <div className="space-y-1">
                     <label className="text-xs text-slate-500">媒体类型</label>
                     <select className="w-full border-slate-300 rounded-md text-sm">
                         <option>互联网媒体</option>
                         <option>户外媒体</option>
                     </select>
                 </div>
                 <div className="space-y-1">
                     <label className="text-xs text-slate-500">渠道类型</label>
                     <select className="w-full border-slate-300 rounded-md text-sm">
                         <option>线上销售渠道</option>
                     </select>
                 </div>
                 <div className="flex space-x-2">
                     <button className="flex-1 bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-md hover:bg-slate-50 text-sm">重置</button>
                     <button className="flex-1 bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 text-sm">搜索</button>
                 </div>
             </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
                         <tr>
                             <th className="px-6 py-4">分析编号</th>
                             <th className="px-6 py-4">商品名称</th>
                             <th className="px-6 py-4">库存价格</th>
                             <th className="px-6 py-4">媒体名称</th>
                             <th className="px-6 py-4">媒体价格</th>
                             <th className="px-6 py-4">渠道名称</th>
                             <th className="px-6 py-4">渠道出货价</th>
                             <th className="px-6 py-4">ROI</th>
                             <th className="px-6 py-4">状态</th>
                             <th className="px-6 py-4">操作</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {currentPlans.map(plan => (
                             <tr key={plan.id} className="hover:bg-slate-50">
                                 <td className="px-6 py-4 text-slate-500">{plan.id}</td>
                                 <td className="px-6 py-4 font-medium text-slate-900">{plan.inventoryName}</td>
                                 <td className="px-6 py-4 text-slate-600">¥{plan.inventoryCost}</td>
                                 <td className="px-6 py-4 text-slate-600">{plan.mediaName}</td>
                                 <td className="px-6 py-4 text-slate-600">{plan.mediaCostStr}</td>
                                 <td className="px-6 py-4 text-slate-600">{plan.channelName}</td>
                                 <td className="px-6 py-4 font-bold text-indigo-600">¥{plan.channelBid.toLocaleString()}</td>
                                 <td className="px-6 py-4 font-medium text-slate-900">{plan.roi}%</td>
                                 <td className="px-6 py-4">
                                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                         plan.status === 'executed' ? 'bg-green-100 text-green-800' :
                                         plan.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                         'bg-blue-100 text-blue-800'
                                     }`}>
                                         {plan.status === 'executed' ? '已执行' : plan.status === 'pending' ? '执行中' : '待执行'}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex space-x-2">
                                         <button className="text-slate-400 hover:text-indigo-600"><Settings size={16}/></button>
                                         <button className="text-slate-400 hover:text-indigo-600"><Edit2 size={16}/></button>
                                         <button onClick={() => handleDeletePlan(plan.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                     </div>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
             <Pagination 
                currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} 
                totalItems={pricingPlans.length} startIndex={startIndex} endIndex={startIndex + itemsPerPage}
             />
        </div>

        {/* Modal for New Analysis */}
        {isAnalysisModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                 <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAnalysisModalOpen(false)}></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                    
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
                         <PricingAnalysisForm 
                            inventory={inventory}
                            media={media}
                            channels={channels}
                            onSave={(newPlan) => {
                                setPricingPlans([newPlan, ...pricingPlans]);
                                setIsAnalysisModalOpen(false);
                                addNotification("保存成功", "新定价方案已添加", "success");
                            }}
                            onCancel={() => setIsAnalysisModalOpen(false)}
                         />
                    </div>
                 </div>
            </div>
        )}
      </div>
    );
  };
  
  // --- Inner Component for Pricing Form ---
  const PricingAnalysisForm = ({ inventory, media, channels, onSave, onCancel }: {
      inventory: InventoryItem[], media: MediaResource[], channels: SalesChannel[],
      onSave: (plan: PricingPlan) => void, onCancel: () => void
  }) => {
      const [step, setStep] = useState(1);
      const [selInvId, setSelInvId] = useState('');
      const [selMediaId, setSelMediaId] = useState('');
      const [selChanId, setSelChanId] = useState('');
      
      const [aiResult, setAiResult] = useState<PricingStrategyResult | null>(null);
      const [loading, setLoading] = useState(false);

      const handleAnalyze = async () => {
          const inv = inventory.find(i => i.id === selInvId);
          const med = media.find(m => m.id === selMediaId);
          const chan = channels.find(c => c.id === selChanId);
          
          if(!inv || !med || !chan) return;
          
          setLoading(true);
          try {
              const res = await optimizePricingStrategy(inv, med, chan);
              setAiResult(res);
              setStep(2);
          } catch(e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      };

      const handleFinalSave = () => {
          if(!aiResult) return;
          const inv = inventory.find(i => i.id === selInvId)!;
          const med = media.find(m => m.id === selMediaId)!;
          const chan = channels.find(c => c.id === selChanId)!;

          const plan: PricingPlan = {
              id: `PA-2023-${Date.now().toString().slice(-4)}`,
              inventoryId: inv.id,
              inventoryName: inv.name,
              inventoryCost: inv.costPrice,
              mediaId: med.id,
              mediaName: med.name,
              mediaCostStr: med.rate,
              channelId: chan.id,
              channelName: chan.name,
              channelBid: aiResult.suggestedPrice,
              roi: aiResult.predictedROI,
              status: 'pending',
              lastUpdated: new Date().toISOString().split('T')[0]
          };
          onSave(plan);
      };

      return (
          <div className="bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">新建智能定价分析</h3>
                  <button onClick={onCancel}><X className="text-slate-400 hover:text-slate-600" size={20}/></button>
              </div>
              
              <div className="p-6">
                  {step === 1 && (
                      <div className="space-y-6">
                          <div className="grid grid-cols-3 gap-6">
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">1. 选择库存商品</label>
                                  <select className="w-full border-slate-300 rounded-md" value={selInvId} onChange={e => setSelInvId(e.target.value)}>
                                      <option value="">请选择...</option>
                                      {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">2. 选择媒体支持</label>
                                  <select className="w-full border-slate-300 rounded-md" value={selMediaId} onChange={e => setSelMediaId(e.target.value)}>
                                      <option value="">请选择...</option>
                                      {media.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">3. 选择销售渠道</label>
                                  <select className="w-full border-slate-300 rounded-md" value={selChanId} onChange={e => setSelChanId(e.target.value)}>
                                      <option value="">请选择...</option>
                                      {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                  </select>
                              </div>
                          </div>

                          <div className="flex justify-center py-8">
                               <button 
                                  onClick={handleAnalyze}
                                  disabled={!selInvId || !selMediaId || !selChanId || loading}
                                  className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-full text-lg font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                               >
                                   {loading ? <RefreshCw className="animate-spin mr-2"/> : <Lightbulb className="mr-2"/>}
                                   {loading ? "AI 正在计算最佳策略..." : "AI 智能定价 (Smart Pricing)"}
                               </button>
                          </div>
                      </div>
                  )}

                  {step === 2 && aiResult && (
                      <div className="animate-fade-in-up">
                          <div className="grid grid-cols-2 gap-8 mb-6">
                               <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col items-center justify-center">
                                   <p className="text-indigo-600 font-medium mb-1">AI 建议出货价 (Channel Bid)</p>
                                   <h2 className="text-5xl font-bold text-indigo-900 mb-2">¥{aiResult.suggestedPrice.toLocaleString()}</h2>
                                   <div className="flex items-center text-sm text-indigo-500 bg-white px-3 py-1 rounded-full shadow-sm">
                                       <span className="font-medium mr-2">建议区间:</span>
                                       ¥{aiResult.priceRange.min.toLocaleString()} - ¥{aiResult.priceRange.max.toLocaleString()}
                                   </div>
                               </div>
                               <div className="space-y-4">
                                   <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                                       <div className="flex justify-between items-center mb-1">
                                           <span className="text-green-700 font-bold">预计 ROI</span>
                                           <span className="text-2xl font-bold text-green-700">{aiResult.predictedROI}%</span>
                                       </div>
                                       <div className="w-full bg-green-200 rounded-full h-2">
                                           <div className="bg-green-600 h-2 rounded-full" style={{width: `${Math.min(aiResult.predictedROI, 100)}%`}}></div>
                                       </div>
                                   </div>
                                   <div className="bg-white border border-slate-200 p-4 rounded-lg">
                                       <h5 className="font-bold text-slate-800 mb-2 flex items-center"><Award size={16} className="mr-1 text-amber-500"/> 策略分析</h5>
                                       <p className="text-slate-600 text-sm leading-relaxed">{aiResult.reasoning}</p>
                                   </div>
                               </div>
                          </div>
                          
                          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                               <button onClick={() => setStep(1)} className="px-4 py-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50">返回修改</button>
                               <button onClick={handleFinalSave} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-md">采纳并创建方案</button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  const FinancePage = () => {
    const [simInvId, setSimInvId] = useState('');
    const [simMedId, setSimMedId] = useState('');
    const [simChanId, setSimChanId] = useState('');
    const [simPrice, setSimPrice] = useState(0);
    const [simQty, setSimQty] = useState(100);
    const [simMediaCost, setSimMediaCost] = useState(5000);
    const [simResult, setSimResult] = useState<FinancialSimulationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRunSim = async () => {
      const inv = inventory.find(i => i.id === simInvId);
      const med = media.find(m => m.id === simMedId);
      const chan = channels.find(c => c.id === simChanId);
      if (!inv || !med || !chan) {
        addNotification("无法计算", "请选择所有必要的参数", "warning");
        return;
      }

      setLoading(true);
      const res = await runFinancialSimulation(inv, med, chan, {
        sellPrice: simPrice,
        quantity: simQty,
        mediaCost: simMediaCost
      });
      setSimResult(res);
      setLoading(false);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">财务测算 (Financial Simulation)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">模拟参数设置</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">选择商品</label>
              <select className="w-full border-slate-300 rounded-md text-sm" value={simInvId} onChange={e => setSimInvId(e.target.value)}>
                <option value="">请选择...</option>
                {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">选择媒体资源</label>
              <select className="w-full border-slate-300 rounded-md text-sm" value={simMedId} onChange={e => setSimMedId(e.target.value)}>
                <option value="">请选择...</option>
                {media.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">选择销售渠道</label>
              <select className="w-full border-slate-300 rounded-md text-sm" value={simChanId} onChange={e => setSimChanId(e.target.value)}>
                <option value="">请选择...</option>
                {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">预计售价 (¥)</label>
                  <input type="number" className="w-full border-slate-300 rounded-md text-sm" value={simPrice} onChange={e => setSimPrice(parseFloat(e.target.value))} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">预计销量</label>
                  <input type="number" className="w-full border-slate-300 rounded-md text-sm" value={simQty} onChange={e => setSimQty(parseFloat(e.target.value))} />
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">媒体预算投入 (¥)</label>
              <input type="number" className="w-full border-slate-300 rounded-md text-sm" value={simMediaCost} onChange={e => setSimMediaCost(parseFloat(e.target.value))} />
            </div>

            <button 
              onClick={handleRunSim}
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 mt-4 font-medium"
            >
              {loading ? "AI 计算中..." : "开始测算"}
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
             {simResult ? (
                <div className="animate-fade-in-up space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                         <p className="text-slate-500 text-xs uppercase">预计利润</p>
                         <h3 className={`text-2xl font-bold ${simResult.projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                           ¥{simResult.projectedProfit.toLocaleString()}
                         </h3>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                         <p className="text-slate-500 text-xs uppercase">盈亏平衡销量</p>
                         <h3 className="text-2xl font-bold text-slate-800">{simResult.breakEvenPoint.toLocaleString()}</h3>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                         <p className="text-slate-500 text-xs uppercase">战略匹配度</p>
                         <div className="flex items-center justify-center">
                           <h3 className="text-2xl font-bold text-indigo-600 mr-2">{simResult.strategicFitScore}</h3>
                           <span className="text-xs text-slate-400">/ 100</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                        <Award className="text-amber-500 mr-2 h-5 w-5" /> AI 战略建议
                      </h4>
                      <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm leading-relaxed mb-4">
                         {simResult.recommendation}
                      </div>
                      <h5 className="font-medium text-slate-700 mb-2 text-sm">分析依据:</h5>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                         {simResult.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                   </div>
                </div>
             ) : (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-400 h-full">
                   <Calculator className="h-16 w-16 mb-4 opacity-20" />
                   <p>请在左侧填写参数并点击"开始测算"</p>
                </div>
             )}
          </div>
        </div>
      </div>
    );
  };

  const RiskPage = () => {
    const [riskReport, setRiskReport] = useState<AIAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRiskAssess = async () => {
       setLoading(true);
       const mediaValuation = media.reduce((acc, m) => acc + (m.valuation || 0), 0);
       const res = await assessRisk(totalValue, mediaValuation, channels.length);
       setRiskReport(res);
       setLoading(false);
    };

    return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">风控检查 (Risk Assessment)</h2>
            <button 
              onClick={handleRiskAssess}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin mr-2 h-4 w-4"/> : <AlertTriangle className="mr-2 h-4 w-4" />}
              {loading ? "正在评估..." : "立即评估风险"}
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="总库存风险敞口" value={`¥${totalValue.toLocaleString()}`} icon={AlertCircle} iconBgClass="bg-red-50" iconColorClass="text-red-600" />
            <StatCard title="媒体资源估值" value={`¥${media.reduce((acc, m) => acc + (m.valuation || 0), 0).toLocaleString()}`} icon={Tv} iconBgClass="bg-blue-50" iconColorClass="text-blue-600" />
            <StatCard title="渠道依赖度" value={`${(100 / Math.max(channels.length, 1)).toFixed(1)}%`} icon={TrendingDown} trend="Single Channel Risk" trendUp={false} />
         </div>

         {riskReport && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-fade-in-up">
               <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full mr-4 ${riskReport.riskScore && riskReport.riskScore > 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                     <Activity size={24} />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-slate-900">AI 风险评估报告</h3>
                     <p className="text-sm text-slate-500">综合风险评分: <span className="font-bold">{riskReport.riskScore}</span> / 100</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-indigo-500">
                     <p className="font-medium text-slate-900 mb-1">主要建议:</p>
                     <p className="text-slate-700 text-sm">{riskReport.recommendation}</p>
                  </div>
                  
                  <div>
                     <p className="font-medium text-slate-900 mb-2">详细分析:</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {riskReport.reasoning.map((r, i) => (
                           <div key={i} className="flex items-start p-3 bg-white border border-slate-100 rounded-md">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm text-slate-600">{r}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    );
  };

  const ReportsPage = () => {
     // Mock data for charts
     const salesTrend = [
        { name: '1月', revenue: 4000, profit: 2400 },
        { name: '2月', revenue: 3000, profit: 1398 },
        { name: '3月', revenue: 2000, profit: 9800 },
        { name: '4月', revenue: 2780, profit: 3908 },
        { name: '5月', revenue: 1890, profit: 4800 },
        { name: '6月', revenue: 2390, profit: 3800 },
     ];

     return (
       <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">数据报表 (Reports)</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">月度营收趋势</h3>
                <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesTrend}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <Tooltip />
                         <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="营收" />
                         <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="利润" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">库存分类占比</h3>
                 <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={inventory} dataKey="quantity" nameKey="category" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {inventory.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                            ))}
                         </Pie>
                         <Tooltip />
                         <Legend />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
       </div>
     );
  };

  const SettingsPage = () => {
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSaveSettings = () => {
      applySettings(localSettings);
    };

    return (
      <div className="space-y-6 max-w-4xl">
         <h2 className="text-xl font-bold text-slate-900">系统设置 (Settings)</h2>
         
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">库存预警规则</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">库存偏低阈值 (Low Stock Threshold)</label>
                  <p className="text-xs text-slate-500 mb-2">当商品库存低于此数量时，状态标记为"预警"</p>
                  <input 
                    type="number" 
                    value={localSettings.lowStockThreshold}
                    onChange={(e) => setLocalSettings({...localSettings, lowStockThreshold: parseInt(e.target.value)})}
                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">缺货阈值 (Out of Stock Threshold)</label>
                  <p className="text-xs text-slate-500 mb-2">当商品库存低于或等于此数量时，状态标记为"缺货"</p>
                   <input 
                    type="number" 
                    value={localSettings.outOfStockThreshold}
                    onChange={(e) => setLocalSettings({...localSettings, outOfStockThreshold: parseInt(e.target.value)})}
                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
               </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
               <button 
                 onClick={handleSaveSettings}
                 className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
               >
                 <Save className="h-4 w-4 mr-2" /> 保存设置
               </button>
            </div>
         </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage />;
      case 'inventory': return <InventoryPage />;
      case 'media': return <MediaPage />;
      case 'channels': return <ChannelsPage />;
      case 'pricing': return <PricingPage />;
      case 'finance': return <FinancePage />;
      case 'risk': return <RiskPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      notifications={notifications}
      onMarkAsRead={markAsRead}
      onClearAllNotifications={clearAllNotifications}
    >
      {renderContent()}
      
      {/* Toast Notifications */}
      <ToastContainer notifications={notifications.filter(n => !n.read)} removeToast={removeToast} />

      {/* Modals */}
      <MediaModal 
        isOpen={isMediaModalOpen} 
        onClose={() => setIsMediaModalOpen(false)} 
        onSave={handleSaveMedia}
        initialData={editingMedia}
      />
      
      <ChannelModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        onSave={handleSaveChannel}
        initialData={editingChannel}
      />

      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        onSave={handleSaveInventory}
        initialData={editingInventory}
      />
    </Layout>
  );
}

export default App;
