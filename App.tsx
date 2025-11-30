
import React, { useState, useEffect } from 'react';
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
  ArrowRight, Equal, Percent, Activity, Calendar, Database
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { InventoryItem, InventoryStatus, AIAnalysisResult, MediaResource, SalesChannel, AppSettings, Notification } from './types';
import { analyzePricing, assessRisk } from './services/geminiService';

// --- MOCK DATA ---
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: '讯飞X10语音文本', brand: '科大讯飞', category: '电子产品', quantity: 1085, marketPrice: 4999, lowestPrice: 4299, costPrice: 2000, productUrl: 'https://www.jd.com', status: InventoryStatus.IN_STOCK, lastUpdated: '2023-10-25' },
  { id: '2', name: '科大讯飞 (样品) X3', brand: '科大讯飞', category: '家用电器', quantity: 2788, marketPrice: 1973, lowestPrice: 1680, costPrice: 800, productUrl: '', status: InventoryStatus.IN_STOCK, lastUpdated: '2023-10-24' },
  { id: '3', name: '读书郎学习P6', brand: '读书郎', category: '电子产品', quantity: 1988, marketPrice: 600, lowestPrice: 499, costPrice: 250, productUrl: 'https://www.taobao.com', status: InventoryStatus.IN_STOCK, lastUpdated: '2023-10-26' },
  { id: '4', name: '中老年补钙高蛋白', brand: '诺崔特', category: '保健品', quantity: 526, marketPrice: 4894, lowestPrice: 3500, costPrice: 1200, productUrl: '', status: InventoryStatus.LOW_STOCK, lastUpdated: '2023-10-20' },
  { id: '5', name: '燕京至简苏打水 (渠道回收)', brand: '燕京', category: '食品饮料', quantity: 42, marketPrice: 18775, lowestPrice: 15000, costPrice: 8000, productUrl: '', status: InventoryStatus.OUT_OF_STOCK, lastUpdated: '2023-10-22' },
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
];

const REPORT_DATA = [
  { month: '1月', revenue: 98.5, cost: 78.2, profit: 20.3, roi: 25.9, count: 92, growth: 15.2 },
  { month: '2月', revenue: 87.6, cost: 70.5, profit: 17.1, roi: 24.3, count: 85, growth: 12.8 },
  { month: '3月', revenue: 105.2, cost: 84.6, profit: 20.6, roi: 24.3, count: 102, growth: 18.5 },
  { month: '4月', revenue: 96.8, cost: 78.2, profit: 18.6, roi: 23.8, count: 95, growth: 10.2 },
  { month: '5月', revenue: 112.5, cost: 90.8, profit: 21.7, roi: 23.9, count: 108, growth: 16.7 },
  { month: '6月', revenue: 108.3, cost: 87.5, profit: 20.8, roi: 23.8, count: 105, growth: 14.3 },
  { month: '7月', revenue: 115.7, cost: 93.2, profit: 22.5, roi: 24.1, count: 112, growth: 17.8 },
  { month: '8月', revenue: 118.4, cost: 95.5, profit: 22.9, roi: 24.0, count: 115, growth: 18.2 },
  { month: '9月', revenue: 122.8, cost: 99.2, profit: 23.6, roi: 23.8, count: 118, growth: 19.5 },
  { month: '10月', revenue: 128.5, cost: 103.6, profit: 24.9, roi: 24.0, count: 122, growth: 20.8 },
  { month: '11月', revenue: 135.2, cost: 108.8, profit: 26.4, roi: 24.3, count: 128, growth: 22.3 },
  { month: '12月', revenue: 141.9, cost: 114.2, profit: 27.7, roi: 24.3, count: 134, growth: 23.5 },
];

const CATEGORY_DIST_DATA = [
  { name: '电子产品', value: 450, color: '#4f46e5' },
  { name: '家用电器', value: 320, color: '#06b6d4' },
  { name: '食品饮料', value: 210, color: '#f59e0b' },
  { name: '保健品', value: 150, color: '#ec4899' },
  { name: '其他', value: 118, color: '#64748b' },
];

const CHANNEL_DIST_DATA = [
  { name: '线上渠道', value: 850, color: '#10b981' },
  { name: '线下渠道', value: 398, color: '#3b82f6' },
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
  SETTINGS: 'barterflow_settings'
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
  
  // New States for Notifications (No need to persist typically)
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
  // Media Filters
  const [medFilter, setMedFilter] = useState({ name: '', type: '全部类型', status: '全部状态', year: '全部年限' });
  // Channel Filters
  const [chnFilter, setChnFilter] = useState({ name: '', type: '全部类型', status: '全部状态', category: '全部品类' });
  
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
        // Escape quotes and wrap in quotes to handle commas
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

  // Helper to re-evaluate item status based on current settings
  const evaluateStatus = (quantity: number, currentSettings: AppSettings): InventoryStatus => {
    if (quantity <= currentSettings.outOfStockThreshold) return InventoryStatus.OUT_OF_STOCK;
    if (quantity <= currentSettings.lowStockThreshold) return InventoryStatus.LOW_STOCK;
    return InventoryStatus.IN_STOCK;
  };

  // Update Inventory Helper
  const updateInventoryQuantity = (id: string, change: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id !== id) return item;

      const newQuantity = Math.max(0, item.quantity + change);
      const newStatus = evaluateStatus(newQuantity, settings);
      
      // Check for alerts
      if (item.status !== newStatus) {
        if (newStatus === InventoryStatus.LOW_STOCK) {
          addNotification(
            "库存预警", 
            `商品 "${item.name}" 库存已降至 ${newQuantity}，低于预警阈值 (${settings.lowStockThreshold})。`, 
            'warning'
          );
        } else if (newStatus === InventoryStatus.OUT_OF_STOCK) {
          addNotification(
            "缺货警告", 
            `商品 "${item.name}" 已售罄！`, 
            'error'
          );
        }
      }

      return { ...item, quantity: newQuantity, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
    }));
  };

  // Re-evaluate all items when settings change
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
      // Update existing
      setMedia(prev => prev.map(item => item.id === editingMedia.id ? { ...mediaData, id: item.id } : item));
      addNotification("媒体更新", `媒体 "${mediaData.name}" 信息已更新。`, "success");
    } else {
      // Add new
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
        else if (invFilter.status === '库存偏低') matchStatus = item.status === InventoryStatus.LOW_STOCK;
        else if (invFilter.status === '缺货') matchStatus = item.status === InventoryStatus.OUT_OF_STOCK;
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
      }

      let matchYear = true;
      if (medFilter.year !== '全部年限') {
        const start = new Date(item.contractStart);
        const end = new Date(item.contractEnd);
        const diffYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
        if (medFilter.year === '1年内') matchYear = diffYears <= 1;
        else if (medFilter.year === '1-3年') matchYear = diffYears > 1 && diffYears <= 3;
      }

      return matchName && matchType && matchStatus && matchYear;
    });
  };

  const getFilteredChannels = () => {
    return channels.filter(item => {
      const matchName = item.name.toLowerCase().includes(chnFilter.name.toLowerCase());
      const matchCategory = chnFilter.category === '全部品类' || item.applicableCategories.includes(chnFilter.category);
      
      let matchType = true;
      if (chnFilter.type !== '全部类型') {
        if (chnFilter.type === '线上渠道') matchType = item.type === 'Online';
        else if (chnFilter.type === '线下渠道') matchType = item.type === 'Offline';
      }

      let matchStatus = true;
      if (chnFilter.status !== '全部状态') {
        if (chnFilter.status === '活跃') matchStatus = item.status === 'active';
        else if (chnFilter.status === '待接入') matchStatus = item.status === 'pending';
      }

      return matchName && matchType && matchStatus && matchCategory;
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
    // Helper to get category icon
    const getIcon = (category: string) => {
      switch(category) {
        case '电子产品': return Smartphone;
        case '家用电器': return Home;
        case '保健品': return BriefcaseMedical;
        case '食品饮料': return Droplets;
        default: return Package;
      }
    };
    
    // Dynamic Stats Calculation
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

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">库存管理</h2>
          <div className="flex space-x-3">
            <button 
              onClick={openAddInventoryModal}
              className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" /> 添加库存
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" /> 筛选
            </button>
            <button 
              onClick={handleExportInventory}
              className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> 导出
            </button>
          </div>
        </div>

        {/* Stats Cards - Dynamic Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="总商品数" 
            value={totalCount.toLocaleString()} 
            icon={Package} 
            trend="Live Data" 
            trendUp={true} 
            iconBgClass="bg-blue-100" 
            iconColorClass="text-blue-600"
          />
          <StatCard 
            title="库存总值" 
            value={formatValue(totalInventoryValue)} 
            icon={DollarSign} 
            trend="Live Data" 
            trendUp={true}
            iconBgClass="bg-green-100" 
            iconColorClass="text-green-600"
          />
          <StatCard 
            title="库存预警 (Low Stock)" 
            value={lowStockCount} 
            icon={Clock} 
            trend="需要关注" 
            trendUp={false}
            iconBgClass="bg-amber-100" 
            iconColorClass="text-amber-600"
          />
          <StatCard 
            title="缺货/下架 (Out of Stock)" 
            value={outStockCount} 
            icon={AlertTriangle} 
            trend="补货建议" 
            trendUp={false}
            iconBgClass="bg-red-100" 
            iconColorClass="text-red-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
             <div className="space-y-1">
                <label className="text-xs text-slate-500">商品名称</label>
                <input 
                  type="text" 
                  value={invFilter.name}
                  onChange={(e) => setInvFilter({...invFilter, name: e.target.value})}
                  placeholder="搜索商品名称" 
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500">商品分类</label>
                <div className="relative">
                  <select 
                    value={invFilter.category}
                    onChange={(e) => setInvFilter({...invFilter, category: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
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
                <label className="text-xs text-slate-500">库存状态</label>
                <div className="relative">
                  <select 
                    value={invFilter.status}
                    onChange={(e) => setInvFilter({...invFilter, status: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                  >
                    <option>全部状态</option>
                    <option>库存充足</option>
                    <option>库存偏低</option>
                    <option>缺货</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
             </div>
             <div className="flex space-x-2">
                <div className="space-y-1 flex-1">
                  <label className="text-xs text-slate-500">品牌</label>
                  <div className="relative">
                    <select 
                      value={invFilter.brand}
                      onChange={(e) => setInvFilter({...invFilter, brand: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
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
                <div className="flex space-x-2 items-end">
                    <button 
                      onClick={() => setInvFilter({ name: '', category: '全部分类', status: '全部状态', brand: '全部品牌' })}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm rounded-md hover:bg-slate-50"
                    >
                      重置
                    </button>
                    <button className="px-4 py-2 bg-indigo-700 text-white text-sm rounded-md hover:bg-indigo-800">搜索</button>
                </div>
             </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium w-12"><input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /></th>
                  <th className="px-6 py-4 font-medium">商品图片</th>
                  <th className="px-6 py-4 font-medium">商品名称</th>
                  <th className="px-6 py-4 font-medium">分类</th>
                  <th className="px-6 py-4 font-medium">品牌</th>
                  <th className="px-6 py-4 font-medium">数量</th>
                  <th className="px-6 py-4 font-medium">单价</th>
                  <th className="px-6 py-4 font-medium text-indigo-700">最低价</th>
                  <th className="px-6 py-4 font-medium">总价值</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-slate-500">
                      没有找到符合条件的商品
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => {
                  const IconComponent = getIcon(item.category);
                  const statusLabel = 
                    item.status === InventoryStatus.IN_STOCK ? '库存充足' : 
                    item.status === InventoryStatus.LOW_STOCK ? '库存偏低' : 
                    item.status === InventoryStatus.OUT_OF_STOCK ? '缺货' : '已下架';
                  const statusClass = 
                    item.status === InventoryStatus.IN_STOCK ? 'bg-green-100 text-green-800' : 
                    item.status === InventoryStatus.LOW_STOCK ? 'bg-amber-100 text-amber-800' : 
                    'bg-red-100 text-red-800';
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center text-slate-500">
                          <IconComponent className="h-5 w-5" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center">
                          {item.name}
                          {item.productUrl && (
                            <a 
                              href={item.productUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-indigo-400 hover:text-indigo-600"
                              title="查看产品链接"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 text-slate-600">{item.brand}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{item.quantity}</td>
                      <td className="px-6 py-4 text-slate-900">¥{item.marketPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-indigo-600">
                        {item.lowestPrice ? `¥${item.lowestPrice.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">¥{(item.marketPrice * item.quantity).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <button 
                            onClick={() => openEditInventoryModal(item)}
                            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <Edit2 className="h-4 w-4 mr-1" /> 编辑
                          </button>
                          <button 
                            onClick={() => handleDeleteInventory(item.id, item.name)}
                            className="flex items-center text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                            title="删除商品"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> 删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const MediaPage = () => {
    const filteredList = getFilteredMedia();

    return (
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">媒体管理</h2>
          <div className="flex space-x-3">
            <button 
              onClick={openAddMediaModal}
              className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" /> 添加媒体
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" /> 筛选
            </button>
            <button 
              onClick={handleExportMedia}
              className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> 导出
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="总媒体数" 
            value={media.length} 
            icon={Monitor} 
            trend={`${(media.length * 1.5).toFixed(1)}% 较上月`}
            trendUp={true} 
            iconBgClass="bg-blue-100" 
            iconColorClass="text-blue-600"
          />
          <StatCard 
            title="活跃媒体" 
            value={media.filter(m => m.status === 'active').length} 
            icon={CheckCircle} 
            trend="3.8% 较上月" 
            trendUp={true} 
            iconBgClass="bg-green-100" 
            iconColorClass="text-green-600"
          />
          <StatCard 
            title="待审核媒体" 
            value={media.filter(m => m.status === 'pending').length} 
            icon={Clock} 
            trend="2.1% 较上月" 
            trendUp={false}
            iconBgClass="bg-amber-100" 
            iconColorClass="text-amber-600"
          />
          <StatCard 
            title="合同到期" 
            value={media.filter(m => m.status === 'expiring' || m.status === 'expired').length} 
            icon={AlertTriangle} 
            trend="1.5% 较上月" 
            trendUp={false}
            iconBgClass="bg-red-100" 
            iconColorClass="text-red-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
             <div className="space-y-1">
                <label className="text-xs text-slate-500">媒体名称</label>
                <input 
                  type="text" 
                  value={medFilter.name}
                  onChange={(e) => setMedFilter({...medFilter, name: e.target.value})}
                  placeholder="搜索媒体名称" 
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500">媒体类型</label>
                <div className="relative">
                  <select 
                    value={medFilter.type}
                    onChange={(e) => setMedFilter({...medFilter, type: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                  >
                    <option>全部类型</option>
                    <option>户外媒体</option>
                    <option>数字媒体</option>
                    <option>电视媒体</option>
                    <option>平面媒体</option>
                    <option>社区媒体</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500">媒体状态</label>
                <div className="relative">
                  <select 
                    value={medFilter.status}
                    onChange={(e) => setMedFilter({...medFilter, status: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                  >
                    <option>全部状态</option>
                    <option>活跃</option>
                    <option>待审核</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
             </div>
             <div className="flex space-x-2">
                <div className="space-y-1 flex-1">
                  <label className="text-xs text-slate-500">合作年限</label>
                  <div className="relative">
                    <select 
                      value={medFilter.year}
                      onChange={(e) => setMedFilter({...medFilter, year: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                    >
                      <option>全部年限</option>
                      <option>1年内</option>
                      <option>1-3年</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex space-x-2 items-end">
                    <button 
                      onClick={() => setMedFilter({ name: '', type: '全部类型', status: '全部状态', year: '全部年限' })}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm rounded-md hover:bg-slate-50"
                    >
                      重置
                    </button>
                    <button className="px-4 py-2 bg-indigo-700 text-white text-sm rounded-md hover:bg-indigo-800">搜索</button>
                </div>
             </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-8 text-center"><input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /></th>
                  <th className="px-4 py-3 font-medium">媒体名称</th>
                  <th className="px-4 py-3 font-medium">媒体类型</th>
                  <th className="px-4 py-3 font-medium">广告形式</th>
                  <th className="px-4 py-3 font-medium">覆盖范围</th>
                  <th className="px-4 py-3 font-medium">刊例价格</th>
                  <th className="px-4 py-3 font-medium">折扣</th>
                  <th className="px-4 py-3 font-medium">合同期限</th>
                  <th className="px-4 py-3 font-medium text-center">状态</th>
                  <th className="px-4 py-3 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Group Header Example - Static for now, can be dynamic later */}
                {filteredList.length > 0 && (
                  <tr className="bg-slate-50/50">
                    <td colSpan={10} className="px-4 py-2 text-xs font-semibold text-slate-500 pl-14">
                      全部媒体资源
                    </td>
                  </tr>
                )}
                
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-slate-500">
                      没有找到符合条件的媒体
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-center">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-4 text-slate-600">{item.type}</td>
                    <td className="px-4 py-4 text-slate-600">{item.format}</td>
                    <td className="px-4 py-4 text-slate-600 max-w-xs truncate" title={item.location}>{item.location}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{item.rate}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">{(item.discount * 100).toFixed(0)}%</td>
                    <td className="px-4 py-4 text-xs text-slate-500 font-mono">
                      {item.contractStart} 至 {item.contractEnd}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${item.status === 'active' ? 'bg-green-100 text-green-800' : 
                          item.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          item.status === 'expiring' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-800'}`}>
                        {item.status === 'active' ? '活跃' : 
                         item.status === 'pending' ? '待审核' : 
                         item.status === 'expiring' ? '即将到期' : '已过期'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-3">
                         <button 
                          onClick={() => openEditMediaModal(item)}
                          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                         >
                           <Edit2 className="h-4 w-4 mr-1" /> 编辑
                         </button>
                         <button 
                          onClick={() => handleDeleteMedia(item.id, item.name)}
                          className="flex items-center text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          title="删除媒体"
                         >
                           <Trash2 className="h-4 w-4 mr-1" /> 删除
                         </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">显示 {filteredList.length > 0 ? 1 : 0} 到 {filteredList.length} 条，共 {filteredList.length} 条</span>
              <div className="flex space-x-1">
                  <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-500 disabled:opacity-50">上一页</button>
                  <button className="px-3 py-1 border border-slate-300 rounded text-sm bg-indigo-50 text-indigo-600 font-medium">1</button>
                  <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-500">下一页</button>
              </div>
          </div>
        </div>
      </div>
    );
  };

  const ChannelsPage = () => {
    const filteredList = getFilteredChannels();

    return (
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">渠道管理</h2>
          <div className="flex space-x-3">
            <button 
              onClick={openAddChannelModal}
              className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" /> 添加渠道
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" /> 筛选
            </button>
            <button 
              onClick={handleExportChannels}
              className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> 导出
            </button>
          </div>
        </div>

        {/* Stats Cards - Updated colors to match screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="总渠道数" 
            value={32} 
            icon={Users} // Using generic icon as screenshot icon is custom
            trend="8.5% 较上月"
            trendUp={true} 
            iconBgClass="bg-blue-100" 
            iconColorClass="text-blue-600"
          />
          <StatCard 
            title="线上渠道" 
            value={18} 
            icon={Globe} 
            trend="12.3% 较上月" 
            trendUp={true} 
            iconBgClass="bg-green-100" 
            iconColorClass="text-green-600"
          />
          <StatCard 
            title="线下渠道" 
            value={10} 
            icon={Store} 
            trend="4.2% 较上月" 
            trendUp={true}
            iconBgClass="bg-amber-100" 
            iconColorClass="text-amber-600"
          />
          <StatCard 
            title="特殊渠道" 
            value={4} 
            icon={Star} 
            trend="2.1% 较上月" 
            trendUp={true}
            iconBgClass="bg-purple-100" 
            iconColorClass="text-purple-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
             <div className="space-y-1">
                <label className="text-xs text-slate-500">渠道名称</label>
                <input 
                  type="text" 
                  value={chnFilter.name}
                  onChange={(e) => setChnFilter({...chnFilter, name: e.target.value})}
                  placeholder="搜索渠道名称" 
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500">渠道类型</label>
                <div className="relative">
                  <select 
                    value={chnFilter.type}
                    onChange={(e) => setChnFilter({...chnFilter, type: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                  >
                    <option>全部类型</option>
                    <option>线上渠道</option>
                    <option>线下渠道</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500">渠道状态</label>
                <div className="relative">
                  <select 
                    value={chnFilter.status}
                    onChange={(e) => setChnFilter({...chnFilter, status: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                  >
                    <option>全部状态</option>
                    <option>活跃</option>
                    <option>待接入</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
             </div>
             <div className="flex space-x-2">
                <div className="space-y-1 flex-1">
                  <label className="text-xs text-slate-500">适用品类</label>
                  <div className="relative">
                    <select 
                      value={chnFilter.category}
                      onChange={(e) => setChnFilter({...chnFilter, category: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                    >
                      <option>全部品类</option>
                      <option>服装鞋帽</option>
                      <option>美妆护肤</option>
                      <option>家居用品</option>
                      <option>日用百货</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex space-x-2 items-end">
                    <button 
                      onClick={() => setChnFilter({ name: '', type: '全部类型', status: '全部状态', category: '全部品类' })}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm rounded-md hover:bg-slate-50"
                    >
                      重置
                    </button>
                    <button className="px-4 py-2 bg-indigo-700 text-white text-sm rounded-md hover:bg-indigo-800">搜索</button>
                </div>
             </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
             <h3 className="text-base font-semibold text-slate-800">线上销售渠道</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-medium">渠道名称</th>
                  <th className="px-6 py-3 font-medium">子类型</th>
                  <th className="px-6 py-3 font-medium">特点</th>
                  <th className="px-6 py-3 font-medium">适用品类</th>
                  <th className="px-6 py-3 font-medium">优势</th>
                  <th className="px-6 py-3 font-medium text-center">状态</th>
                  <th className="px-6 py-3 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      没有找到符合条件的渠道
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-medium text-slate-900">{item.name}</td>
                    <td className="px-6 py-5 text-slate-600">{item.subType}</td>
                    <td className="px-6 py-5 text-slate-600 max-w-xs">{item.features}</td>
                    <td className="px-6 py-5 text-slate-600">{item.applicableCategories}</td>
                    <td className="px-6 py-5 text-slate-600">{item.pros}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${item.status === 'active' ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {item.status === 'active' ? '活跃' : '待接入'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center space-x-3">
                         <button 
                          onClick={() => openEditChannelModal(item)}
                          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                         >
                           <Edit2 className="h-4 w-4 mr-1" /> 编辑
                         </button>
                         {/* Link button removed for now to focus on Edit/Delete per request, or keep it icon only? I'll keep icon only for Link as it's secondary */}
                         <button 
                           className="text-green-500 hover:text-green-700"
                           title="Link/Connect"
                         >
                           <Link2 className="h-4 w-4" />
                         </button>
                         <button 
                          onClick={() => handleDeleteChannel(item.id, item.name)}
                          className="flex items-center text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          title="删除渠道"
                         >
                           <Trash2 className="h-4 w-4 mr-1" /> 删除
                         </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const FinancePage = () => {
    // State for selections
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [selectedMediaId, setSelectedMediaId] = useState<string>('');
    const [selectedChannelId, setSelectedChannelId] = useState<string>('');

    // State for inputs
    const [sellPrice, setSellPrice] = useState<number>(0);
    const [sellQuantity, setSellQuantity] = useState<number>(0);
    const [mediaCostOverride, setMediaCostOverride] = useState<number>(0);
    
    // Derived Objects
    const selectedItem = inventory.find(i => i.id === selectedItemId);
    const selectedMedia = media.find(m => m.id === selectedMediaId);
    const selectedChannel = channels.find(c => c.id === selectedChannelId);

    // Default effects when selection changes
    useEffect(() => {
        if(selectedItem) {
            setSellPrice(selectedItem.marketPrice);
            setSellQuantity(selectedItem.quantity); // Default to full stock
        }
    }, [selectedItemId]);

    useEffect(() => {
        if (selectedMedia) {
             // Try to parse rate
             const rateStr = selectedMedia.rate.replace(/[^0-9.]/g, '');
             const rate = parseFloat(rateStr) || 0;
             setMediaCostOverride(rate);
        }
    }, [selectedMediaId]);

    // --- CALCULATIONS ---
    // 1. Total Revenue
    const revenue = sellPrice * sellQuantity;

    // 2. Costs
    const costInventory = (selectedItem?.costPrice || 0) * sellQuantity;
    const costMedia = mediaCostOverride; // Simplified: assumes flat fee for campaign duration
    const costChannel = revenue * (selectedChannel?.commissionRate || 0);
    
    const totalCost = costInventory + costMedia + costChannel;
    
    // 3. Profit & ROI
    const netProfit = revenue - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    // Risk Analysis
    const getRiskLevel = (roiVal: number) => {
        if (roiVal < 10) return { label: '高风险 (High Risk)', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
        if (roiVal < 30) return { label: '中风险 (Medium Risk)', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' };
        return { label: '低风险 (Low Risk)', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
    };

    const risk = getRiskLevel(roi);

    // Chart Data
    const barData = [
        { name: 'Revenue', amount: revenue, fill: '#4f46e5' }, // Indigo
        { name: 'Cost', amount: totalCost, fill: '#ef4444' },   // Red
        { name: 'Profit', amount: netProfit, fill: netProfit >= 0 ? '#10b981' : '#b91c1c' } // Green or Dark Red
    ];

    const pieData = [
        { name: 'Inventory Cost', value: costInventory, color: '#3b82f6' },
        { name: 'Media Cost', value: costMedia, color: '#f59e0b' },
        { name: 'Channel Comm.', value: costChannel, color: '#8b5cf6' },
    ];

    return (
        <div className="space-y-6">
            {/* Banner Formula */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-around text-center">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">总收益 (Revenue)</span>
                    <span className="text-2xl font-bold font-mono text-indigo-400">¥{revenue.toLocaleString()}</span>
                    <span className="text-slate-500 text-xs mt-1">渠道出货价 × 销量</span>
                </div>
                <MinusCircle className="hidden md:block text-slate-600 h-6 w-6" />
                <div className="flex flex-col mt-4 md:mt-0">
                     <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">总成本 (Total Cost)</span>
                     <span className="text-2xl font-bold font-mono text-red-400">¥{totalCost.toLocaleString()}</span>
                     <span className="text-slate-500 text-xs mt-1">库存 + 媒体 + 佣金</span>
                </div>
                <Equal className="hidden md:block text-slate-600 h-6 w-6" />
                <div className="flex flex-col mt-4 md:mt-0">
                     <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">净利润 (Net Profit)</span>
                     <span className={`text-3xl font-bold font-mono ${netProfit >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                        ¥{netProfit.toLocaleString()}
                     </span>
                </div>
                 <div className="h-10 w-px bg-slate-700 hidden md:block mx-4"></div>
                <div className="flex flex-col mt-4 md:mt-0">
                     <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">全局 ROI</span>
                     <span className={`text-3xl font-bold ${roi >= 30 ? 'text-green-400' : roi >= 10 ? 'text-amber-400' : 'text-red-400'}`}>
                        {roi.toFixed(1)}%
                     </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Settings className="h-5 w-5 mr-2 text-slate-500" />
                            组合配置 (Configuration)
                        </h3>
                        
                        <div className="space-y-4">
                            {/* 1. Inventory Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">选择库存商品</label>
                                <select 
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={selectedItemId}
                                    onChange={(e) => setSelectedItemId(e.target.value)}
                                >
                                    <option value="">-- 请选择 --</option>
                                    {inventory.map(item => (
                                        <option key={item.id} value={item.id}>{item.name} (Qty: {item.quantity})</option>
                                    ))}
                                </select>
                            </div>

                             {/* 2. Media Selection */}
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">选择媒体资源</label>
                                <select 
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={selectedMediaId}
                                    onChange={(e) => setSelectedMediaId(e.target.value)}
                                >
                                    <option value="">-- 请选择 --</option>
                                    {media.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} - {m.rate}</option>
                                    ))}
                                </select>
                            </div>

                             {/* 3. Channel Selection */}
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">选择销售渠道</label>
                                <select 
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={selectedChannelId}
                                    onChange={(e) => setSelectedChannelId(e.target.value)}
                                >
                                    <option value="">-- 请选择 --</option>
                                    {channels.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} (Comm: {c.commissionRate * 100}%)</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Parameter Adjustment */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-slate-500" />
                            参数微调 (Simulation)
                        </h3>
                        <div className="space-y-4">
                             <div>
                                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                                    <span>销售单价 (Sell Price)</span>
                                    <span className="text-slate-400">Ref: ¥{selectedItem?.marketPrice || 0}</span>
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">¥</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-slate-300 rounded-md"
                                        value={sellPrice}
                                        onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                             </div>

                             <div>
                                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                                    <span>预计销量 (Quantity)</span>
                                    <span className="text-slate-400">Max: {selectedItem?.quantity || 0}</span>
                                </label>
                                <input
                                    type="number"
                                    max={selectedItem?.quantity}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                                    value={sellQuantity}
                                    onChange={(e) => setSellQuantity(parseFloat(e.target.value) || 0)}
                                />
                             </div>

                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">媒体投放总成本</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">¥</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-slate-300 rounded-md"
                                        value={mediaCostOverride}
                                        onChange={(e) => setMediaCostOverride(parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Analysis & Charts */}
                <div className="lg:col-span-2 space-y-6">
                     
                     {/* Risk Assessment Card */}
                     <div className={`p-6 rounded-xl border ${risk.bg} ${risk.border} flex items-center justify-between`}>
                        <div>
                            <h4 className={`text-lg font-bold ${risk.color} flex items-center`}>
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                {risk.label}
                            </h4>
                            <p className="text-slate-600 text-sm mt-1">基于 ROI 的自动化风险评级。建议 ROI {'>'} 30% 以确保安全利润空间。</p>
                        </div>
                        <div className={`text-4xl font-bold ${risk.color}`}>{roi.toFixed(1)}%</div>
                     </div>

                     {/* Charts */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                             <h4 className="text-sm font-bold text-slate-700 mb-4">财务对比 (Revenue vs Cost)</h4>
                             <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                        <YAxis hide />
                                        <Tooltip formatter={(val: number) => `¥${val.toLocaleString()}`} cursor={{fill: 'transparent'}} />
                                        <Bar dataKey="amount" radius={[4,4,0,0]} barSize={40}>
                                            {barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                             <h4 className="text-sm font-bold text-slate-700 mb-4">成本结构 (Cost Breakdown)</h4>
                             <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(val: number) => `¥${val.toLocaleString()}`} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                     </div>

                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-700 mb-4">详细数据清单</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-2">项目 (Item)</th>
                                        <th className="px-4 py-2">计算公式 (Formula)</th>
                                        <th className="px-4 py-2 text-right">金额 (Amount)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-slate-700">库存成本</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">¥{selectedItem?.costPrice || 0} × {sellQuantity}</td>
                                        <td className="px-4 py-3 text-right">¥{costInventory.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-slate-700">媒体投放</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">固定费率 (Fixed)</td>
                                        <td className="px-4 py-3 text-right">¥{costMedia.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-slate-700">渠道佣金</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">¥{revenue.toLocaleString()} × {(selectedChannel?.commissionRate || 0) * 100}%</td>
                                        <td className="px-4 py-3 text-right">¥{costChannel.toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-slate-50 font-bold">
                                        <td className="px-4 py-3 text-slate-900">总成本</td>
                                        <td className="px-4 py-3"></td>
                                        <td className="px-4 py-3 text-right text-red-600">¥{totalCost.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                     </div>

                </div>
            </div>
        </div>
    );
  };

  const ReportsPage = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">数据报表</h2>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Calendar className="h-4 w-4 mr-2" /> 近一年
            </button>
            <button className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-sm">
              <Download className="h-4 w-4 mr-2" /> 导出报表
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="年度总收益" 
            value="¥12.85M" 
            icon={DollarSign} 
            trend="15.2% 较去年"
            trendUp={true} 
            iconBgClass="bg-blue-100" 
            iconColorClass="text-blue-600"
          />
          <StatCard 
            title="年度净利润" 
            value="¥2.75M" 
            icon={TrendingUp} 
            trend="18.7% 较去年" 
            trendUp={true} 
            iconBgClass="bg-green-100" 
            iconColorClass="text-green-600"
          />
          <StatCard 
            title="年度ROI" 
            value="21.4%" 
            icon={Percent} 
            trend="2.8% 较去年" 
            trendUp={true}
            iconBgClass="bg-amber-100" 
            iconColorClass="text-amber-600"
          />
          <StatCard 
            title="交易总数" 
            value="1,248" 
            icon={Package} 
            trend="12.3% 较去年" 
            trendUp={true}
            iconBgClass="bg-purple-100" 
            iconColorClass="text-purple-600"
          />
        </div>

        {/* Annual Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Annual Profit Curve */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">年度盈利曲线</h3>
                <div className="flex space-x-2 text-xs">
                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-500 cursor-pointer hover:bg-slate-200">月度</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 cursor-pointer hover:bg-slate-50">季度</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 cursor-pointer hover:bg-slate-50">年度</span>
                </div>
             </div>
             <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={REPORT_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(val: number) => `¥${val}k`}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" name="总收益" stroke="#4f46e5" strokeWidth={2} dot={{r: 3}} activeDot={{r: 6}} />
                      <Line type="monotone" dataKey="cost" name="总成本" stroke="#ef4444" strokeWidth={2} dot={{r: 3}} />
                      <Line type="monotone" dataKey="profit" name="净利润" stroke="#10b981" strokeWidth={2} dot={{r: 3}} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
           </div>

           {/* Annual ROI Trend */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">年度ROI趋势</h3>
                <div className="flex space-x-2 text-xs">
                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-500 cursor-pointer hover:bg-slate-200">月度</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 cursor-pointer hover:bg-slate-50">季度</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 cursor-pointer hover:bg-slate-50">年度</span>
                </div>
             </div>
             <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={REPORT_DATA}>
                      <defs>
                        <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(val: number) => `${val}%`}
                      />
                      <Area type="monotone" dataKey="roi" name="ROI" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRoi)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>

        {/* Distributions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">商品分类销售占比</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={CATEGORY_DIST_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {CATEGORY_DIST_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                   </PieChart>
                </ResponsiveContainer>
              </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">渠道销售占比</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={CHANNEL_DIST_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {CHANNEL_DIST_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                   </PieChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
             <h3 className="text-base font-semibold text-slate-800">月度详细数据报表</h3>
             <div className="flex space-x-2">
                <button className="flex items-center px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-sm rounded hover:bg-slate-50">
                  <Filter className="h-3 w-3 mr-1" /> 筛选
                </button>
                <button className="flex items-center px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-sm rounded hover:bg-slate-50">
                  <Download className="h-3 w-3 mr-1" /> 导出CSV
                </button>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">月份</th>
                    <th className="px-6 py-3 text-right">总收益(万元)</th>
                    <th className="px-6 py-3 text-right">总成本(万元)</th>
                    <th className="px-6 py-3 text-right">净利润(万元)</th>
                    <th className="px-6 py-3 text-center">ROI</th>
                    <th className="px-6 py-3 text-center">交易数</th>
                    <th className="px-6 py-3 text-center">同比增长</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {REPORT_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.month}</td>
                      <td className="px-6 py-4 text-right">{row.revenue}</td>
                      <td className="px-6 py-4 text-right text-slate-500">{row.cost}</td>
                      <td className="px-6 py-4 text-right font-medium text-green-600">{row.profit}</td>
                      <td className="px-6 py-4 text-center">{row.roi}%</td>
                      <td className="px-6 py-4 text-center">{row.count}</td>
                      <td className="px-6 py-4 text-center text-green-600">+{row.growth}%</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td className="px-6 py-4 text-slate-900">年度总计</td>
                    <td className="px-6 py-4 text-right">1,285.0</td>
                    <td className="px-6 py-4 text-right text-slate-500">1,010.0</td>
                    <td className="px-6 py-4 text-right text-green-600">275.0</td>
                    <td className="px-6 py-4 text-center">27.2%</td>
                    <td className="px-6 py-4 text-center">1,248</td>
                    <td className="px-6 py-4 text-center text-green-600">+18.7%</td>
                  </tr>
                </tbody>
             </table>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-3 flex items-center">
                 <TrendingUp className="h-5 w-5 mr-2" /> 销售趋势分析
              </h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                 <li className="flex items-start"><span className="mr-2">•</span> 年度销售额整体呈上升趋势，环比增长稳定</li>
                 <li className="flex items-start"><span className="mr-2">•</span> 第二季度销售额增长放缓，可能受季节性因素影响</li>
                 <li className="flex items-start"><span className="mr-2">•</span> 第四季度销售额增长最快，同比增长超过20%</li>
                 <li className="flex items-start"><span className="mr-2">•</span> 电子产品和家居用品是增长最快的品类</li>
              </ul>
           </div>
           <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                 <Activity className="h-5 w-5 mr-2" /> ROI趋势分析
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                 <li className="flex items-start"><span className="mr-2">•</span> 年度ROI整体保持在24%左右，波动较小</li>
                 <li className="flex items-start"><span className="mr-2">•</span> 第一季度ROI最高，达到25.9%</li>
                 <li className="flex items-start"><span className="mr-2">•</span> 第三季度ROI略有下降，主要受媒体成本上涨影响</li>
                 <li className="flex items-start"><span className="mr-2">•</span> 线上渠道ROI高于线下渠道，尤其是直播电商渠道</li>
              </ul>
           </div>
        </div>
      </div>
    );
  };

  const SettingsPage = () => {
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
      applySettings(localSettings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    };

    const handleResetData = () => {
      if (window.confirm('确定要重置所有数据吗？此操作将清除所有本地保存的数据并恢复为系统默认演示数据，且无法撤销。')) {
        localStorage.removeItem(STORAGE_KEYS.INVENTORY);
        localStorage.removeItem(STORAGE_KEYS.MEDIA);
        localStorage.removeItem(STORAGE_KEYS.CHANNELS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        window.location.reload();
      }
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Settings className="mr-2 h-5 w-5 text-slate-500" />
              系统全局设置
            </h2>
          </div>
          
          <div className="p-6 space-y-8">
            <section>
              <h3 className="text-md font-semibold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">
                库存预警规则
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    低库存阈值 (Low Stock Threshold)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">当商品数量低于此数值时，系统将标记为 "Low Stock" 并发送警报。</p>
                  <input 
                    type="number" 
                    value={localSettings.lowStockThreshold}
                    onChange={(e) => setLocalSettings({...localSettings, lowStockThreshold: parseInt(e.target.value) || 0})}
                    className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    缺货阈值 (Out of Stock Threshold)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">当商品数量等于或低于此数值时，系统将标记为 "Out of Stock"。</p>
                  <input 
                    type="number" 
                    value={localSettings.outOfStockThreshold}
                    onChange={(e) => setLocalSettings({...localSettings, outOfStockThreshold: parseInt(e.target.value) || 0})}
                    className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </section>
            
            <section className="pt-6 border-t border-slate-100">
              <h3 className="text-md font-semibold text-slate-800 mb-4 border-l-4 border-red-500 pl-3">
                数据管理
              </h3>
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-800">重置系统数据</h4>
                  <p className="text-xs text-red-600 mt-1">
                    清除本地缓存的所有数据（库存、媒体、渠道等），恢复到初始演示状态。
                  </p>
                </div>
                <button 
                  onClick={handleResetData}
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded hover:bg-red-50 transition-colors shadow-sm"
                >
                  重置数据
                </button>
              </div>
            </section>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
               {isSaved && (
                 <span className="text-green-600 text-sm font-medium mr-4 flex items-center animate-fade-in">
                   <CheckCircle className="h-4 w-4 mr-1" /> 保存成功
                 </span>
               )}
               <button 
                onClick={handleSave}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
               >
                 <Save className="h-4 w-4 mr-2" /> 保存设置
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PricingPage = () => {
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

    const handleAnalyze = async () => {
      const item = inventory.find(i => i.id === selectedItem);
      if (!item) return;
      
      setLoading(true);
      setAnalysis(null);
      try {
        const result = await analyzePricing(item);
        setAnalysis(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">AI 智能定价分析</h2>
                <p className="text-slate-500 mt-1">利用 Gemini 模型分析市场数据，制定最佳变现策略。</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-full">
                <Calculator className="h-8 w-8 text-indigo-600" />
              </div>
           </div>

           <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">选择要分析的商品</label>
              <select 
                className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                <option value="">-- 请选择商品 --</option>
                {inventory.map(i => (
                  <option key={i.id} value={i.id}>{i.name} (Qty: {i.quantity})</option>
                ))}
              </select>
              
              <button 
                onClick={handleAnalyze}
                disabled={!selectedItem || loading}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                    分析中 (Gemini Thinking)...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-5 w-5 mr-2" />
                    开始分析
                  </>
                )}
              </button>
           </div>
        </div>

        {analysis && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
               <h3 className="text-lg font-bold text-white flex items-center">
                 <CheckCircle className="h-5 w-5 mr-2" /> 分析结果报告
               </h3>
            </div>
            <div className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">建议定价区间</span>
                    <div className="mt-2 text-3xl font-bold text-indigo-600">
                      ${analysis.suggestedPriceRange?.min} - ${analysis.suggestedPriceRange?.max}
                    </div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">风险评分</span>
                    <div className="flex items-center mt-2">
                       <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden mr-4">
                          <div 
                            className={`h-full ${analysis.riskScore && analysis.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{width: `${analysis.riskScore || 0}%`}} 
                          />
                       </div>
                       <span className="text-lg font-bold text-slate-700">{analysis.riskScore}/100</span>
                    </div>
                 </div>
               </div>
               
               <div>
                  <h4 className="font-semibold text-slate-900 mb-2">核心建议</h4>
                  <p className="text-slate-600 bg-indigo-50 p-4 rounded-lg">{analysis.recommendation}</p>
               </div>

               <div>
                  <h4 className="font-semibold text-slate-900 mb-2">分析依据</h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-600">
                    {analysis.reasoning.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const RiskPage = () => {
      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState<AIAnalysisResult | null>(null);

      const runCheck = async () => {
          setLoading(true);
          try {
              // Calculate live metrics
              const totalVal = inventory.reduce((a,b) => a + (b.quantity * b.marketPrice), 0);
              const mediaVal = media.reduce((a,b) => a + (b.valuation || 0), 0);
              
              const res = await assessRisk(totalVal, mediaVal, channels.length);
              setResult(res);
          } catch(e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      }

      return (
          <div className="max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                      <AlertTriangle className="mr-2 text-amber-500" />
                      业务风控检查中心
                  </h2>
                  <p className="text-slate-600 mb-6">
                      系统将自动扫描库存周转率、媒体资源利用率及渠道依赖度，通过 Gemini AI 识别潜在经营风险。
                  </p>
                  <button 
                    onClick={runCheck} 
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                      {loading ? <RefreshCw className="animate-spin mr-2"/> : <Search className="mr-2"/>}
                      {loading ? '正在进行全域扫描...' : '立即执行风控扫描'}
                  </button>
              </div>

              {result && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                          <h3 className="font-bold text-lg mb-4">评估报告</h3>
                          <div className="mb-4">
                              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800 mb-2">
                                  总体建议
                              </span>
                              <p className="text-slate-700 leading-relaxed">{result.recommendation}</p>
                          </div>
                          <div className="space-y-3">
                              {result.reasoning.map((r, i) => (
                                  <div key={i} className="flex items-start">
                                      <AlertCircle className="w-4 h-4 text-amber-500 mt-1 mr-2 flex-shrink-0" />
                                      <span className="text-sm text-slate-600">{r}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                          <h3 className="text-sm font-medium text-slate-500 mb-2">综合风险指数</h3>
                          <div className={`text-5xl font-bold ${result.riskScore && result.riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                              {result.riskScore}
                          </div>
                          <p className="text-xs text-slate-400 mt-2">范围 0 (安全) - 100 (高危)</p>
                      </div>
                  </div>
              )}
          </div>
      )
  };

  const PlaceholderPage = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex flex-col items-center justify-center h-96 text-slate-400">
      <div className="bg-slate-100 p-6 rounded-full mb-4">
        <Icon className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-medium text-slate-600">{title} 功能开发中</h3>
      <p className="text-sm mt-2">该模块将在后续版本更新中开放。</p>
    </div>
  );

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      notifications={notifications}
      onMarkAsRead={markAsRead}
      onClearAllNotifications={clearAllNotifications}
    >
      <ToastContainer notifications={notifications.filter(n => !n.read).slice(0,3)} removeToast={removeToast} />
      
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

      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'inventory' && <InventoryPage />}
      {activeTab === 'media' && <MediaPage />}
      {activeTab === 'channels' && <ChannelsPage />}
      {activeTab === 'pricing' && <PricingPage />}
      {activeTab === 'risk' && <RiskPage />}
      {activeTab === 'settings' && <SettingsPage />}
      {activeTab === 'finance' && <FinancePage />}
      {activeTab === 'reports' && <ReportsPage />}
    </Layout>
  );
}

export default App;
