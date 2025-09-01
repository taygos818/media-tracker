import { supabase } from '../lib/supabase';
import { TMDBService, TMDBSearchResult } from './tmdbService';
import type { Database } from '../lib/supabase';

type MediaItem = Database['public']['Tables']['media_items']['Row'];
type WatchSession = Database['public']['Tables']['watch_sessions']['Row'];
type Platform = Database['public']['Tables']['platforms']['Row'];

export class MediaService {
  // Get all media items
  static async getAllMedia() {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205') {
          console.warn('media_items table does not exist yet');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.warn('Media items table not found, returning empty array');
      return [];
    }
  }

  // Get media item by ID
  static async getMediaById(id: string) {
    const { data, error } = await supabase
      .from('media_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Search media items
  static async searchMedia(query: string, filters?: {
    type?: 'movie' | 'tv';
    genre?: string;
    year?: number;
    includeTMDB?: boolean;
  }) {
    // First search local database
    let localQueryBuilder = supabase
      .from('media_items')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (filters?.type) {
      localQueryBuilder = localQueryBuilder.eq('type', filters.type);
    }

    if (filters?.year) {
      localQueryBuilder = localQueryBuilder.eq('year', filters.year);
    }

    if (filters?.genre) {
      localQueryBuilder = localQueryBuilder.contains('genres', [filters.genre]);
    }

    const { data: localData, error: localError } = await localQueryBuilder
      .order('rating_tmdb', { ascending: false })
      .limit(50);

    if (localError) throw localError;

    // If no local results and TMDB search is enabled, search TMDB
    if ((!localData || localData.length === 0) && filters?.includeTMDB && query.trim()) {
      try {
        const tmdbResults = await TMDBService.searchMedia(
          query, 
          filters.type === 'movie' || filters.type === 'tv' ? filters.type : 'multi'
        );
        
        // Convert TMDB results to match our local data structure
        const convertedResults = tmdbResults.results.map(tmdbItem => ({
          id: `tmdb-${tmdbItem.tmdb_id}`, // Temporary ID for TMDB results
          tmdb_id: tmdbItem.tmdb_id,
          imdb_id: tmdbItem.imdb_id,
          title: tmdbItem.title,
          type: tmdbItem.type,
          description: tmdbItem.description,
          poster_url: tmdbItem.poster_url,
          backdrop_url: tmdbItem.backdrop_url,
          year: tmdbItem.year,
          runtime: tmdbItem.runtime,
          genres: tmdbItem.genres,
          rating_imdb: null,
          rating_tmdb: tmdbItem.rating_tmdb,
          tagline: tmdbItem.tagline,
          media_cast: tmdbItem.media_cast || [],
          crew: tmdbItem.crew || [],
          metadata: { source: 'tmdb', is_local: false },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        return convertedResults;
      } catch (error) {
        console.warn('TMDB search failed, returning local results only:', error);
        return localData || [];
      }
    }

    return localData || [];
  }

  // Get user's watch history
  static async getWatchHistory(userId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('watch_sessions')
      .select(`
        *,
        media_items(*),
        platforms(name, icon_url)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Get continue watching (incomplete sessions)
  static async getContinueWatching(userId: string) {
    const { data, error } = await supabase
      .from('watch_sessions')
      .select(`
        *,
        media_items(*),
        platforms(name, icon_url)
      `)
      .eq('user_id', userId)
      .eq('completed', false)
      .order('started_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  }

  // Record a watch session
  static async recordWatchSession(session: {
    userId: string;
    mediaItemId: string;
    platformId?: string;
    startedAt: string;
    endedAt?: string;
    progressSeconds: number;
    totalRuntimeSeconds?: number;
    completed?: boolean;
    seasonNumber?: number;
    episodeNumber?: number;
    episodeTitle?: string;
    deviceType?: string;
  }) {
    const { data, error } = await supabase
      .from('watch_sessions')
      .insert({
        user_id: session.userId,
        media_item_id: session.mediaItemId,
        platform_id: session.platformId,
        started_at: session.startedAt,
        ended_at: session.endedAt,
        progress_seconds: session.progressSeconds,
        total_runtime_seconds: session.totalRuntimeSeconds,
        completed: session.completed || false,
        season_number: session.seasonNumber,
        episode_number: session.episodeNumber,
        episode_title: session.episodeTitle,
        device_type: session.deviceType,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update watch session progress
  static async updateWatchProgress(sessionId: string, updates: {
    progressSeconds: number;
    endedAt?: string;
    completed?: boolean;
  }) {
    const { data, error } = await supabase
      .from('watch_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user's watchlist
  static async getWatchlist(userId: string) {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          *,
          media_items(*)
        `)
        .eq('user_id', userId)
        .order('added_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205') {
          console.warn('watchlist table does not exist yet');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.warn('Watchlist table not found, returning empty array');
      return [];
    }
  }

  // Add to watchlist
  static async addToWatchlist(userId: string, mediaItemId: string, priority: number = 0, notes?: string) {
    const { data, error } = await supabase
      .from('watchlist')
      .insert({
        user_id: userId,
        media_item_id: mediaItemId,
        priority,
        notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Remove from watchlist
  static async removeFromWatchlist(userId: string, mediaItemId: string) {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('media_item_id', mediaItemId);

    if (error) throw error;
  }

  // Get user rating for media
  static async getUserRating(userId: string, mediaItemId: string) {
    const { data, error } = await supabase
      .from('user_ratings')
      .select('*')
      .eq('user_id', userId)
      .eq('media_item_id', mediaItemId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  }

  // Rate media
  static async rateMedia(userId: string, mediaItemId: string, rating: number, review?: string) {
    const { data, error } = await supabase
      .from('user_ratings')
      .upsert({
        user_id: userId,
        media_item_id: mediaItemId,
        rating,
        review,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get viewing statistics
  static async getViewingStats(userId: string, timeRange?: {
    startDate: string;
    endDate: string;
  }) {
    let queryBuilder = supabase
      .from('watch_sessions')
      .select(`
        progress_seconds,
        total_runtime_seconds,
        completed,
        started_at,
        media_items(type, genres),
        platforms(name)
      `)
      .eq('user_id', userId);

    if (timeRange) {
      queryBuilder = queryBuilder
        .gte('started_at', timeRange.startDate)
        .lte('started_at', timeRange.endDate);
    }

    const { data, error } = await queryBuilder
      .order('started_at', { ascending: false });

    if (error) throw error;

    // Calculate statistics
    const totalHours = data.reduce((sum, session) => {
      return sum + (session.progress_seconds / 3600);
    }, 0);

    const completedItems = data.filter(session => session.completed).length;
    const genreCounts: Record<string, number> = {};
    const platformCounts: Record<string, number> = {};

    data.forEach(session => {
      // Count genres
      if (session.media_items?.genres) {
        session.media_items.genres.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }

      // Count platforms
      if (session.platforms?.name) {
        platformCounts[session.platforms.name] = (platformCounts[session.platforms.name] || 0) + 1;
      }
    });

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      totalSessions: data.length,
      completedItems,
      topGenres: Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      platformBreakdown: Object.entries(platformCounts)
        .sort(([,a], [,b]) => b - a),
      sessions: data,
    };
  }

  // Get all platforms
  static async getPlatforms() {
    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  // Add or update media item (for API integrations)
  static async upsertMediaItem(mediaData: Partial<MediaItem> & {
    tmdb_id?: number;
    title: string;
    type: 'movie' | 'tv';
  }) {
    const { data, error } = await supabase
      .from('media_items')
      .upsert(mediaData, {
        onConflict: mediaData.tmdb_id ? 'tmdb_id' : undefined,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Import media item from TMDB
  static async importFromTMDB(tmdbId: number, type: 'movie' | 'tv'): Promise<MediaItem> {
    try {
      // Get detailed data from TMDB
      const tmdbData = await TMDBService.getMediaDetails(tmdbId, type);
      
      // Save to local database
      const mediaId = await TMDBService.saveToDatabase(tmdbData);
      
      // Return the saved media item
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('id', mediaId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error importing from TMDB:', error);
      throw error;
    }
  }
}