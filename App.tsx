
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
  ArrowRight, Equal, Percent, Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
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

const DEFAULT_SETTINGS: AppSettings = {
  lowStockThreshold: 50,
  outOfStockThreshold: 0
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
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [media, setMedia] = useState<MediaResource[]>(INITIAL_MEDIA);
  const [channels, setChannels] = useState<SalesChannel[]>(INITIAL_CHANNELS);
  
  // New States for Settings and Notifications
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
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
            <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="h-4 w-4 mr-2" /> 导出
            </button>
          </div>
        </div>

        {/* Stats Cards Matching Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="总商品数" 
            value="1,248" 
            icon={Package} 
            trend="5.2% 较上月" 
            trendUp={true} 
            iconBgClass="bg-blue-100" 
            iconColorClass="text-blue-600"
          />
          <StatCard 
            title="库存总值" 
            value="¥8.45M" 
            icon={DollarSign} 
            trend="8.7% 较上月" 
            trendUp={true}
            iconBgClass="bg-green-100" 
            iconColorClass="text-green-600"
          />
          <StatCard 
            title="待审核商品" 
            value="24" 
            icon={Clock} 
            trend="12.3% 较上月" 
            trendUp={false}
            iconBgClass="bg-amber-100" 
            iconColorClass="text-amber-600"
          />
          <StatCard 
            title="即将过期" 
            value="12" 
            icon={AlertTriangle} 
            trend="3.5% 较上月" 
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
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteInventory(item.id, item.name)}
                            className="text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
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
            <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
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
                          className="text-indigo-600 hover:text-indigo-800"
                         >
                           <Edit2 className="h-4 w-4" />
                         </button>
                         <button 
                          onClick={() => handleDeleteMedia(item.id, item.name)}
                          className="text-red-500 hover:text-red-700"
                         >
                           <Trash2 className="h-4 w-4" />
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
            <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
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
                          className="text-blue-500 hover:text-blue-700"
                         >
                           <Edit2 className="h-4 w-4" />
                         </button>
                         <button 
                           className="text-green-500 hover:text-green-700"
                           title="Link/Connect"
                         >
                           <Link2 className="h-4 w-4" />
                         </button>
                         <button 
                          onClick={() => handleDeleteChannel(item.id, item.name)}
                          className="text-slate-400 hover:text-red-500"
                         >
                           <Trash2 className="h-4 w-4" />
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

  const SettingsPage = () => {
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
      applySettings(localSettings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
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
      {activeTab === 'reports' && <PlaceholderPage title="数据报表导出" icon={FileText} />}
    </Layout>
  );
}

export default App;
