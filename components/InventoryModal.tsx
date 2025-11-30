
import React, { useState, useEffect } from 'react';
import { X, Save, Link, TrendingDown } from 'lucide-react';
import { InventoryItem, InventoryStatus } from '../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id' | 'lastUpdated'> & { id?: string }) => void;
  initialData?: InventoryItem | null;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    brand: '',
    category: '',
    quantity: 0,
    marketPrice: 0,
    lowestPrice: 0,
    costPrice: 0,
    productUrl: '',
    status: InventoryStatus.IN_STOCK,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        brand: '',
        category: '电子产品',
        quantity: 0,
        marketPrice: 0,
        lowestPrice: 0,
        costPrice: 0,
        productUrl: '',
        status: InventoryStatus.IN_STOCK,
        description: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as InventoryItem);
  };

  const handleChange = (field: keyof InventoryItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-lg leading-6 font-medium text-slate-900">
                {initialData ? '编辑库存商品' : '添加新商品'}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">商品名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="例如：讯飞X10语音文本"
                />
              </div>

              {/* Product URL Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 flex items-center">
                  <Link size={14} className="mr-1" />
                  产品网络链接
                </label>
                <input
                  type="url"
                  value={formData.productUrl || ''}
                  onChange={(e) => handleChange('productUrl', e.target.value)}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">品牌</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="例如：科大讯飞"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="电子产品">电子产品</option>
                    <option value="家用电器">家用电器</option>
                    <option value="保健品">保健品</option>
                    <option value="食品饮料">食品饮料</option>
                    <option value="美妆护肤">美妆护肤</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700">库存数量</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value={InventoryStatus.IN_STOCK}>库存充足 (In Stock)</option>
                    <option value={InventoryStatus.LOW_STOCK}>库存偏低 (Low Stock)</option>
                    <option value={InventoryStatus.OUT_OF_STOCK}>缺货 (Out of Stock)</option>
                    <option value={InventoryStatus.DISCONTINUED}>已下架 (Discontinued)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">市场单价 (¥)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.marketPrice}
                    onChange={(e) => handleChange('marketPrice', parseFloat(e.target.value))}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 flex items-center text-indigo-600">
                    <TrendingDown size={14} className="mr-1" />
                    全网最低 (¥)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lowestPrice || ''}
                    onChange={(e) => handleChange('lowestPrice', parseFloat(e.target.value))}
                    className="mt-1 block w-full border border-indigo-200 bg-indigo-50 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="选填"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">成本价 (¥)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => handleChange('costPrice', parseFloat(e.target.value))}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">描述/备注</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

            </form>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <Save size={16} className="mr-2" />
              保存
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
