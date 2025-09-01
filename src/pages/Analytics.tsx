import React, { useState } from 'react';
import { Calendar, TrendingUp, Clock, Award } from 'lucide-react';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { TopGenres } from '../components/TopGenres';
import { PlatformBreakdown } from '../components/PlatformBreakdown';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  const watchingStats = {
    totalHours: 142.5,
    totalItems: 187,
    averageRating: 8.2,
    completionRate: 87
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Insights into your viewing habits and preferences</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Watch Time</div>
              <div className="text-2xl font-bold">{watchingStats.totalHours}h</div>
            </div>
          </div>
          <div className="text-sm text-green-400">+12% from last month</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Items Watched</div>
              <div className="text-2xl font-bold">{watchingStats.totalItems}</div>
            </div>
          </div>
          <div className="text-sm text-green-400">+18 this month</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Award className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Avg Rating</div>
              <div className="text-2xl font-bold">{watchingStats.averageRating}/10</div>
            </div>
          </div>
          <div className="text-sm text-green-400">+0.3 improvement</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Calendar className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Completion Rate</div>
              <div className="text-2xl font-bold">{watchingStats.completionRate}%</div>
            </div>
          </div>
          <div className="text-sm text-green-400">+5% increase</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsChart />
        <PlatformBreakdown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopGenres />
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Viewing Patterns</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Most Active Day</span>
              <span className="font-medium">Saturday</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Peak Viewing Time</span>
              <span className="font-medium">8:00 PM - 11:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Session</span>
              <span className="font-medium">2.3 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Binge Sessions</span>
              <span className="font-medium">23 this month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};