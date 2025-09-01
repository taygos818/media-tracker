import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: 'bg-blue-600/20 text-blue-400',
  green: 'bg-green-600/20 text-green-400',
  purple: 'bg-purple-600/20 text-purple-400',
  orange: 'bg-orange-600/20 text-orange-400',
};

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, change, icon: Icon, color }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-white">{value}</p>
            <span className={`text-sm font-medium ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};