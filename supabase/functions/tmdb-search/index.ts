/*
  # The Movie Database (TMDB) Search Integration

  Secure TMDB API integration using Supabase secrets.
  Searches movies/TV shows and fetches detailed metadata.

  API Key stored as Supabase secret: TMDB_API_KEY
*/

interface TMDBSearchRequest {
  query: string;
  type?: 'movie' | 'tv' | 'multi';
  page?: number;
}

interface TMDBDetailsRequest {
  tmdb_id: number;
  type: 'movie' | 'tv';
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
    if (!TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY not configured');
    }

    const url = new URL(req.url);
    const path = url.pathname;

    // Handle search requests
    if (req.method === 'POST' && path.endsWith('/tmdb-search')) {
      const { query, type = 'multi', page = 1 }: TMDBSearchRequest = await req.json();

      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Query parameter is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const searchUrl = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      // Transform TMDB data to match our database schema
      const transformedResults = data.results?.map((item: any) => transformTMDBItem(item)) || [];

      return new Response(
        JSON.stringify({
          results: transformedResults,
          total_pages: data.total_pages,
          total_results: data.total_results,
          page: data.page
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Handle detailed information requests
    if (req.method === 'GET' && path.includes('/details/')) {
      const pathParts = path.split('/');
      const tmdb_id = pathParts[pathParts.length - 1];
      const type = url.searchParams.get('type') || 'movie';

      if (!tmdb_id || isNaN(Number(tmdb_id))) {
        return new Response(
          JSON.stringify({ error: 'Valid TMDB ID is required' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const detailsUrl = `https://api.themoviedb.org/3/${type}/${tmdb_id}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
      
      const response = await fetch(detailsUrl);
      const data = await response.json();

      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: 'Media item not found' }),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const transformedData = transformTMDBItem(data, true);

      return new Response(
        JSON.stringify(transformedData),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('TMDB API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function transformTMDBItem(item: any, includeCredits = false) {
  const isMovie = item.title !== undefined;
  const type = isMovie ? 'movie' : 'tv';

  const transformed = {
    tmdb_id: item.id,
    title: isMovie ? item.title : item.name,
    type: type,
    description: item.overview || '',
    poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    backdrop_url: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
    year: isMovie 
      ? (item.release_date ? new Date(item.release_date).getFullYear() : null)
      : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : null),
    runtime: item.runtime || (item.episode_run_time ? item.episode_run_time[0] : null),
    genres: item.genres ? item.genres.map((g: any) => g.name) : 
            item.genre_ids ? item.genre_ids.map((id: number) => getGenreNameById(id)) : [],
    rating_tmdb: item.vote_average || 0,
    tagline: item.tagline || null,
    imdb_id: item.imdb_id || null,
  };

  // Add cast and crew if detailed data is requested
  if (includeCredits && item.credits) {
    transformed.media_cast = item.credits.cast?.slice(0, 10).map((person: any) => ({
      name: person.name,
      character: person.character,
      profile_path: person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : null
    })) || [];

    transformed.crew = item.credits.crew?.filter((person: any) => 
      ['Director', 'Producer', 'Writer', 'Executive Producer'].includes(person.job)
    ).map((person: any) => ({
      name: person.name,
      job: person.job,
      profile_path: person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : null
    })) || [];
  }

  return transformed;
}

// Genre mapping for search results that only include genre IDs
function getGenreNameById(id: number): string {
  const genreMap: Record<number, string> = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
    10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
  };
  return genreMap[id] || 'Unknown';
}