import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (generated from schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_items: {
        Row: {
          id: string;
          tmdb_id: number | null;
          imdb_id: string | null;
          title: string;
          type: 'movie' | 'tv';
          description: string | null;
          poster_url: string | null;
          backdrop_url: string | null;
          year: number | null;
          runtime: number | null;
          genres: any;
          rating_imdb: number | null;
          rating_tmdb: number | null;
          tagline: string | null;
          media_cast: any;
          crew: any;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tmdb_id?: number | null;
          imdb_id?: string | null;
          title: string;
          type: 'movie' | 'tv';
          description?: string | null;
          poster_url?: string | null;
          backdrop_url?: string | null;
          year?: number | null;
          runtime?: number | null;
          genres?: any;
          rating_imdb?: number | null;
          rating_tmdb?: number | null;
          tagline?: string | null;
          media_cast?: any;
          crew?: any;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tmdb_id?: number | null;
          imdb_id?: string | null;
          title?: string;
          type?: 'movie' | 'tv';
          description?: string | null;
          poster_url?: string | null;
          backdrop_url?: string | null;
          year?: number | null;
          runtime?: number | null;
          genres?: any;
          rating_imdb?: number | null;
          rating_tmdb?: number | null;
          tagline?: string | null;
          media_cast?: any;
          crew?: any;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      platforms: {
        Row: {
          id: string;
          name: string;
          type: 'streaming' | 'personal' | 'other';
          api_endpoint: string | null;
          requires_auth: boolean;
          icon_url: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: 'streaming' | 'personal' | 'other';
          api_endpoint?: string | null;
          requires_auth?: boolean;
          icon_url?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'streaming' | 'personal' | 'other';
          api_endpoint?: string | null;
          requires_auth?: boolean;
          icon_url?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      user_integrations: {
        Row: {
          id: string;
          user_id: string;
          platform_id: string;
          status: 'connected' | 'disconnected' | 'error';
          encrypted_credentials: string | null;
          last_sync: string | null;
          sync_enabled: boolean;
          sync_interval_minutes: number | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform_id: string;
          status?: 'connected' | 'disconnected' | 'error';
          encrypted_credentials?: string | null;
          last_sync?: string | null;
          sync_enabled?: boolean;
          sync_interval_minutes?: number | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform_id?: string;
          status?: 'connected' | 'disconnected' | 'error';
          encrypted_credentials?: string | null;
          last_sync?: string | null;
          sync_enabled?: boolean;
          sync_interval_minutes?: number | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      watch_sessions: {
        Row: {
          id: string;
          user_id: string;
          media_item_id: string;
          platform_id: string | null;
          started_at: string;
          ended_at: string | null;
          progress_seconds: number;
          total_runtime_seconds: number | null;
          completed: boolean;
          season_number: number | null;
          episode_number: number | null;
          episode_title: string | null;
          device_type: string | null;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          media_item_id: string;
          platform_id?: string | null;
          started_at: string;
          ended_at?: string | null;
          progress_seconds?: number;
          total_runtime_seconds?: number | null;
          completed?: boolean;
          season_number?: number | null;
          episode_number?: number | null;
          episode_title?: string | null;
          device_type?: string | null;
          metadata?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          media_item_id?: string;
          platform_id?: string | null;
          started_at?: string;
          ended_at?: string | null;
          progress_seconds?: number;
          total_runtime_seconds?: number | null;
          completed?: boolean;
          season_number?: number | null;
          episode_number?: number | null;
          episode_title?: string | null;
          device_type?: string | null;
          metadata?: any;
          created_at?: string;
        };
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          media_item_id: string;
          added_at: string;
          priority: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          media_item_id: string;
          added_at?: string;
          priority?: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          media_item_id?: string;
          added_at?: string;
          priority?: number;
          notes?: string | null;
        };
      };
      user_ratings: {
        Row: {
          id: string;
          user_id: string;
          media_item_id: string;
          rating: number;
          review: string | null;
          rated_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          media_item_id: string;
          rating: number;
          review?: string | null;
          rated_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          media_item_id?: string;
          rating?: number;
          review?: string | null;
          rated_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}