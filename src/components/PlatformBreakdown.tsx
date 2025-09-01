import React from 'react';

const platformData = [
  { name: 'Plex', hours: 45.2, percentage: 32, color: 'bg-orange-500' },
  { name: 'Netflix', hours: 38.7, percentage: 27, color: 'bg-red-500' },
  { name: 'HBO Max', hours: 25.1, percentage: 18, color: 'bg-purple-500' },
  { name: 'Disney+', hours: 18.3, percentage: 13, color: 'bg-blue-500' },
  { name: 'Hulu', hours: 15.2, percentage: 10, color: 'bg-green-500' }
];

export const PlatformBreakdown: React.FC = () => {
  const totalHours = platformData.reduce((sum, platform) => sum + platform.hours, 0);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Platform Breakdown</h3>
      
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {platformData.map((platform, index) => {
              const previousPercentages = platformData
                .slice(0, index)
                .reduce((sum, p) => sum + p.percentage, 0);
              
              const strokeDasharray = `${platform.percentage} ${100 - platform.percentage}`;
              const strokeDashoffset = -previousPercentages;
              
              return (
                <circle
                  key={platform.name}
                  cx="50"
                  cy="50"
                  r="16"
                  fill="none"
                  stroke={platform.color.replace('bg-', '').replace('-500', '')}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={platform.color}
                  style={{
                    stroke: platform.color.includes('red') ? '#ef4444' :
                            platform.color.includes('blue') ? '#3b82f6' :
                            platform.color.includes('green') ? '#10b981' :
                            platform.color.includes('purple') ? '#8b5cf6' :
                            platform.color.includes('orange') ? '#f97316' : '#6b7280'
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold">{totalHours.toFixed(1)}h</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {platformData.map((platform) => (
          <div key={platform.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full`} style={{
                backgroundColor: platform.color.includes('red') ? '#ef4444' :
                               platform.color.includes('blue') ? '#3b82f6' :
                               platform.color.includes('green') ? '#10b981' :
                               platform.color.includes('purple') ? '#8b5cf6' :
                               platform.color.includes('orange') ? '#f97316' : '#6b7280'
              }}></div>
              <span className="text-sm font-medium">{platform.name}</span>
            </div>
            <div className="text-sm text-gray-400">
              {platform.hours}h ({platform.percentage}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};