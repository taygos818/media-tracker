import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, Eye, Film } from 'lucide-react';
import { MediaService } from '../services/mediaService';
import { TMDBService } from '../services/tmdbService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';

export const Watchlist: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState<any[]>([]);
  const [userWatchlist, setUserWatchlist] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'multi' | 'movie' | 'tv'>('multi');

  // Load user's watchlist
  useEffect(() => {
    const loadWatchlist = async () => {
      if (!user) return;
      
      try {
        const watchlistData = await MediaService.getWatchlist(user.id);
        setUserWatchlist(watchlistData);
      } catch (error) {
        console.warn('Watchlist table not found');
        setUserWatchlist([]);
      }
    };

    loadWatchlist();
  }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await TMDBService.searchMedia(searchQuery, searchType);
      setTmdbResults(results.results);
    } catch (error) {
      console.error('Search error:', error);
      showToast('Search failed. Please check your TMDB configuration.', 'error');
      setTmdbResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMarkAsWatched = async (tmdbItem: any) => {
    if (!user) return;

    try {
      // First save the media item to database
      const mediaId = await TMDBService.saveToDatabase(tmdbItem);
      
      // Then record as watched
      await MediaService.recordWatchSession({
        userId: user.id,
        mediaItemId: mediaId,
        startedAt: new Date().toISOString(),
        progressSeconds: tmdbItem.runtime ? tmdbItem.runtime * 60 : 7200,
        totalRuntimeSeconds: tmdbItem.runtime ? tmdbItem.runtime * 60 : 7200,
        completed: true,
        deviceType: 'web',
      });

      showToast('Marked as watched!', 'success');
    } catch (error) {
      console.error('Error marking as watched:', error);
      showToast('Failed to mark as watched.', 'error');
    }
  };

  const handleAddToWatchlist = async (tmdbItem: any) => {
    if (!user) return;

    try {
      // First save the media item to database
      const mediaId = await TMDBService.saveToDatabase(tmdbItem);
      
      // Then add to watchlist
      await MediaService.addToWatchlist(user.id, mediaId);
      
      // Update local watchlist state
      const updatedWatchlist = await MediaService.getWatchlist(user.id);
      setUserWatchlist(updatedWatchlist);

      showToast('Added to watchlist!', 'success');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      showToast('Failed to add to watchlist.', 'error');
    }
  };

  const handleRemoveFromWatchlist = async (mediaItemId: string) => {
    if (!user) return;

    try {
      await MediaService.removeFromWatchlist(user.id, mediaItemId);
      
      // Update local watchlist state
      const updatedWatchlist = await MediaService.getWatchlist(user.id);
      setUserWatchlist(updatedWatchlist);

      showToast('Removed from watchlist', 'info');
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      showToast('Failed to remove from watchlist.', 'error');
    }
  };

  const isInWatchlist = (tmdbId: number) => {
    return userWatchlist.some(item => item.media_items?.tmdb_id === tmdbId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Watchlist Manager</h1>
        <p className="text-gray-400">Search for movies and TV shows to add to your watchlist or mark as watched</p>
      </div>

      {/* Search Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Search Movies & TV Shows</h2>
        
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search The Movie Database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'multi' | 'movie' | 'tv')}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="multi">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
          
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {tmdbResults.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Search Results ({tmdbResults.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tmdbResults.map((item) => (
              <div key={item.tmdb_id} className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors">
                <div className="relative">
                  <img
                    src={item.poster_url || 'https://images.pexels.com/photos/4009708/pexels-photo-4009708.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop'}
                    alt={item.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {item.type === 'movie' ? 'Movie' : 'TV'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{item.year}</p>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{item.rating_tmdb?.toFixed(1) || 'N/A'}</span>
                    </div>
                    {item.genres.length > 0 && (
                      <span className="truncate">{item.genres[0]}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAsWatched(item)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Watched
                    </button>
                    <button
                      onClick={() => isInWatchlist(item.tmdb_id) ? {} : handleAddToWatchlist(item)}
                      disabled={isInWatchlist(item.tmdb_id)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                        isInWatchlist(item.tmdb_id)
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isInWatchlist(item.tmdb_id) ? (
                        <>
                          <Check className="w-3 h-3" />
                          In List
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          Watchlist
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Watchlist */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Your Watchlist ({userWatchlist.length})</h2>
        
        {userWatchlist.length === 0 ? (
          <div className="text-center py-8">
            <Film className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Your watchlist is empty</p>
            <p className="text-sm text-gray-500">Search for movies and TV shows to add them to your watchlist</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userWatchlist.map((item) => (
              <div key={item.id} className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors">
                <div className="relative">
                  <img
                    src={item.media_items?.poster_url || 'https://images.pexels.com/photos/4009708/pexels-photo-4009708.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop'}
                    alt={item.media_items?.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {item.media_items?.type === 'movie' ? 'Movie' : 'TV'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate mb-1">{item.media_items?.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{item.media_items?.year}</p>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">{item.media_items?.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{item.media_items?.rating_tmdb?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Added {new Date(item.added_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAsWatched({
                        ...item.media_items,
                        tmdb_id: item.media_items?.tmdb_id
                      })}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Watched
                    </button>
                    <button
                      onClick={() => handleRemoveFromWatchlist(item.media_item_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};