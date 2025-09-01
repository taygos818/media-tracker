import React from 'react';
import { Play, Clock, TrendingUp, Star } from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import { StatsCard } from '../components/StatsCard';
import { RecentActivity } from '../components/RecentActivity';
import { useMediaContext } from '../context/MediaContext';

export const Dashboard: React.FC = () => {
  const { recentlyWatched, continueWatching, trending } = useMediaContext();

  const stats = [
    { label: 'Hours Watched', value: '142.5', change: '+12%', icon: Clock, color: 'blue' },
    { label: 'Movies Completed', value: '87', change: '+8', icon: Play, color: 'green' },
    { label: 'Shows Following', value: '23', change: '+3', icon: TrendingUp, color: 'purple' },
    { label: 'Average Rating', value: '8.2', change: '+0.3', icon: Star, color: 'orange' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, John</h1>
        <p className="text-gray-400">Here's what you've been watching</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Continue Watching</h2>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {continueWatching.slice(0, 6).map((item) => (
                <MediaCard key={item.id} media={item} showProgress />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Trending Now</h2>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                Explore More
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {trending.slice(0, 6).map((item) => (
                <MediaCard key={item.id} media={item} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};