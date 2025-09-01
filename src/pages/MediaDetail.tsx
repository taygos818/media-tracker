import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Star, Clock, Calendar, Users } from 'lucide-react';
import { useMediaContext } from '../context/MediaContext';

export const MediaDetail: React.FC = () => {
  const { id } = useParams();
  const { getMediaById, addToWatchlist } = useMediaContext();
  
  const media = getMediaById(id!);

  if (!media) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Media not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link 
        to="/watchlist"
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Watchlist
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={media.poster}
              alt={media.title}
              className="w-full aspect-[2/3] object-cover"
            />
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Watch Now
                </button>
                <button 
                  onClick={() => addToWatchlist(media)}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium">{media.rating}/10</span>
                  <span className="text-gray-400 text-sm">IMDb</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{media.runtime} minutes</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{media.year}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{media.platform}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h3 className="font-medium mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-gray-700 text-sm rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6"> {/* Changed from media.cast to media.media_cast */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{media.title}</h1>
            <p className="text-xl text-gray-400 mb-6">{media.tagline}</p>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-300 leading-relaxed">{media.description}</p>
            </div>
          </div>
          
          {media.media_cast && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Media Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> {/* Changed from media.cast to media.media_cast */}
                {media.media_cast.slice(0, 6).map((actor, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2"></div>
                    <div className="font-medium text-sm">{actor.name}</div>
                    <div className="text-gray-400 text-xs">{actor.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {media.watchHistory && media.watchHistory.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Watch History</h3>
              <div className="space-y-3">
                {media.watchHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                    <div>
                      <div className="font-medium">
                        {media.type === 'tv' ? `S${entry.season}E${entry.episode}` : 'Movie'}
                      </div>
                      {entry.episodeTitle && (
                        <div className="text-sm text-gray-400">{entry.episodeTitle}</div>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(entry.watchedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};