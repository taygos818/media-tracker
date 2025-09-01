import React from 'react';

const genreData = [
  { name: 'Drama', count: 34, percentage: 18, color: 'bg-blue-500' },
  { name: 'Comedy', count: 28, percentage: 15, color: 'bg-green-500' },
  { name: 'Action', count: 25, percentage: 13, color: 'bg-red-500' },
  { name: 'Sci-Fi', count: 22, percentage: 12, color: 'bg-purple-500' },
  { name: 'Horror', count: 18, percentage: 10, color: 'bg-orange-500' },
  { name: 'Romance', count: 15, percentage: 8, color: 'bg-pink-500' },
  { name: 'Documentary', count: 12, percentage: 6, color: 'bg-yellow-500' },
  { name: 'Other', count: 33, percentage: 18, color: 'bg-gray-500' }
];

export const TopGenres: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Top Genres</h3>
      <div className="space-y-4">
        {genreData.map((genre, index) => (
          <div key={genre.name} className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-3 h-3 rounded-full ${genre.color}`}></div>
              <span className="text-sm font-medium">{genre.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${genre.color} transition-all duration-500`}
                  style={{ width: `${genre.percentage * 5}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-400 w-8 text-right">{genre.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};