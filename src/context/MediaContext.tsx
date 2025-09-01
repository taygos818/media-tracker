import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Media } from '../types/media';
import { MediaService } from '../services/mediaService';
import { TMDBService } from '../services/tmdbService';
import { useAuth } from '../hooks/useAuth';

interface MediaContextType {
  allMedia: Media[];
  recentlyWatched: Media[];
  continueWatching: Media[];
  trending: Media[];
  watchlist: Media[];
  getMediaById: (id: string) => Media | undefined;
  addToWatchlist: (media: Media) => void;
  removeFromWatchlist: (mediaId: string) => void;
  markAsWatched: (mediaId: string, progress?: number) => void;
  refreshMedia: () => Promise<void>;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [allMedia, setAllMedia] = useState<Media[]>([]);
  const [watchlist, setWatchlist] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  // Load media data from Supabase
  const loadMedia = React.useCallback(async () => {
    try {
      setLoading(true);
      const media = await MediaService.getAllMedia();
      // Convert Supabase data to our Media type
      const convertedMedia: Media[] = media.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        description: item.description || '',
        poster: item.poster_url || '',
        backdrop: item.backdrop_url,
        year: item.year || 0,
        rating: item.rating_tmdb || 0,
        runtime: item.runtime || 0,
        genres: Array.isArray(item.genres) ? item.genres : [],
        platform: 'Unknown', // We'll need to get this from integrations
        tagline: item.tagline,
        media_cast: Array.isArray(item.media_cast) ? item.media_cast : [],
      }));
      setAllMedia(convertedMedia);
    } catch (error) {
      console.warn('Media tables not found, using empty data. Please set up your Supabase database.');
      // Fallback to empty array if tables don't exist yet
      setAllMedia([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  // Refresh media function for external use
  const refreshMedia = React.useCallback(async () => {
    await loadMedia();
  }, [loadMedia]);

  // Load media data from Supabase (keeping the old implementation as backup)
  const oldLoadMedia = React.useCallback(async () => {
      try {
        setLoading(true);
        const media = await MediaService.getAllMedia();
        // Convert Supabase data to our Media type
        const convertedMedia: Media[] = media.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          description: item.description || '',
          poster: item.poster_url || '',
          backdrop: item.backdrop_url,
          year: item.year || 0,
          rating: item.rating_tmdb || 0,
          runtime: item.runtime || 0,
          genres: Array.isArray(item.genres) ? item.genres : [],
          platform: 'Unknown', // We'll need to get this from integrations
          tagline: item.tagline,
          media_cast: Array.isArray(item.media_cast) ? item.media_cast : [],
        }));
        setAllMedia(convertedMedia);
      } catch (error) {
        console.warn('Media tables not found, using empty data. Please set up your Supabase database.');
        // Fallback to empty array if tables don't exist yet
        setAllMedia([]);
      } finally {
        setLoading(false);
      }
    }, []);

  // Load user's watchlist
  React.useEffect(() => {
    const loadWatchlist = async () => {
      if (!user) return;
      
      try {
        const watchlistData = await MediaService.getWatchlist(user.id);
        // Convert to Media array
        const convertedWatchlist: Media[] = watchlistData.map(item => ({
          id: item.media_items!.id,
          title: item.media_items!.title,
          type: item.media_items!.type,
          description: item.media_items!.description || '',
          poster: item.media_items!.poster_url || '',
          backdrop: item.media_items!.backdrop_url,
          year: item.media_items!.year || 0,
          rating: item.media_items!.rating_tmdb || 0,
          runtime: item.media_items!.runtime || 0,
          genres: Array.isArray(item.media_items!.genres) ? item.media_items!.genres : [],
          platform: 'Unknown',
          tagline: item.media_items!.tagline || '',
          media_cast: Array.isArray(item.media_items!.media_cast) ? item.media_items!.media_cast : [],
        }));
        setWatchlist(convertedWatchlist);
      } catch (error) {
        console.warn('Watchlist table not found, using empty data. Please set up your Supabase database.');
        // Fallback to empty array if tables don't exist yet
        setWatchlist([]);
      }
    };

    loadWatchlist();
  }, [user]);

  const recentlyWatched = allMedia.filter(media => media.lastWatched).slice(0, 10);
  const continueWatching = allMedia.filter(media => media.progress && media.progress < 100);
  const trending = allMedia.filter(media => media.trending).slice(0, 10);

  const getMediaById = (id: string): Media | undefined => {
    return allMedia.find(media => media.id === id);
  };

  const addToWatchlist = async (media: Media) => {
    if (!user) return;
    
    try {
      await MediaService.addToWatchlist(user.id, media.id);
      setWatchlist(prev => {
        if (prev.find(item => item.id === media.id)) {
          return prev;
        }
        return [...prev, media];
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (mediaId: string) => {
    if (!user) return;
    
    try {
      await MediaService.removeFromWatchlist(user.id, mediaId);
      setWatchlist(prev => prev.filter(item => item.id !== mediaId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const markAsWatched = async (mediaId: string, progress = 100) => {
    if (!user) return;
    
    try {
      await MediaService.recordWatchSession({
        userId: user.id,
        mediaItemId: mediaId,
        startedAt: new Date().toISOString(),
        progressSeconds: Math.floor((progress / 100) * 7200), // Assume 2 hour average
        totalRuntimeSeconds: 7200,
        completed: progress >= 100,
        deviceType: 'web',
      });
    } catch (error) {
      console.error('Error marking as watched:', error);
    }
  };

  return (
    <MediaContext.Provider value={{
      allMedia,
      recentlyWatched,
      continueWatching,
      trending,
      watchlist,
      getMediaById,
      addToWatchlist,
      removeFromWatchlist,
      markAsWatched,
      refreshMedia
    }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMediaContext = (): MediaContextType => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMediaContext must be used within a MediaProvider');
  }
  return context;
};