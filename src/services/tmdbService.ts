import { supabase } from '../lib/supabase';

export interface TMDBSearchResult {
  tmdb_id: number;
  title: string;
  type: 'movie' | 'tv';
  description: string;
  poster_url: string | null;
  backdrop_url: string | null;
  year: number | null;
  runtime: number | null;
  genres: string[];
  rating_tmdb: number;
  tagline: string | null;
  imdb_id: string | null;
  media_cast?: Array<{
    name: string;
    character: string;
    profile_path: string | null;
  }>;
  crew?: Array<{
    name: string;
    job: string;
    profile_path: string | null;
  }>;
}

export interface TMDBSearchResponse {
  results: TMDBSearchResult[];
  total_pages: number;
  total_results: number;
  page: number;
}

export class TMDBService {
  private static get EDGE_FUNCTION_URL() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL environment variable is required');
    }
    return `${supabaseUrl}/functions/v1/tmdb-search`;
  }

  private static async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('User not authenticated');
    }
    
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!anonKey) {
      throw new Error('VITE_SUPABASE_ANON_KEY environment variable is required');
    }
    
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  // Search for movies and TV shows
  static async searchMedia(
    query: string, 
    type: 'movie' | 'tv' | 'multi' = 'multi',
    page: number = 1
  ): Promise<TMDBSearchResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(this.EDGE_FUNCTION_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, type, page }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'TMDB search failed');
      }

      return await response.json();
    } catch (error) {
      console.error('TMDB search error:', error);
      throw error;
    }
  }

  // Get detailed information for a specific media item
  static async getMediaDetails(tmdbId: number, type: 'movie' | 'tv'): Promise<TMDBSearchResult> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.EDGE_FUNCTION_URL}/details/${tmdbId}?type=${type}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get media details');
      }

      return await response.json();
    } catch (error) {
      console.error('TMDB details error:', error);
      throw error;
    }
  }

  // Save TMDB data to local database
  static async saveToDatabase(tmdbData: TMDBSearchResult): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .upsert({
          tmdb_id: tmdbData.tmdb_id,
          title: tmdbData.title,
          type: tmdbData.type,
          description: tmdbData.description,
          poster_url: tmdbData.poster_url,
          backdrop_url: tmdbData.backdrop_url,
          year: tmdbData.year,
          runtime: tmdbData.runtime,
          genres: tmdbData.genres,
          rating_tmdb: tmdbData.rating_tmdb,
          tagline: tmdbData.tagline,
          imdb_id: tmdbData.imdb_id,
          media_cast: tmdbData.media_cast || [],
          crew: tmdbData.crew || [],
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'tmdb_id'
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error saving TMDB data to database:', error);
      throw error;
    }
  }

  // Search and save popular movies/TV shows for initial population
  static async populatePopularMedia(type: 'movie' | 'tv' = 'movie', pages: number = 3): Promise<void> {
    try {
      for (let page = 1; page <= pages; page++) {
        // Search for popular movies/shows using trending keywords
        const trendingQueries = type === 'movie' 
          ? ['action', 'comedy', 'drama', 'thriller', 'sci-fi']
          : ['drama', 'comedy', 'crime', 'fantasy', 'mystery'];
        
        for (const query of trendingQueries) {
          const searchResults = await this.searchMedia(query, type, 1);
          
          for (const result of searchResults.results.slice(0, 5)) {
            try {
              // Get detailed information including cast and crew
              const detailedData = await this.getMediaDetails(result.tmdb_id, result.type);
              await this.saveToDatabase(detailedData);
              
              // Add a delay to respect API rate limits
              await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
              console.warn(`Failed to save ${result.title}:`, error);
            }
          }
          
          // Delay between different query searches
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error populating popular media:', error);
      throw error;
    }
  }
}