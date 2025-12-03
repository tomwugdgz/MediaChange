
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
  FileBarChart, PieChart as PieChartIcon, LineChart as LineChartIcon, RotateCcw, Award, Lightbulb, Target, Layers
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
  const [invFilter, setInvFilter] = useState({ name: '', category: '全部分类', status: '全部状态', brand: '全部品牌' });
  const [medFilter, setMedFilter] = useState({ name: '', type: '全部类型', status: '全部状态', expiring: '不限' });
  const [chnFilter, setChnFilter] = useState({ name: '', type: '全部类型', status: '全部状态', commission: '全部比例' });
  const [pricingFilter, setPricingFilter] = useState({ category: '全部分类', mediaType: '全部媒体', channelType: '全部渠道', roi: '不限' });
  
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
        setSelectedInventoryIds([...new Set([...selectedInventoryIds, ...currentIds])]);
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
                  <Trash2 className="h-4 w-4 mr-2" />
                  批量删除 ({selectedInventoryIds.length})
                </button>
             )}
            <button 
              onClick={openAddInventoryModal}
              className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              添加库存
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </button>
            <input type="file" ref={fileInputRef} style={{display: 'none'}} accept=".csv" onChange={handleImportInventory} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              导入
            </button>
            <button 
              onClick={handleExportInventory}
              className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              导出
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-down">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">商品名称</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索商品..."
                  className="pl-9 w-full border border-slate-300 rounded-md py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={invFilter.name}
                  onChange={(e) => setInvFilter({...invFilter, name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">商品分类</label>
              <select 
                className="w-full border border-slate-300 rounded-md py-2 text-sm"
                value={invFilter.category}
                onChange={(e) => setInvFilter({...invFilter, category: e.target.value})}
              >
                <option>全部分类</option>
                <option>电子产品</option>
                <option>家用电器</option>
                <option>保健品</option>
                <option>食品饮料</option>
                <option>美妆护肤</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">库存状态</label>
              <select 
                className="w-full border border-slate-300 rounded-md py-2 text-sm"
                value={invFilter.status}
                onChange={(e) => setInvFilter({...invFilter, status: e.target.value})}
              >
                <option>全部状态</option>
                <option>库存充足</option>
                <option>库存预警</option>
                <option>缺货</option>
                <option>已下架</option>
              </select>
            </div>
             <div className="flex items-end">
              <button 
                onClick={() => setInvFilter({ name: '', category: '全部分类', status: '全部状态', brand: '全部品牌' })}
                className="w-full py-2 border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50 text-sm"
              >
                重置筛选
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                   <th scope="col" className="px-6 py-3 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={currentData.length > 0 && currentData.every(i => selectedInventoryIds.includes(i.id))}
                      onChange={toggleSelectAllInventory}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">商品名称</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">品牌/分类</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">库存/状态</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">市场单价</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">成本价</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {currentData.length > 0 ? (
                  currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedInventoryIds.includes(item.id)}
                          onChange={() => toggleInventorySelection(item.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                            {item.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{item.name}</div>
                            {item.productUrl && (
                              <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center mt-0.5">
                                <Link2 size={10} className="mr-1" /> 查看详情
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{item.brand}</div>
                        <div className="text-sm text-slate-500">{item.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900">{item.quantity} 件</span>
                            <span className={`inline-flex mt-1 text-xs leading-5 font-semibold rounded-full w-fit
                              ${item.status === InventoryStatus.IN_STOCK ? 'text-green-800' : 
                                item.status === InventoryStatus.LOW_STOCK ? 'text-amber-600' : 
                                item.status === InventoryStatus.OUT_OF_STOCK ? 'text-red-800' : 'text-slate-500'}`}>
                              {item.status === InventoryStatus.IN_STOCK && '库存充足'}
                              {item.status === InventoryStatus.LOW_STOCK && '库存预警'}
                              {item.status === InventoryStatus.OUT_OF_STOCK && '缺货'}
                              {item.status === InventoryStatus.DISCONTINUED && '已下架'}
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="font-medium">¥{item.marketPrice.toLocaleString()}</div>
                        {item.lowestPrice && <div className="text-xs text-indigo-600">最低: ¥{item.lowestPrice.toLocaleString()}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        ¥{item.costPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openEditInventoryModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center justify-end inline-flex">
                          <Edit2 size={16} className="mr-1"/> 编辑
                        </button>
                        <button onClick={() => handleDeleteInventory(item.id, item.name)} className="text-red-600 hover:text-red-900 flex items-center justify-end inline-flex">
                          <Trash2 size={16} className="mr-1"/> 删除
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      没有找到符合条件的商品，请尝试调整筛选条件或添加新商品。
                    </td>
                  </tr>
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
    const itemsPerPage = 10;
    
    useEffect(() => { setCurrentPage(1); }, [medFilter]);

    const filteredList = getFilteredMedia();
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredList.slice(startIndex, endIndex);

    const handleImportMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Implementation for CSV import similar to Inventory
        const file = event.target.files?.[0];
        if(!file) return;
        // ... (Parsing logic reused or duplicated)
        addNotification("功能演示", "媒体导入功能与库存导入类似", "info");
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">媒体资源管理</h2>
          <div className="flex space-x-3">
            <button onClick={openAddMediaModal} className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              添加媒体
            </button>
             <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </button>
            <input type="file" ref={fileInputRef} style={{display: 'none'}} accept=".csv" onChange={handleImportMedia} />
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Upload className="h-4 w-4 mr-2" /> 导入
            </button>
            <button onClick={handleExportMedia} className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="h-4 w-4 mr-2" /> 导出
            </button>
          </div>
        </div>

        {/* Media Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-down">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">媒体名称</label>
                <input
                  type="text"
                  placeholder="搜索媒体..."
                  className="w-full border border-slate-300 rounded-md py-2 px-3 text-sm"
                  value={medFilter.name}
                  onChange={(e) => setMedFilter({...medFilter, name: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">媒体类型</label>
                <select className="w-full border border-slate-300 rounded-md py-2 text-sm" value={medFilter.type} onChange={e => setMedFilter({...medFilter, type: e.target.value})}>
                    <option>全部类型</option>
                    <option>户外媒体</option>
                    <option>数字媒体</option>
                    <option>社区媒体</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
                <select className="w-full border border-slate-300 rounded-md py-2 text-sm" value={medFilter.status} onChange={e => setMedFilter({...medFilter, status: e.target.value})}>
                    <option>全部状态</option>
                    <option>活跃</option>
                    <option>待审核</option>
                    <option>即将到期</option>
                    <option>已过期</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">合同到期</label>
                <select className="w-full border border-slate-300 rounded-md py-2 text-sm" value={medFilter.expiring} onChange={e => setMedFilter({...medFilter, expiring: e.target.value})}>
                    <option>不限</option>
                    <option>30天内</option>
                    <option>90天内</option>
                    <option>半年内</option>
                </select>
             </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">媒体名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">类型/形式</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">覆盖范围</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">刊例价/折扣</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">合同期限</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{item.type}</div>
                      <div className="text-xs text-slate-500">{item.format}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{item.rate}</div>
                      <div className="text-xs text-indigo-600">{(item.discount * 100).toFixed(0)}% off</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div>{item.contractStart}</div>
                      <div className="text-xs">至 {item.contractEnd}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${item.status === 'active' ? 'bg-green-100 text-green-800' : 
                          item.status === 'expiring' ? 'bg-amber-100 text-amber-800' : 
                          item.status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                        {item.status === 'active' ? '活跃' : item.status === 'expiring' ? '即将过期' : item.status === 'expired' ? '已过期' : '待审核'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditMediaModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center justify-end inline-flex">
                        <Edit2 size={16} className="mr-1"/> 编辑
                      </button>
                      <button onClick={() => handleDeleteMedia(item.id, item.name)} className="text-red-600 hover:text-red-900 flex items-center justify-end inline-flex">
                        <Trash2 size={16} className="mr-1"/> 删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredList.length} startIndex={startIndex} endIndex={endIndex} />
        </div>
      </div>
    );
  };
  
  const ChannelsPage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => { setCurrentPage(1); }, [chnFilter]);

    const filteredList = getFilteredChannels();
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredList.slice(startIndex, endIndex);

    const handleImportChannels = (event: React.ChangeEvent<HTMLInputElement>) => {
        addNotification("功能演示", "渠道导入功能与库存导入类似", "info");
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">销售渠道管理</h2>
          <div className="flex space-x-3">
            <button onClick={openAddChannelModal} className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              添加渠道
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </button>
            <input type="file" ref={fileInputRef} style={{display: 'none'}} accept=".csv" onChange={handleImportChannels} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Upload className="h-4 w-4 mr-2" /> 导入
            </button>
            <button onClick={handleExportChannels} className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="h-4 w-4 mr-2" /> 导出
            </button>
          </div>
        </div>

        {/* Channel Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-down">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">渠道名称</label>
                  <input type="text" placeholder="搜索渠道..." className="w-full border border-slate-300 rounded-md py-2 px-3 text-sm" value={chnFilter.name} onChange={e => setChnFilter({...chnFilter, name: e.target.value})} />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">渠道类型</label>
                  <select className="w-full border border-slate-300 rounded-md py-2 text-sm" value={chnFilter.type} onChange={e => setChnFilter({...chnFilter, type: e.target.value})}>
                      <option>全部类型</option>
                      <option value="Online">线上渠道</option>
                      <option value="Offline">线下渠道</option>
                      <option value="Special">特殊渠道</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
                  <select className="w-full border border-slate-300 rounded-md py-2 text-sm" value={chnFilter.status} onChange={e => setChnFilter({...chnFilter, status: e.target.value})}>
                      <option>全部状态</option>
                      <option>活跃</option>
                      <option>待接入</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">佣金比例</label>
                  <select className="w-full border border-slate-300 rounded-md py-2 text-sm" value={chnFilter.commission} onChange={e => setChnFilter({...chnFilter, commission: e.target.value})}>
                      <option>全部比例</option>
                      <option>低 (5%以下)</option>
                      <option>中 (5%-15%)</option>
                      <option>高 (15%以上)</option>
                  </select>
              </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">渠道名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">类型/特点</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">佣金比例</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">对接人</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${item.type === 'Online' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                           {item.type === 'Online' ? <Monitor size={16}/> : <Store size={16}/>}
                        </div>
                        <div className="text-sm font-medium text-slate-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{item.subType}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs" title={item.features}>{item.features}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {(item.commissionRate * 100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {item.contactPerson}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {item.status === 'active' ? '活跃' : '待接入'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditChannelModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center justify-end inline-flex">
                        <Edit2 size={16} className="mr-1"/> 编辑
                      </button>
                      <button onClick={() => handleDeleteChannel(item.id, item.name)} className="text-red-600 hover:text-red-900 flex items-center justify-end inline-flex">
                        <Trash2 size={16} className="mr-1"/> 删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredList.length} startIndex={startIndex} endIndex={endIndex} />
        </div>
      </div>
    );
  };
  
  const PricingPage = () => {
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [newPlan, setNewPlan] = useState({ inventoryId: '', mediaId: '', channelId: '' });
    const [aiSuggestion, setAiSuggestion] = useState<PricingStrategyResult | null>(null);
    const [loading, setLoading] = useState(false);
    
    // --- MOCK SUMMARY DATA ---
    const avgRoi = (pricingPlans.reduce((sum, p) => sum + p.roi, 0) / (pricingPlans.length || 1)).toFixed(1);
    const topPlan = pricingPlans.reduce((prev, current) => (prev.roi > current.roi) ? prev : current, pricingPlans[0]);
    const plansThisMonth = pricingPlans.filter(p => new Date(p.lastUpdated).getMonth() === new Date().getMonth()).length;

    const filteredPlans = pricingPlans.filter(plan => {
      // In a real app, you'd join with Inventory/Media/Channel tables to filter by category/type.
      // Here we do simple string matching or skip complex joins for brevity.
      return true; 
    });

    const handleAnalyze = async () => {
        const inv = inventory.find(i => i.id === newPlan.inventoryId);
        const med = media.find(m => m.id === newPlan.mediaId);
        const chn = channels.find(c => c.id === newPlan.channelId);
        
        if (!inv || !med || !chn) {
            alert("请选择完整的资源组合");
            return;
        }

        setLoading(true);
        const result = await optimizePricingStrategy(inv, med, chn);
        setAiSuggestion(result);
        setLoading(false);
    };

    const saveAnalysis = () => {
        if (!newPlan.inventoryId || !aiSuggestion) return;
        const inv = inventory.find(i => i.id === newPlan.inventoryId)!;
        const med = media.find(m => m.id === newPlan.mediaId)!;
        const chn = channels.find(c => c.id === newPlan.channelId)!;

        const plan: PricingPlan = {
            id: `PA-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
            inventoryId: inv.id,
            inventoryName: inv.name,
            inventoryCost: inv.costPrice,
            mediaId: med.id,
            mediaName: med.name,
            mediaCostStr: med.rate,
            channelId: chn.id,
            channelName: chn.name,
            channelBid: aiSuggestion.suggestedPrice,
            roi: aiSuggestion.predictedROI,
            status: 'draft',
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        setPricingPlans([plan, ...pricingPlans]);
        setIsAnalysisModalOpen(false);
        setAiSuggestion(null);
        setNewPlan({ inventoryId: '', mediaId: '', channelId: '' });
        addNotification("分析保存", "定价分析方案已保存", "success");
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">定价分析</h2>
            <div className="flex space-x-3">
                 <button onClick={() => setIsAnalysisModalOpen(true)} className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm">
                    <Plus className="h-4 w-4 mr-2" /> 新建分析
                 </button>
                 <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    <Download className="h-4 w-4 mr-2" /> 导出
                 </button>
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="平均ROI" value={`${avgRoi}%`} icon={TrendingUp} trend="2.3% 较上月" trendUp={true} colorClass="bg-blue-600 text-white" iconBgClass="bg-blue-500/30" iconColorClass="text-white" />
            <StatCard title="最高ROI方案" value={`${topPlan?.roi}%`} icon={Award} trend={`${topPlan?.inventoryName.substring(0,6)}...`} trendUp={true} colorClass="bg-green-600 text-white" iconBgClass="bg-green-500/30" iconColorClass="text-white" />
            <StatCard title="平均利润率" value="24.3%" icon={Percent} trend="1.8% 较上月" trendUp={true} colorClass="bg-amber-600 text-white" iconBgClass="bg-amber-500/30" iconColorClass="text-white" />
            <StatCard title="分析方案数" value={pricingPlans.length} icon={FileText} trend={`4 本月新增`} trendUp={true} colorClass="bg-purple-600 text-white" iconBgClass="bg-purple-500/30" iconColorClass="text-white" />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
             <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">商品分类</label>
                <select className="w-full border border-slate-300 rounded-md py-1.5 text-sm" value={pricingFilter.category} onChange={e => setPricingFilter({...pricingFilter, category: e.target.value})}>
                    <option>全部分类</option>
                    <option>服装鞋帽</option>
                    <option>电子产品</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">媒体类型</label>
                <select className="w-full border border-slate-300 rounded-md py-1.5 text-sm" value={pricingFilter.mediaType} onChange={e => setPricingFilter({...pricingFilter, mediaType: e.target.value})}>
                    <option>全部媒体</option>
                    <option>互联网媒体</option>
                    <option>户外媒体</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">渠道类型</label>
                <select className="w-full border border-slate-300 rounded-md py-1.5 text-sm" value={pricingFilter.channelType} onChange={e => setPricingFilter({...pricingFilter, channelType: e.target.value})}>
                    <option>全部渠道</option>
                    <option>线上销售渠道</option>
                </select>
             </div>
             <div className="flex items-end space-x-2">
                 <button className="w-full py-1.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-sm">重置</button>
                 <button className="w-full py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">搜索</button>
             </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">分析编号</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">商品名称/成本</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">媒体/价格</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">渠道/出价</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ROI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {filteredPlans.map(plan => (
                        <tr key={plan.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{plan.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-slate-900">{plan.inventoryName}</div>
                                <div className="text-xs text-slate-500">¥{plan.inventoryCost}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900">{plan.mediaName}</div>
                                <div className="text-xs text-slate-500">{plan.mediaCostStr}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900">{plan.channelName}</div>
                                <div className="text-xs text-indigo-600 font-bold">¥{plan.channelBid}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`text-sm font-bold ${plan.roi >= 30 ? 'text-green-600' : plan.roi >= 15 ? 'text-indigo-600' : 'text-slate-600'}`}>
                                    {plan.roi}%
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${plan.status === 'executed' ? 'bg-green-100 text-green-800' : 
                                      plan.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                      'bg-slate-100 text-slate-800'}`}>
                                    {plan.status === 'executed' ? '已执行' : plan.status === 'pending' ? '执行中' : '待执行'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button className="text-indigo-600 hover:text-indigo-900"><Monitor size={16}/></button>
                                <button className="text-blue-600 hover:text-blue-900"><Edit2 size={16}/></button>
                                <button className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Modal for New Analysis */}
        {isAnalysisModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAnalysisModalOpen(false)}></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">新建智能定价分析</h3>
                            <div className="space-y-4">
                                <select className="w-full border-slate-300 rounded-md" value={newPlan.inventoryId} onChange={e => setNewPlan({...newPlan, inventoryId: e.target.value})}>
                                    <option value="">选择库存商品...</option>
                                    {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                </select>
                                <select className="w-full border-slate-300 rounded-md" value={newPlan.mediaId} onChange={e => setNewPlan({...newPlan, mediaId: e.target.value})}>
                                    <option value="">选择媒体资源...</option>
                                    {media.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <select className="w-full border-slate-300 rounded-md" value={newPlan.channelId} onChange={e => setNewPlan({...newPlan, channelId: e.target.value})}>
                                    <option value="">选择销售渠道...</option>
                                    {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>

                                <button onClick={handleAnalyze} disabled={loading} className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md shadow flex justify-center items-center">
                                    {loading ? <RefreshCw className="animate-spin mr-2"/> : <Lightbulb className="mr-2"/>}
                                    {loading ? "AI 正在分析..." : "AI 智能定价"}
                                </button>

                                {aiSuggestion && (
                                    <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-bold text-indigo-900">推荐出价: ¥{aiSuggestion.suggestedPrice}</span>
                                            <span className="text-sm font-bold text-green-600">预估ROI: {aiSuggestion.predictedROI}%</span>
                                        </div>
                                        <p className="text-xs text-indigo-700 bg-white p-2 rounded border border-indigo-100">
                                            {aiSuggestion.reasoning}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={saveAnalysis} disabled={!aiSuggestion} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm">
                                保存方案
                            </button>
                            <button onClick={() => setIsAnalysisModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  };
  
  const RiskPage = () => {
    const [riskReport, setRiskReport] = useState<AIAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRiskAssess = async () => {
        setLoading(true);
        // Simple aggregation of metrics
        const totalVal = inventory.reduce((sum, i) => sum + (i.marketPrice * i.quantity), 0);
        const mediaVal = media.reduce((sum, m) => sum + (m.valuation || 0), 0); // using mock valuation
        const activeChannels = channels.length;
        
        const result = await assessRisk(totalVal, mediaVal, activeChannels);
        setRiskReport(result);
        setLoading(false);
    };

    return (
      <div className="space-y-6">
         <h2 className="text-xl font-bold text-slate-900">风控检查</h2>
         <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
             {!riskReport && !loading && (
                 <div className="py-10">
                     <AlertTriangle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                     <h3 className="text-lg font-medium text-slate-900 mb-2">开始风险评估</h3>
                     <p className="text-slate-500 mb-6 max-w-md mx-auto">系统将分析当前库存积压情况、媒体资源有效期以及渠道健康度，为您生成智能风控报告。</p>
                     <button onClick={handleRiskAssess} className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all">
                         启动 AI 深度检测
                     </button>
                 </div>
             )}
             
             {loading && (
                 <div className="py-20 flex flex-col items-center">
                     <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                     <p className="text-slate-600">正在分析全链路数据...</p>
                 </div>
             )}

             {riskReport && (
                 <div className="text-left animate-fade-in">
                     <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <div>
                             <h3 className="text-xl font-bold text-slate-900">评估结果</h3>
                             <p className="text-sm text-slate-500">生成时间: {new Date().toLocaleString()}</p>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm mr-2 text-slate-600">综合风险指数:</span>
                            <span className={`text-3xl font-bold ${riskReport.riskScore && riskReport.riskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>
                                {riskReport.riskScore}/100
                            </span>
                        </div>
                     </div>
                     <div className="space-y-4">
                         <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                             <h4 className="font-bold text-indigo-900 mb-2 flex items-center"><Award className="h-4 w-4 mr-2"/> 核心建议</h4>
                             <p className="text-indigo-800">{riskReport.recommendation}</p>
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-800 mb-3">详细分析</h4>
                             <ul className="space-y-2">
                                 {riskReport.reasoning.map((reason, idx) => (
                                     <li key={idx} className="flex items-start text-slate-600 bg-white border border-slate-100 p-3 rounded shadow-sm">
                                         <span className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold mr-3">{idx + 1}</span>
                                         {reason}
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     </div>
                     <button onClick={() => setRiskReport(null)} className="mt-8 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                         重新评估
                     </button>
                 </div>
             )}
         </div>
      </div>
    );
  };
  
  const ReportsPage = () => {
    // Mock Data for Charts
    const monthlyData = [
        { month: '1月', revenue: 98.5, cost: 78.2, profit: 20.3, roi: 25.9, txs: 92 },
        { month: '2月', revenue: 87.6, cost: 70.5, profit: 17.1, roi: 24.3, txs: 85 },
        { month: '3月', revenue: 105.2, cost: 84.6, profit: 20.6, roi: 24.3, txs: 102 },
        { month: '4月', revenue: 96.8, cost: 78.2, profit: 18.6, roi: 23.8, txs: 95 },
        { month: '5月', revenue: 112.5, cost: 90.8, profit: 21.7, roi: 23.9, txs: 108 },
        { month: '6月', revenue: 108.3, cost: 87.5, profit: 20.8, roi: 23.8, txs: 105 },
        { month: '7月', revenue: 115.7, cost: 93.2, profit: 22.5, roi: 24.1, txs: 112 },
        { month: '8月', revenue: 118.4, cost: 95.5, profit: 22.9, roi: 24.0, txs: 115 },
        { month: '9月', revenue: 122.8, cost: 99.2, profit: 23.6, roi: 23.8, txs: 118 },
        { month: '10月', revenue: 128.5, cost: 103.6, profit: 24.9, roi: 24.0, txs: 122 },
        { month: '11月', revenue: 135.2, cost: 108.8, profit: 26.4, roi: 24.3, txs: 128 },
        { month: '12月', revenue: 141.9, cost: 114.2, profit: 27.7, roi: 24.3, txs: 134 },
    ];

    // Aggregating actual inventory data for category distribution
    const categoryDist = inventory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + (item.marketPrice * item.quantity);
        return acc;
    }, {} as Record<string, number>);
    
    const pieData = Object.keys(categoryDist).map(key => ({
        name: key,
        value: categoryDist[key]
    }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">数据报表</h2>
            <div className="flex space-x-2">
                <button className="px-3 py-1.5 bg-white border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50"><Calendar size={14} className="inline mr-1"/> 近一年</button>
                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"><Download size={14} className="inline mr-1"/> 导出报表</button>
            </div>
         </div>

         {/* Summary Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="年度总收益" value="¥12.85M" icon={DollarSign} trend="15.2% 较去年" trendUp={true} colorClass="bg-white" iconBgClass="bg-blue-50 text-blue-600" />
            <StatCard title="年度净利润" value="¥2.75M" icon={TrendingUp} trend="18.7% 较去年" trendUp={true} colorClass="bg-white" iconBgClass="bg-green-50 text-green-600" />
            <StatCard title="年度ROI" value="21.4%" icon={Percent} trend="2.8% 较去年" trendUp={true} colorClass="bg-white" iconBgClass="bg-amber-50 text-amber-600" />
            <StatCard title="交易总数" value="1,248" icon={Package} trend="12.3% 较去年" trendUp={true} colorClass="bg-white" iconBgClass="bg-purple-50 text-purple-600" />
         </div>

         {/* Main Charts */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">年度盈利曲线</h3>
                    <div className="flex space-x-1 text-xs">
                        <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">月度</span>
                        <span className="px-2 py-1 hover:bg-slate-50 rounded text-slate-500 cursor-pointer">季度</span>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                            <YAxis tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                            <Tooltip />
                            <Legend iconType="circle" />
                            <Bar dataKey="profit" name="净利润" fill="#10b981" barSize={20} radius={[4,4,0,0]} />
                            <Line type="monotone" dataKey="revenue" name="总收益" stroke="#6366f1" strokeWidth={2} dot={{r:4}} />
                            <Line type="monotone" dataKey="cost" name="总成本" stroke="#ef4444" strokeWidth={2} dot={{r:4}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">年度ROI趋势</h3>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize: 12}}/>
                            <YAxis domain={[0, 30]} tickLine={false} axisLine={false} tick={{fontSize: 12}} unit="%"/>
                            <Tooltip />
                            <Area type="monotone" dataKey="roi" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRoi)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
         </div>
         
         {/* Distribution Charts */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <h3 className="font-bold text-slate-800 mb-6">商品分类销售占比</h3>
                 <div className="h-64 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `¥${Number(value).toLocaleString()}`} />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <h3 className="font-bold text-slate-800 mb-6">渠道销售占比</h3>
                 <div className="h-64 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={[{name: '线上渠道', value: 75}, {name: '线下渠道', value: 25}]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                <Cell fill="#10b981" />
                                <Cell fill="#3b82f6" />
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
             </div>
         </div>

         {/* Detailed Table */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800">月度详细数据报表</div>
             <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-slate-200">
                     <thead className="bg-slate-50">
                         <tr>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">月份</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">总收益(万元)</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">总成本(万元)</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">净利润(万元)</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ROI</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">交易数</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">同比增长</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-200">
                         {monthlyData.map((row, i) => (
                             <tr key={i} className="hover:bg-slate-50">
                                 <td className="px-6 py-4 text-sm font-medium text-slate-900">2023年{row.month}</td>
                                 <td className="px-6 py-4 text-sm text-slate-500">{row.revenue}</td>
                                 <td className="px-6 py-4 text-sm text-slate-500">{row.cost}</td>
                                 <td className="px-6 py-4 text-sm text-slate-900 font-bold">{row.profit}</td>
                                 <td className="px-6 py-4 text-sm text-indigo-600">{row.roi}%</td>
                                 <td className="px-6 py-4 text-sm text-slate-500">{row.txs}</td>
                                 <td className="px-6 py-4 text-sm text-green-600">+{(10 + Math.random()*10).toFixed(1)}%</td>
                             </tr>
                         ))}
                         <tr className="bg-slate-50 font-bold">
                             <td className="px-6 py-4 text-sm">年度总计</td>
                             <td className="px-6 py-4 text-sm">1,285.0</td>
                             <td className="px-6 py-4 text-sm">1,010.0</td>
                             <td className="px-6 py-4 text-sm">275.0</td>
                             <td className="px-6 py-4 text-sm">27.2%</td>
                             <td className="px-6 py-4 text-sm">1,248</td>
                             <td className="px-6 py-4 text-sm">+18.7%</td>
                         </tr>
                     </tbody>
                 </table>
             </div>
         </div>
         
         <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
             <h3 className="font-bold text-slate-900 mb-4">趋势分析</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                     <h4 className="font-bold text-slate-700 mb-2">销售趋势分析</h4>
                     <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                         <li>年度销售额整体呈上升趋势，环比增长稳定</li>
                         <li>第二季度销售额增长放缓，可能受季节性因素影响</li>
                         <li>第四季度销售额增长最快，同比增长超过20%</li>
                         <li>电子产品和家居用品是增长最快的品类</li>
                     </ul>
                 </div>
                 <div>
                     <h4 className="font-bold text-slate-700 mb-2">ROI趋势分析</h4>
                     <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                         <li>年度ROI整体保持在24%左右，波动较小</li>
                         <li>第一季度ROI最高，达到25.9%</li>
                         <li>第三季度ROI略有下降，主要受媒体成本上涨影响</li>
                         <li>线上渠道ROI高于线下渠道，尤其是直播电商渠道</li>
                     </ul>
                 </div>
             </div>
         </div>
      </div>
    );
  };
  
  const SettingsPage = () => {
    const handleResetData = () => {
        if(window.confirm("警告：这将清空所有本地存储的数据并恢复到初始演示状态。确定要继续吗？")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-slate-900">系统设置</h2>
        
        <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-slate-900">库存预警阈值</h3>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                设置库存数量的警报线，当商品数量低于此值时系统会发出警告。
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700">
                  低库存阈值
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => setSettings({...settings, lowStockThreshold: parseInt(e.target.value)})}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-slate-700">
                  缺货阈值
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={settings.outOfStockThreshold}
                    onChange={(e) => setSettings({...settings, outOfStockThreshold: parseInt(e.target.value)})}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 text-right sm:px-6">
            <button
              onClick={() => applySettings(settings)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              保存设置
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-red-200 overflow-hidden">
             <div className="px-4 py-5 sm:p-6">
                 <h3 className="text-lg leading-6 font-medium text-red-600">危险区域</h3>
                 <div className="mt-2 max-w-xl text-sm text-slate-500">
                     <p>重置所有数据将清除本地存储的所有修改，恢复到应用程序的初始演示状态。</p>
                 </div>
                 <div className="mt-5">
                     <button
                         type="button"
                         onClick={handleResetData}
                         className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                     >
                         重置所有数据
                     </button>
                 </div>
             </div>
        </div>
      </div>
    );
  };


  const FinancePage = () => {
    // Selection State
    const [simInvId, setSimInvId] = useState('');
    const [simMedId, setSimMedId] = useState('');
    const [simChanId, setSimChanId] = useState('');
    
    // Parameter State
    const [simPrice, setSimPrice] = useState(0);
    const [simQty, setSimQty] = useState(100);
    const [simMediaCost, setSimMediaCost] = useState(5000);
    
    // Calculation Results
    const [calculatedMetrics, setCalculatedMetrics] = useState({
      totalRevenue: 0,
      totalCost: 0,
      profit: 0,
      margin: 0,
      breakEvenQty: 0
    });

    // Chart Data
    const [breakEvenData, setBreakEvenData] = useState<any[]>([]);
    const [costPieData, setCostPieData] = useState<any[]>([]);

    // AI Analysis State
    const [aiResult, setSimResult] = useState<FinancialSimulationResult | null>(null);
    const [loading, setLoading] = useState(false);

    // --- REAL-TIME CALCULATION EFFECT ---
    useEffect(() => {
        const inv = inventory.find(i => i.id === simInvId);
        const med = media.find(m => m.id === simMedId);
        const chan = channels.find(c => c.id === simChanId);

        if (!inv || !med || !chan) {
            setBreakEvenData([]);
            setCostPieData([]);
            setCalculatedMetrics({ totalRevenue: 0, totalCost: 0, profit: 0, margin: 0, breakEvenQty: 0 });
            return;
        }

        // 1. Core Metrics
        const revenue = simPrice * simQty;
        const inventoryCostTotal = (inv.costPrice || 0) * simQty;
        const channelFeeTotal = revenue * chan.commissionRate;
        const totalCost = inventoryCostTotal + simMediaCost + channelFeeTotal;
        const profit = revenue - totalCost;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

        // 2. Break-even Point
        const unitVariableCost = (inv.costPrice || 0) + (simPrice * chan.commissionRate);
        const contributionMargin = simPrice - unitVariableCost;
        let breakEvenQ = 0;
        if (contributionMargin > 0) {
            breakEvenQ = Math.ceil(simMediaCost / contributionMargin);
        } else {
            breakEvenQ = 999999;
        }

        setCalculatedMetrics({
            totalRevenue: revenue,
            totalCost: totalCost,
            profit: profit,
            margin: margin,
            breakEvenQty: breakEvenQ
        });

        // 3. Generate Break-even Chart Data
        const maxQ = Math.max(simQty * 1.5, breakEvenQ * 1.2, 50);
        const step = maxQ / 10;
        const newChartData = [];
        for (let q = 0; q <= maxQ; q += step) {
             const rev = simPrice * q;
             const cost = simMediaCost + ((inv.costPrice || 0) * q) + (simPrice * q * chan.commissionRate);
             newChartData.push({
                 quantity: Math.round(q),
                 revenue: rev,
                 cost: cost,
             });
        }
        setBreakEvenData(newChartData);

        // 4. Generate Cost Structure Pie Data
        const pieData = [
            { name: '商品成本 (Inventory)', value: inventoryCostTotal, color: '#64748b' }, 
            { name: '媒体投放 (Media)', value: simMediaCost, color: '#f59e0b' }, 
            { name: '渠道佣金 (Channel)', value: channelFeeTotal, color: '#6366f1' },
        ];
        setCostPieData(pieData.filter(d => d.value > 0));

    }, [simInvId, simMedId, simChanId, simPrice, simQty, simMediaCost, inventory, media, channels]);

    // AI Analysis Handler
    const handleRunAIAnalysis = async () => {
      const inv = inventory.find(i => i.id === simInvId);
      const med = media.find(m => m.id === simMedId);
      const chan = channels.find(c => c.id === simChanId);
      if (!inv || !med || !chan) {
        addNotification("无法分析", "请先完善所有参数设置", "warning");
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
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">财务测算 (Financial Simulation)</h2>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100 flex items-center">
                <Activity size={12} className="mr-1"/> 实时动态模型
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Inputs (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-5 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800">模型参数设置</h3>
                <Settings size={16} className="text-slate-400"/>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">1. 核心资源</label>
                    <div className="space-y-3">
                        <select className="w-full border-slate-300 rounded-md text-sm" value={simInvId} onChange={e => {
                            setSimInvId(e.target.value);
                            const item = inventory.find(i => i.id === e.target.value);
                            if(item && simPrice === 0) setSimPrice(item.marketPrice * 0.6);
                        }}>
                            <option value="">选择商品...</option>
                            {inventory.map(i => <option key={i.id} value={i.id}>{i.name} (成本: ¥{i.costPrice})</option>)}
                        </select>
                        <select className="w-full border-slate-300 rounded-md text-sm" value={simMedId} onChange={e => setSimMedId(e.target.value)}>
                            <option value="">选择媒体...</option>
                            {media.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <select className="w-full border-slate-300 rounded-md text-sm" value={simChanId} onChange={e => setSimChanId(e.target.value)}>
                            <option value="">选择渠道...</option>
                            {channels.map(c => <option key={c.id} value={c.id}>{c.name} (佣金: {(c.commissionRate*100).toFixed(0)}%)</option>)}
                        </select>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-50">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">2. 销售变量</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-600 mb-1">销售单价 (¥)</label>
                            <div className="relative">
                                <span className="absolute left-2 top-2 text-slate-400 text-xs">¥</span>
                                <input 
                                    type="number" 
                                    className="w-full pl-6 border-slate-300 rounded-md text-sm font-medium text-indigo-600" 
                                    value={simPrice} 
                                    onChange={e => setSimPrice(parseFloat(e.target.value) || 0)} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-600 mb-1">媒体预算 (¥)</label>
                            <input 
                                type="number" 
                                className="w-full border-slate-300 rounded-md text-sm" 
                                value={simMediaCost} 
                                onChange={e => setSimMediaCost(parseFloat(e.target.value) || 0)} 
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                            <label className="text-slate-600">预计销量</label>
                            <span className="font-bold text-indigo-600">{simQty} 件</span>
                        </div>
                        <input 
                            type="range" 
                            min="10" 
                            max="5000" 
                            step="10"
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            value={simQty}
                            onChange={e => setSimQty(parseInt(e.target.value))}
                        />
                         <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>10</span>
                            <span>2500</span>
                            <span>5000</span>
                        </div>
                    </div>
                </div>
            </div>

            <button 
              onClick={handleRunAIAnalysis}
              disabled={loading || !simInvId}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 font-bold flex justify-center items-center"
            >
              {loading ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : <Award className="mr-2 h-4 w-4" />}
              {loading ? "AI 分析中..." : "获取 AI 战略评估"}
            </button>
          </div>

          {/* RIGHT COLUMN: Visualization (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
             
             {/* Key Metrics Row */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className={`p-4 rounded-xl border flex flex-col items-center justify-center shadow-sm transition-colors ${calculatedMetrics.profit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                     <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">预计净利润</span>
                     <span className={`text-2xl font-bold mt-1 ${calculatedMetrics.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                         ¥{calculatedMetrics.profit.toLocaleString(undefined, {maximumFractionDigits: 0})}
                     </span>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                     <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">盈亏平衡销量</span>
                     <div className="flex items-center mt-1">
                        <Target className="h-4 w-4 text-amber-500 mr-2" />
                        <span className="text-2xl font-bold text-slate-800">
                            {calculatedMetrics.breakEvenQty > 99999 ? '∞' : calculatedMetrics.breakEvenQty.toLocaleString()}
                        </span>
                     </div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                     <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">利润率 (Margin)</span>
                     <span className={`text-2xl font-bold mt-1 ${calculatedMetrics.margin >= 20 ? 'text-indigo-600' : 'text-slate-700'}`}>
                         {calculatedMetrics.margin.toFixed(1)}%
                     </span>
                 </div>
             </div>

             {/* Dynamic Charts Area */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
                 {/* Chart 1: Break-even */}
                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                     <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                         <LineChartIcon className="mr-2 h-4 w-4 text-blue-500" /> 盈亏平衡分析 (Break-even)
                     </h4>
                     {breakEvenData.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={breakEvenData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                 <XAxis 
                                    dataKey="quantity" 
                                    label={{ value: '销量', position: 'insideBottomRight', offset: -5, fontSize: 10 }} 
                                    tick={{fontSize: 10}}
                                 />
                                 <YAxis tickFormatter={(val) => `¥${val/1000}k`} tick={{fontSize: 10}} width={40}/>
                                 <Tooltip 
                                    formatter={(value: number) => `¥${value.toLocaleString()}`}
                                    labelFormatter={(label) => `销量: ${label}`}
                                 />
                                 <Legend wrapperStyle={{fontSize: '12px'}}/>
                                 <Line type="monotone" dataKey="revenue" stroke="#10b981" name="总营收" strokeWidth={2} dot={false} />
                                 <Line type="monotone" dataKey="cost" stroke="#ef4444" name="总成本" strokeWidth={2} dot={false} />
                                 {calculatedMetrics.breakEvenQty < 10000 && (
                                     <ReferenceLine x={calculatedMetrics.breakEvenQty} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'BEP', fill: '#f59e0b', fontSize: 10 }} />
                                 )}
                             </LineChart>
                         </ResponsiveContainer>
                     ) : (
                         <div className="flex-1 flex items-center justify-center text-slate-300 text-sm">暂无数据</div>
                     )}
                 </div>

                 {/* Chart 2: Cost Structure */}
                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                     <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                         <PieChartIcon className="mr-2 h-4 w-4 text-purple-500" /> 成本结构 (Cost Breakdown)
                     </h4>
                     {costPieData.length > 0 ? (
                        <div className="flex items-center h-full">
                             <ResponsiveContainer width="55%" height="100%">
                                 <PieChart>
                                     <Pie
                                         data={costPieData}
                                         cx="50%"
                                         cy="50%"
                                         innerRadius={40}
                                         outerRadius={60}
                                         paddingAngle={5}
                                         dataKey="value"
                                     >
                                         {costPieData.map((entry, index) => (
                                             <Cell key={`cell-${index}`} fill={entry.color} />
                                         ))}
                                     </Pie>
                                     <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                                 </PieChart>
                             </ResponsiveContainer>
                             <div className="w-[45%] pl-2">
                                 {costPieData.map((item, idx) => (
                                     <div key={idx} className="mb-2">
                                         <div className="flex items-center text-xs text-slate-500 mb-0.5">
                                             <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: item.color}}></span>
                                             {item.name}
                                         </div>
                                         <div className="text-sm font-bold text-slate-800 ml-4">¥{item.value.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                                     </div>
                                 ))}
                                 <div className="mt-4 pt-2 border-t border-slate-100">
                                     <div className="text-xs text-slate-400">总成本</div>
                                     <div className="text-base font-bold text-slate-900">¥{calculatedMetrics.totalCost.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                                 </div>
                             </div>
                        </div>
                     ) : (
                         <div className="flex-1 flex items-center justify-center text-slate-300 text-sm">暂无数据</div>
                     )}
                 </div>
             </div>

             {/* AI Results Section */}
             {aiResult && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm animate-fade-in-up">
                    <div className="flex items-start">
                        <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
                             <Award className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                             <h4 className="text-lg font-bold text-indigo-900 mb-1">AI 战略评估报告</h4>
                             <div className="flex items-center space-x-4 mb-3">
                                 <span className="text-xs font-medium px-2 py-0.5 bg-white rounded border border-indigo-100 text-indigo-600">
                                     战略匹配度: <b>{aiResult.strategicFitScore}/100</b>
                                 </span>
                                 <span className={`text-xs font-medium px-2 py-0.5 bg-white rounded border ${aiResult.riskScore > 50 ? 'border-red-100 text-red-600' : 'border-green-100 text-green-600'}`}>
                                     风险指数: <b>{aiResult.riskScore}/100</b>
                                 </span>
                             </div>
                             <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                 {aiResult.recommendation}
                             </p>
                             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                 {aiResult.reasoning.map((r, i) => (
                                     <div key={i} className="flex items-start text-xs text-slate-600 bg-white/60 p-2 rounded">
                                         <CheckCircle size={12} className="mr-2 mt-0.5 text-indigo-400 flex-shrink-0" />
                                         {r}
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>
             )}
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
      
      <ToastContainer notifications={notifications.filter(n => !n.read)} removeToast={removeToast} />

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
