import React from 'react';
import { Star, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Novel, NovelStatus } from '../types';

interface NovelCardProps {
  novel: Novel;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel }) => {
  const getStatusColor = (status: NovelStatus) => {
    switch (status) {
      case NovelStatus.ONGOING: return 'bg-green-100 text-green-700';
      case NovelStatus.COMPLETE: return 'bg-blue-100 text-blue-700';
      case NovelStatus.HIATUS: return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Link to={`/novel/${novel.id}`} className="block h-full">
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 flex flex-col h-full group">
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden">
            <img 
            src={novel.coverUrl} 
            alt={novel.titleEn} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
            {novel.isNew && (
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm animate-pulse">
                NEW
                </span>
            )}
            {novel.isUp && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                UP
                </span>
            )}
            </div>
            
            <div className="absolute top-2 right-2">
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                    <Globe size={10} /> {novel.language}
                </span>
            </div>

            {novel.isCopyrighted && (
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-purple-900/90 to-transparent p-2 pt-8">
                <span className="text-white text-xs font-bold flex items-center justify-center">
                ✓ Copyrighted
                </span>
            </div>
            )}
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusColor(novel.status)}`}>
                {novel.status}
            </span>
            <div className="flex items-center text-yellow-500">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold ml-1 text-slate-600">{novel.rating}</span>
            </div>
            </div>

            <h3 className="font-semibold text-slate-800 text-sm md:text-base leading-tight mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {novel.titleEn}
            </h3>
            
            {novel.titleTh && (
                <p className="text-xs text-slate-500 line-clamp-1 mb-2">{novel.titleTh}</p>
            )}

            <div className="mt-auto pt-2 border-t border-gray-100 flex flex-wrap gap-1">
            {novel.genres.slice(0, 2).map((genre, idx) => (
                <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {genre}
                </span>
            ))}
            {novel.genres.length > 2 && <span className="text-[10px] text-slate-400">+More</span>}
            </div>
        </div>
        </div>
    </Link>
  );
};

export default NovelCard;