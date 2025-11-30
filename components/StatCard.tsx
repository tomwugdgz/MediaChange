import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
  iconBgClass?: string;
  iconColorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  colorClass = "bg-white",
  iconBgClass = "bg-slate-50",
  iconColorClass = "text-slate-600"
}) => {
  return (
    <div className={`${colorClass} p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between transition-all hover:shadow-md`}>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${iconBgClass}`}>
        <Icon className={`h-6 w-6 ${iconColorClass}`} />
      </div>
    </div>
  );
};

export default StatCard;