export interface Media {
  id: string;
  title: string;
  type: 'movie' | 'tv';
  description: string;
  poster: string;
  backdrop?: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  platform: string;
  trending?: boolean;
  progress?: number;
  lastWatched?: string;
  tagline?: string;
  media_cast?: Array<{
    name: string;
    character: string;
    profilePath?: string;
  }>;
  watchHistory?: Array<{
    watchedAt: string;
    season?: number;
    episode?: number;
    episodeTitle?: string;
    progress: number;
  }>;
}

export interface WatchSession {
  id: string;
  mediaId: string;
  startTime: string;
  endTime?: string;
  progress: number;
  platform: string;
  deviceType: string;
}