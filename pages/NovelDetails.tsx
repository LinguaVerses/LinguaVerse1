import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_NOVELS } from '../constants';
import { UserProfile, Novel, NotificationItem } from '../types';
import NovelCard from '../components/NovelCard';
import { 
  Heart, Share2, BookOpen, Clock, Eye, Star, ChevronDown, ChevronUp, 
  Lock, Unlock, Coins, List, Coffee, Gift
} from 'lucide-react';
import Swal from 'sweetalert2';

interface Chapter {
  id: number;
  number: number;
  title: string;
  price: number;
  isUnlocked: boolean;
  date: string;
}

interface NovelDetailsProps {
  user: UserProfile | null;
  updateUserPoints: (newPoints: number) => void;
  onOpenAuth: () => void;
  onSendNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
}

const NovelDetails: React.FC<NovelDetailsProps> = ({ user, updateUserPoints, onOpenAuth, onSendNotification }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [novel, setNovel] = useState<Novel | undefined>(undefined);
  const [otherWorks, setOtherWorks] = useState<Novel[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [visibleChaptersCount, setVisibleChaptersCount] = useState(50);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    // 1. Fetch Novel Data
    const foundNovel = MOCK_NOVELS.find(n => n.id === id);
    if (!foundNovel) {
      // Handle not found
      return;
    }
    setNovel(foundNovel);
    setLikeCount(Math.floor(Math.random() * 5000) + 100); // Mock like count

    // 2. Fetch Other Works by Author
    const others = MOCK_NOVELS.filter(n => n.author === foundNovel.author && n.id !== foundNovel.id).slice(0, 5);
    setOtherWorks(others);

    // 3. Generate Mock Chapters
    const totalChapters = 300;
    const generatedChapters: Chapter[] = Array.from({ length: totalChapters }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      title: `The Beginning of the Journey Part ${i + 1}`,
      price: i < 10 ? 0 : 5, // First 10 free, then 5 points
      isUnlocked: i < 10, // Default unlocked first 10
      date: '2023-10-27'
    }));
    setChapters(generatedChapters);
    
    // Reset View State
    window.scrollTo(0, 0);
    setIsDescExpanded(false);
    setVisibleChaptersCount(50);
  }, [id]);

  const descriptionParagraphs = useMemo(() => {
    if (!novel?.description) return [];
    // Split by newline and filter out empty strings
    return novel.description.split('\n').filter(p => p.trim() !== '');
  }, [novel]);

  if (!novel) {
    return (
        <div className="min-h-screen pt-24 flex justify-center text-slate-500">
            Loading...
        </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const navigateToReader = (chapterId: number) => {
       navigate(`/read/${novel.id}/${chapterId}`);
  };

  const handleUnlockChapter = (chapter: Chapter) => {
    if (chapter.isUnlocked) {
      navigateToReader(chapter.number);
      return;
    }

    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You need to be logged in to unlock chapters.',
        confirmButtonText: 'Login / Sign Up',
        confirmButtonColor: '#9333ea',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          onOpenAuth();
        }
      });
      return;
    }

    if (user.points < chapter.price) {
      Swal.fire({
        icon: 'error',
        title: 'Insufficient Points',
        text: `You have ${user.points} points, but this chapter costs ${chapter.price}.`,
        footer: '<a href="#" class="text-purple-600 hover:underline">Top up points</a>',
        confirmButtonColor: '#9333ea'
      });
      return;
    }

    Swal.fire({
      title: 'Unlock Chapter?',
      text: `Unlock Chapter ${chapter.number} for ${chapter.price} points?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, unlock it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Deduct points
        const newPoints = user.points - chapter.price;
        updateUserPoints(newPoints);
        
        // Update local chapter state
        setChapters(prev => prev.map(c => 
          c.id === chapter.id ? { ...c, isUnlocked: true } : c
        ));

        Swal.fire({
          icon: 'success',
          title: 'Unlocked!',
          text: `You have ${newPoints} points remaining.`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
            // Auto navigate after unlock
            navigateToReader(chapter.number);
        });
      }
    });
  };

  const handleSupport = (amount: number, cupSize: string) => {
      if(!user) {
          onOpenAuth();
          return;
      }
      
      // Mock QR Code API (using a placeholder service for visual representation)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PromptPay-${amount}-THB`;

      Swal.fire({
          title: `<div class="flex flex-col items-center gap-2"><span class="text-2xl">☕</span> <span class="text-purple-700 font-bold">Buy Writer a ${cupSize}!</span></div>`,
          html: `
            <div class="flex flex-col items-center">
                <p class="text-gray-600 mb-4 text-sm">Scan QR via PromptPay to support <b>${amount} THB</b></p>
                <div class="p-2 bg-white border-2 border-dashed border-purple-200 rounded-xl mb-4 shadow-inner">
                    <img src="${qrCodeUrl}" alt="PromptPay QR" class="w-48 h-48 object-contain rounded-lg" />
                </div>
                <div class="w-full text-left">
                    <label class="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Leave a message (Optional)</label>
                    <input id="support-message" class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm transition-all" placeholder="Cheer up the writer!..." maxlength="100">
                </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Send Support & Message',
          confirmButtonColor: '#9333ea', // Purple-600
          cancelButtonText: 'Cancel',
          showLoaderOnConfirm: true,
          preConfirm: async () => {
              const message = (document.getElementById('support-message') as HTMLInputElement).value;
              // Simulate API delay
              await new Promise(resolve => setTimeout(resolve, 1500));
              return message;
          },
          allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
          if (result.isConfirmed) {
              const message = result.value;
              
              // SEND NOTIFICATION TO WRITER
              onSendNotification({
                  type: 'COFFEE',
                  senderId: user.uid,
                  senderName: user.username,
                  targetUserRole: 'writer',
                  title: 'Coffee Support! ☕',
                  message: `${cupSize} from ${user.username}: "${message || 'No message'}"`,
                  data: { amount, cupSize, novelTitle: novel.titleEn }
              });

              Swal.fire({
                  icon: 'success',
                  title: 'Thank You! ❤️',
                  text: 'Your support has been sent to the writer.',
                  timer: 2000,
                  showConfirmButton: false,
                  backdrop: `
                    rgba(0,0,123,0.4)
                    url("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2J6eHl5aDExbWJqYnl4aGZ6bWx5bWJqYnl4aGZ6bWx5bWJqeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/LpDmM2wSt6aSGSf0kU/giphy.gif")
                    left top
                    no-repeat
                  `
              });
          }
      });
  };

  const visibleChapters = chapters.slice(0, visibleChaptersCount);

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      
      {/* 1. HERO SECTION WITH BLURRED BACKDROP */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-60"
          style={{ backgroundImage: `url(${novel.coverUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/70 to-slate-50"></div>
        
        <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 w-full items-center md:items-end">
            
            {/* Cover Image */}
            <div className="w-48 md:w-64 flex-shrink-0 rounded-lg shadow-2xl border-4 border-white/20 overflow-hidden transform md:translate-y-16">
              <img src={novel.coverUrl} alt={novel.titleEn} className="w-full h-auto" />
            </div>

            {/* Header Info */}
            <div className="flex-grow text-center md:text-left text-white mb-4">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                 <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                   {novel.status}
                 </span>
                 <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                   {novel.language}
                 </span>
                 {novel.isCopyrighted && (
                     <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                         LC
                     </span>
                 )}
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                {novel.titleEn}
              </h1>
              {novel.titleTh && (
                  <h2 className="text-lg md:text-xl text-slate-200 font-light mb-4">
                      {novel.titleTh}
                  </h2>
              )}

              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm md:text-base text-slate-200 mb-6">
                <div className="flex items-center gap-2">
                   <span className="opacity-70">Author:</span>
                   <span className="font-semibold text-white hover:text-pink-400 cursor-pointer transition-colors">{novel.author}</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                        <Star className="text-yellow-400" fill="currentColor" size={18} />
                        <span className="font-bold text-white">{novel.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye size={18} />
                        <span>1.2M</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <List size={18} />
                        <span>{chapters.length} Ch</span>
                    </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center md:justify-start">
                 <button 
                    onClick={() => navigateToReader(1)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-purple-500/30 transition-all transform hover:scale-105 flex items-center gap-2"
                 >
                    <BookOpen size={20} /> Start Reading
                 </button>
                 <button 
                    onClick={handleLike}
                    className={`px-6 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 border ${isLiked ? 'bg-pink-100 border-pink-500 text-pink-600' : 'bg-white/10 border-white/20 backdrop-blur-sm text-white hover:bg-white/20'}`}
                 >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce" : ""} /> 
                    {likeCount}
                 </button>
                 <button className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all">
                    <Share2 size={20} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 md:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* SYNOPSIS - UPDATED FORMATTING */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-l-4 border-purple-500 pl-3">
                    Synopsis
                </h3>
                
                {/* Formatting Logic */}
                <div className={`relative transition-all duration-500 ease-in-out ${!isDescExpanded ? 'max-h-48 overflow-hidden' : 'max-h-full'}`}>
                   <div className="text-slate-700 text-lg leading-relaxed font-light">
                      {/* Repeat paragraph check just for demo if description is short, but we improved constants */}
                      {descriptionParagraphs.map((para, idx) => (
                          <p key={idx} className="mb-4 indent-8 text-justify">
                              {para}
                          </p>
                      ))}
                      {/* Fallback duplication if array is small for visual testing */}
                      {descriptionParagraphs.length === 1 && (
                         <>
                            <p className="mb-4 indent-8 text-justify">{descriptionParagraphs[0]}</p>
                            <p className="mb-4 indent-8 text-justify">{descriptionParagraphs[0]}</p>
                         </>
                      )}
                   </div>
                   
                   {!isDescExpanded && (
                       <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/90 to-transparent"></div>
                   )}
                </div>

                <button 
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="mt-2 text-purple-600 font-semibold text-sm flex items-center gap-1 hover:text-purple-800 transition-colors w-full justify-center py-2"
                >
                    {isDescExpanded ? (
                        <>Show Less <ChevronUp size={16} /></>
                    ) : (
                        <>Read More <ChevronDown size={16} /></>
                    )}
                </button>

                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <span className="text-sm text-slate-400 mr-2 flex items-center">Tags:</span>
                    {novel.genres.map(genre => (
                        <span key={genre} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer">
                            #{genre}
                        </span>
                    ))}
                </div>
            </section>

            {/* CHAPTER LIST */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-l-4 border-pink-500 pl-3">
                        Table of Contents
                    </h3>
                    <div className="text-sm text-slate-500">
                        Total {chapters.length} Chapters
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {visibleChapters.map((chapter) => (
                        <div 
                            key={chapter.id} 
                            onClick={() => handleUnlockChapter(chapter)}
                            className={`p-4 hover:bg-purple-50 transition-colors cursor-pointer flex items-center justify-between group ${!chapter.isUnlocked && 'opacity-90'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-slate-400 font-mono w-8 text-right text-sm">#{chapter.number}</span>
                                <div className="flex flex-col">
                                    <span className={`font-medium ${chapter.isUnlocked ? 'text-slate-700 group-hover:text-purple-700' : 'text-slate-500'}`}>
                                        {chapter.title}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock size={10} /> {chapter.date}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                {chapter.isUnlocked ? (
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
                                        <Unlock size={12} /> Free/Owned
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1 group-hover:bg-purple-200 group-hover:text-purple-800 transition-colors">
                                        <Coins size={12} className="text-yellow-500" /> {chapter.price}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {visibleChaptersCount < chapters.length && (
                    <div className="p-4 text-center border-t border-gray-100 bg-slate-50/50">
                        <button 
                            onClick={() => setVisibleChaptersCount(prev => prev + 50)}
                            className="text-purple-600 font-semibold hover:text-purple-800 transition-colors text-sm"
                        >
                            Load Next 50 Chapters
                        </button>
                    </div>
                )}
            </section>
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="space-y-8">
            
            {/* --- SUPPORT WRITER SECTION (NEW) --- */}
            <section className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-sm border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-2xl opacity-50 transform translate-x-8 -translate-y-8"></div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2 relative z-10">
                    <Coffee size={22} className="text-amber-700" strokeWidth={2.5} />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-600">
                        Buy me a Coffee
                    </span>
                </h3>
                <p className="text-sm text-slate-500 mb-6 relative z-10">
                    Love the story? Support the writer's caffeine addiction! ☕✨
                </p>

                <div className="grid grid-cols-1 gap-3 relative z-10">
                    <button 
                        onClick={() => handleSupport(25, 'Small Cup')}
                        className="group flex items-center justify-between p-3 rounded-xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:animate-bounce">
                                <Coffee size={18} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-slate-700 text-sm">Small Cup</div>
                                <div className="text-xs text-slate-400">Just a sip</div>
                            </div>
                        </div>
                        <span className="font-bold text-purple-600">25 ฿</span>
                    </button>

                    <button 
                        onClick={() => handleSupport(50, 'Medium Cup')}
                        className="group flex items-center justify-between p-3 rounded-xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:animate-bounce">
                                <Coffee size={22} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-slate-700 text-sm">Medium Cup</div>
                                <div className="text-xs text-slate-400">Keep 'em writing</div>
                            </div>
                        </div>
                        <span className="font-bold text-purple-600">50 ฿</span>
                    </button>

                    <button 
                        onClick={() => handleSupport(100, 'Large Cup')}
                        className="group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:animate-bounce">
                                <Gift size={22} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white text-sm">Large Cup</div>
                                <div className="text-xs text-purple-100">Super Energy!</div>
                            </div>
                        </div>
                        <span className="font-bold text-white bg-white/20 px-2 py-1 rounded-md">100 ฿</span>
                    </button>
                </div>
            </section>

            {/* OTHER WORKS */}
            <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-pink-500" />
                    Other Works by {novel.author}
                </h3>
                
                {otherWorks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                        {otherWorks.map(work => (
                            <div key={work.id} className="h-full">
                                <NovelCard novel={work} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-4 rounded-xl text-center text-slate-500 text-sm shadow-sm">
                        No other works available.
                    </div>
                )}
            </section>

             {/* AD / PROMO Placeholder */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 text-center border border-purple-200">
                 <h4 className="font-bold text-purple-800 mb-2">Get More Points!</h4>
                 <p className="text-sm text-purple-600 mb-4">Unlock premium chapters and support your favorite authors.</p>
                 <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold shadow-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                     <Coins size={16} /> Top Up Now
                 </button>
            </div>

        </div>
      </div>

    </div>
  );
};

export default NovelDetails;
