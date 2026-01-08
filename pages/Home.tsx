import React from 'react';
import { MOCK_NOVELS } from '../constants';
import NovelCard from '../components/NovelCard';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const newNovels = MOCK_NOVELS.filter(n => n.isNew).slice(0, 6);
  const updatedNovels = MOCK_NOVELS.filter(n => n.isUp).slice(0, 6);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section - Full Cover No Text as requested */}
      <div className="w-full h-[50vh] md:h-[70vh] relative mt-16 overflow-hidden bg-slate-900 group">
        <img 
          src="https://picsum.photos/1920/1080?blur=2" 
          alt="Cover" 
          className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
      </div>

      {/* Intro Text (Thai) */}
      <div className="container mx-auto px-4 -mt-20 relative z-10 mb-16">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/50 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
                ยินดีต้อนรับสู่ LinguaVerse
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                ศูนย์รวมนิยายแปลคุณภาพจากทั่วทุกมุมโลก ไม่ว่าจะเป็น จีน เกาหลี ญี่ปุ่น หรืออังกฤษ 
                เราคัดสรรเรื่องราวที่น่าประทับใจมาให้คุณได้อ่านอย่างจุใจ พร้อมระบบการอ่านที่ทันสมัย 
                และชุมชนนักอ่านที่อบอุ่น
            </p>
            <div className="mt-6 flex justify-center gap-4">
                <Link to="/novels" className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all flex items-center gap-2">
                    <BookOpen size={18} />
                    เริ่มอ่านเลย
                </Link>
            </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="container mx-auto px-4 space-y-16">
        
        {/* New Novels */}
        <section>
          <div className="flex items-center justify-between mb-6 border-l-4 border-purple-500 pl-4">
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="text-yellow-500" />
              New Arrivals
              <span className="text-sm font-normal text-slate-400 ml-2 hidden md:inline">Discover fresh stories</span>
            </h2>
            <Link to="/novels" className="text-purple-600 hover:text-pink-600 flex items-center gap-1 text-sm font-semibold transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {newNovels.map(novel => (
              <div key={novel.id} className="h-full">
                <NovelCard novel={novel} />
              </div>
            ))}
          </div>
        </section>

        {/* Updated Novels */}
        <section>
          <div className="flex items-center justify-between mb-6 border-l-4 border-pink-500 pl-4">
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 p-1 rounded-md text-sm align-middle">UP</span>
              Recently Updated
              <span className="text-sm font-normal text-slate-400 ml-2 hidden md:inline">Don't miss the latest chapters</span>
            </h2>
            <Link to="/novels" className="text-pink-600 hover:text-purple-600 flex items-center gap-1 text-sm font-semibold transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {updatedNovels.map(novel => (
              <div key={novel.id} className="h-full">
                <NovelCard novel={novel} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;