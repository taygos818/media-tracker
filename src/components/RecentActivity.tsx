import React from 'react';
import { Clock, Star, Eye } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'watched',
    title: 'The Crown',
    subtitle: 'Season 5, Episode 3',
    time: '2 hours ago',
    rating: 8.5,
    platform: 'Netflix'
  },
  {
    id: 2,
    type: 'rated',
    title: 'Dune: Part Two',
    subtitle: 'Movie',
    time: '1 day ago',
    rating: 9.2,
    platform: 'HBO Max'
  },
  {
    id: 3,
    type: 'watched',
    title: 'House of the Dragon',
    subtitle: 'Season 2, Episode 8',
    time: '2 days ago',
    rating: 8.8,
    platform: 'HBO Max'
  },
  {
    id: 4,
    type: 'watched',
    title: 'Spider-Man: Into the Spider-Verse',
    subtitle: 'Movie',
    time: '3 days ago',
    rating: 9.0,
    platform: 'Plex'
  },
  {
    id: 5,
    type: 'rated',
    title: 'Stranger Things',
    subtitle: 'Season 4',
    time: '1 week ago',
    rating: 8.7,
    platform: 'Netflix'
  }
];

export const RecentActivity: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
            <div className={`p-2 rounded-lg ${
              activity.type === 'watched' 
                ? 'bg-blue-600/20 text-blue-400' 
                : 'bg-yellow-600/20 text-yellow-400'
            }`}>
              {activity.type === 'watched' ? (
                <Eye className="w-4 h-4" />
              ) : (
                <Star className="w-4 h-4" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{activity.title}</p>
                <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                  {activity.platform}
                </span>
              </div>
              <p className="text-sm text-gray-400 truncate">{activity.subtitle}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-gray-300">{activity.rating}</span>
                </div>
                <span className="text-xs text-gray-500">•</span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};