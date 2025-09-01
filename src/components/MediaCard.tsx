import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Play } from 'lucide-react';
import { Media } from '../types/media';

interface MediaCardProps {
  media: Media;
  showProgress?: boolean;
  viewMode?: 'grid' | 'list';
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, showProgress, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <Link
        to={`/media/${media.id}`}
        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors flex items-center gap-4"
      >
        <img
          src={media.poster}
          alt={media.title}
          className="w-16 h-24 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{media.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{media.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>{media.rating}</span>
            </div>
            <span>{media.year}</span>
            <span className="px-2 py-1 bg-gray-700 rounded text-xs">{media.platform}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/media/${media.id}`} className="group cursor-pointer">
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-300 group-hover:scale-105">
        <div className="relative">
          <img
            src={media.poster}
            alt={media.title}
            className="w-full aspect-[2/3] object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-12 h-12 text-white" />
          </div>
          
          {showProgress && media.progress && (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="bg-gray-900/80 p-2">
                <div className="w-full bg-gray-600 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${media.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-300 mt-1">{media.progress}% complete</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
            {media.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">
            {media.description}
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-gray-300">{media.rating}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{media.runtime}m</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{media.year}</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
              {media.platform}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};