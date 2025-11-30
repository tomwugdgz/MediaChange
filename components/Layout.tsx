
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Tv, 
  ShoppingCart, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  FileBarChart, 
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Check
} from 'lucide-react';
import { Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onClearAllNotifications?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  notifications = [],
  onMarkAsRead,
  onClearAllNotifications
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'dashboard', label: '系统概览', icon: LayoutDashboard },
    { id: 'inventory', label: '库存管理', icon: Package },
    { id: 'media', label: '媒体管理', icon: Tv },
    { id: 'channels', label: '渠道管理', icon: ShoppingCart },
    { id: 'pricing', label: '定价分析', icon: Calculator },
    { id: 'finance', label: '财务测算', icon: TrendingUp },
    { id: 'risk', label: '风控检查', icon: AlertTriangle },
    { id: 'reports', label: '数据报表', icon: FileBarChart },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
          ${!sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-slate-800">
          <span className="text-xl font-bold tracking-wider">BarterFlow</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">主导航菜单</div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  // On mobile close sidebar after selection
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`
                  flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-slate-900 border-t border-slate-800">
          <button className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            <LogOut className="mr-3 h-5 w-5" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 shadow-sm z-10 relative">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-slate-700 focus:outline-none lg:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-slate-800 ml-4 lg:ml-0">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="flex items-center space-x-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-20 border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-700">通知中心</span>
                      {notifications.length > 0 && (
                        <button 
                          onClick={onClearAllNotifications}
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          全部清空
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-slate-500 text-sm">
                          暂无新通知
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${notification.read ? 'opacity-60' : 'bg-blue-50/30'}`}
                            onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start">
                              <p className={`text-sm font-medium ${notification.type === 'error' ? 'text-red-600' : notification.type === 'warning' ? 'text-amber-600' : 'text-slate-800'}`}>
                                {notification.title}
                              </p>
                              <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col items-end border-l border-slate-200 pl-4">
              <span className="text-sm font-medium text-slate-900">Admin User</span>
              <span className="text-xs text-slate-500">Super Administrator</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
