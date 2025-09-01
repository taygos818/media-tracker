import React from 'react';

const chartData = [
  { month: 'Jan', hours: 32 },
  { month: 'Feb', hours: 45 },
  { month: 'Mar', hours: 38 },
  { month: 'Apr', hours: 52 },
  { month: 'May', hours: 61 },
  { month: 'Jun', hours: 48 },
  { month: 'Jul', hours: 71 },
  { month: 'Aug', hours: 58 },
  { month: 'Sep', hours: 43 },
  { month: 'Oct', hours: 67 },
  { month: 'Nov', hours: 89 },
  { month: 'Dec', hours: 95 }
];

export const AnalyticsChart: React.FC = () => {
  const maxHours = Math.max(...chartData.map(d => d.hours));

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Monthly Watch Time</h3>
      <div className="h-64 flex items-end justify-between gap-2">
        {chartData.map((data, index) => (
          <div key={data.month} className="flex flex-col items-center flex-1">
            <div className="w-full bg-gray-700 rounded-t-md relative group">
              <div
                className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500 ease-out hover:from-blue-500 hover:to-blue-300"
                style={{ 
                  height: `${(data.hours / maxHours) * 200}px`,
                  minHeight: '8px'
                }}
              ></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {data.hours}h
              </div>
            </div>
            <span className="text-xs text-gray-400 mt-2">{data.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};