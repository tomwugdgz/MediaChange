import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { MediaResource } from '../types';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (media: Omit<MediaResource, 'id'> & { id?: string }) => void;
  initialData?: MediaResource | null;
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<MediaResource>>({
    name: '',
    type: '户外媒体',
    format: '',
    location: '',
    rate: '',
    discount: 0.8,
    contractStart: '',
    contractEnd: '',
    status: 'active',
    valuation: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form for new entry
      setFormData({
        name: '',
        type: '户外媒体',
        format: '',
        location: '',
        rate: '',
        discount: 0.8,
        contractStart: new Date().toISOString().split('T')[0],
        contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        status: 'active',
        valuation: 0
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation could go here
    onSave(formData as MediaResource);
  };

  const handleChange = (field: keyof MediaResource, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                {initialData ? '编辑媒体资源' : '添加新媒体'}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">媒体名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="例如：分众传媒 (Focus Media)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">媒体类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="户外媒体">户外媒体</option>
                    <option value="数字媒体">数字媒体</option>
                    <option value="电视媒体">电视媒体</option>
                    <option value="平面媒体">平面媒体</option>
                  </select>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">广告形式</label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => handleChange('format', e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="例如：电梯楼宇广告"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700">覆盖范围/位置</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="例如：一线城市核心商圈"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Rate */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">刊例价格</label>
                  <input
                    type="text"
                    value={formData.rate}
                    onChange={(e) => handleChange('rate', e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="¥15,000/周"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">折扣 (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={Math.round((formData.discount || 0) * 100)}
                    onChange={(e) => handleChange('discount', parseInt(e.target.value) / 100)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Contract Start */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">合同开始日期</label>
                  <input
                    type="date"
                    value={formData.contractStart}
                    onChange={(e) => handleChange('contractStart', e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Contract End */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">合同结束日期</label>
                  <input
                    type="date"
                    value={formData.contractEnd}
                    onChange={(e) => handleChange('contractEnd', e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="active">活跃 (Active)</option>
                  <option value="pending">待审核 (Pending)</option>
                  <option value="expiring">即将到期 (Expiring)</option>
                  <option value="expired">已过期 (Expired)</option>
                </select>
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

export default MediaModal;
