import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_NOVELS } from '../constants';
import NovelCard from '../components/NovelCard';
import { NovelStatus, NOVEL_GENRES, NovelLanguage } from '../types';
import { Search, Filter, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 48; // Close to 50 but divisible by grid columns 2,3,4,6

const Novels: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<NovelLanguage | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<NovelStatus | 'All'>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

  // Filter Logic
  const filteredNovels = useMemo(() => {
    return MOCK_NOVELS.filter(novel => {
      // Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        novel.titleEn.toLowerCase().includes(searchLower) || 
        novel.titleTh?.toLowerCase().includes(searchLower) ||
        novel.titleOriginal?.toLowerCase().includes(searchLower);

      // Language
      const matchesLang = selectedLanguage === 'All' || novel.language === selectedLanguage;

      // Status
      const matchesStatus = selectedStatus === 'All' || novel.status === selectedStatus;

      // Genre
      const matchesGenre = selectedGenre === 'All' || novel.genres.includes(selectedGenre);

      return matchesSearch && matchesLang && matchesStatus && matchesGenre;
    });
  }, [searchQuery, selectedLanguage, selectedStatus, selectedGenre]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredNovels.length / ITEMS_PER_PAGE);
  const currentNovels = filteredNovels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Coming Soon handler for incomplete filters mentioned in prompt
  const handleComingSoonFilter = () => {
     // Actually implemented them, but if user wants strictly "Coming Soon" behavior for specific UI parts:
     // Swal.fire(...)
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-800 border-l-8 border-purple-600 pl-4">
            Library
          </h1>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Title (EN, TH, Original)..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow shadow-sm"
            />
          </div>
        </div>

        {/* Filters & Tabs Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          
          {/* Language Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
             {['All', ...Object.values(NovelLanguage).filter(k => k !== 'All')].map((lang) => (
               <button
                 key={lang}
                 onClick={() => { setSelectedLanguage(lang as any); setCurrentPage(1); }}
                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                   selectedLanguage === lang 
                     ? 'bg-purple-600 text-white shadow-md transform scale-105' 
                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                 }`}
               >
                 {lang === 'All' ? 'All Languages' : lang}
               </button>
             ))}
          </div>

          {/* Advanced Filters (Toggleable on mobile) */}
          <div className="md:hidden mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-purple-600 font-medium"
            >
              <SlidersHorizontal size={18} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {['All', ...Object.values(NovelStatus)].map(status => (
                  <button
                    key={status}
                    onClick={() => { setSelectedStatus(status as any); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                       selectedStatus === status
                       ? 'bg-pink-50 border-pink-500 text-pink-700'
                       : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Genre</label>
              <select 
                value={selectedGenre}
                onChange={(e) => { setSelectedGenre(e.target.value); setCurrentPage(1); }}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="All">All Genres</option>
                {NOVEL_GENRES.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-500">
           Showing {filteredNovels.length} results
        </div>

        {/* Novels Grid */}
        {filteredNovels.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {currentNovels.map(novel => (
              <div key={novel.id} className="h-full">
                <NovelCard novel={novel} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700">No novels found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All');
                setSelectedLanguage('All');
                setSelectedStatus('All');
              }}
              className="mt-4 text-purple-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-1">
              {/* Simplified pagination for UX */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to keep current page centered if possible is complex for this snippet, 
                // using simple logic for demo: showing first 5 or shifting window.
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                   pageNum = currentPage - 2 + i;
                }
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="flex items-end px-2 text-gray-400">...</span>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Novels;