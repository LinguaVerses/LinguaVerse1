import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, List, Settings, Moon, Sun, Type, 
  MessageSquare, Heart, Send, X, User, Minus, Plus, Clock 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { UserProfile, Comment, NotificationItem } from '../types';
import { MOCK_NOVELS } from '../constants';

interface ChapterReaderProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onSendNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
}

type ThemeMode = 'light' | 'sepia' | 'dark';

const ChapterReader: React.FC<ChapterReaderProps> = ({ user, onOpenAuth, onSendNotification }) => {
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>();
  const navigate = useNavigate();
  const commentSectionRef = useRef<HTMLDivElement>(null);

  // --- STATE ---
  const [fontSize, setFontSize] = useState(18); // Default font size
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Mock Data State
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState<string[]>([]);
  const [novelTitle, setNovelTitle] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  // --- INITIALIZATION ---
  useEffect(() => {
    window.scrollTo(0, 0);

    // Mock Fetching Data
    const novel = MOCK_NOVELS.find(n => n.id === novelId);
    setNovelTitle(novel?.titleEn || 'Unknown Novel');
    setChapterTitle(`Chapter ${chapterId}: The Awakening Power`);
    
    // Generate content
    const paragraphs = [
      "เสียงลมหายใจหอบถี่ดังสะท้อนก้องภายในถ้ำมืดมิด ชายหนุ่มร่างผอมบางพยายามประคองสติที่กำลังเลือนราง มือข้างหนึ่งกุมบาดแผลที่หน้าอก เลือดสีแดงสดไหลรินย้อมเสื้อผ้าจนชุ่มโชก",
      "\"ข้า... ข้าจะมาตายตรงนี้ไม่ได้\" เขาพึมพำกับตัวเองด้วยน้ำเสียงแหบพร่า ความเจ็บปวดแล่นพล่านไปทั่วสรรพางค์กาย แต่แววตาของเขากลับยังคงลุกโชนด้วยไฟแห่งความแค้น",
      "ย้อนกลับไปเมื่อสามชั่วโมงก่อน เขาถูกลวงมาสังหารโดยคนที่เขาไว้ใจที่สุด ศิษย์พี่ใหญ่แห่งสำนักกระบี่สวรรค์ ผู้ที่เปรียบเสมือนพี่ชายแท้ๆ กลับหักหลังเขาเพียงเพื่อแย่งชิง 'ไข่มุกมังกร' ที่เขาบังเอิญเก็บได้",
      "ทันใดนั้น แสงสว่างวาบหนึ่งก็ปรากฏขึ้นจากส่วนลึกของถ้ำ มันไม่ใช่แสงจากคบเพลิง หรือแสงจันทร์ที่ลอดเข้ามา แต่มันคือแสงสีทองอร่ามที่แผ่ออกมาจากแท่นหินโบราณ",
      "ด้วยแรงเฮือกสุดท้าย เขาตะเกียกตะกายลากสังขารของตัวเองเข้าไปใกล้ แสงนั้นอบอุ่นและเชื้อเชิญ ราวกับกำลังเรียกหาเขา เมื่อปลายนิ้วสัมผัสกับแท่นหิน ความรู้สึกประหลาดก็พุ่งเข้าสู่จิตวิญญาณ",
      "ภาพนิมิตมากมายหลั่งไหลเข้ามาในหัว... กระบวนท่าวิชายุทธ์ที่สาบสูญ เคล็ดวิชาลมปราณอมตะ และเงาร่างของมังกรทองที่ทะยานขึ้นสู่ท้องนภา",
      "\"เจ้าคือผู้ถูกเลือก...\" เสียงทุ้มต่ำดังก้องในหัวของเขา ไม่ใช่เสียงของมนุษย์ แต่มันทรงพลังอำนาจราวกับเสียงของเทพเจ้า",
      "บาดแผลที่หน้าอกเริ่มสมานตัวอย่างน่าอัศจรรย์ พลังปราณที่เคยเหือดแห้งกลับฟื้นคืนมาอย่างบ้าคลั่ง ทว่าคราวนี้มันไม่ใช่ปราณธรรมดา แต่มันคือปราณมังกร!",
      "เขาค่อยๆ ลุกขึ้นยืน สายตาจ้องมองออกไปที่ปากถ้ำ รอยยิ้มเย็นยะเยือกปรากฏขึ้นบนใบหน้า",
      "\"รอข้าก่อนเถอะศิษย์พี่... หนี้แค้นครั้งนี้ ข้าจะทวงคืนเป็นพันเท่า!\""
    ];
    setChapterContent([...paragraphs, ...paragraphs, ...paragraphs]); // Triple length for scrolling

    // Mock Comments
    setComments([
        {
            id: 'c1',
            username: 'BookWorm99',
            content: 'สนุกมากกก ค้างงงง! เมื่อไหร่ตอนต่อไปจะมาคะ?',
            timestamp: '2 hours ago',
            likes: 12,
            isLiked: false,
            replies: []
        },
        {
            id: 'c2',
            username: 'ReaderX',
            content: 'พระเอกเทพทรูมาก ชอบๆ เอาคืนให้หนักเลย',
            timestamp: '5 hours ago',
            likes: 45,
            isLiked: true,
            replies: [
                {
                    id: 'r1',
                    username: 'FanClub01',
                    content: 'จริงครับ สะใจสุดๆ',
                    timestamp: '4 hours ago',
                    likes: 2,
                    isLiked: false,
                    replies: []
                }
            ]
        }
    ]);
  }, [novelId, chapterId]);

  // --- HANDLERS ---
  const handleIncreaseFont = () => setFontSize(prev => Math.min(prev + 2, 32));
  const handleDecreaseFont = () => setFontSize(prev => Math.max(prev - 2, 14));

  const handlePostComment = () => {
    if (!user) {
        Swal.fire({
            icon: 'warning',
            title: 'Please Login',
            text: 'You need to be logged in to comment.',
            confirmButtonText: 'Login',
            confirmButtonColor: '#9333ea'
        }).then((res) => {
            if(res.isConfirmed) onOpenAuth();
        });
        return;
    }

    if (!commentText.trim()) return;

    const newComment: Comment = {
        id: `new-${Date.now()}`,
        username: user.username,
        content: commentText,
        timestamp: 'Just now',
        likes: 0,
        isLiked: false,
        replies: []
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');

    // SEND NOTIFICATION TO WRITER
    onSendNotification({
        type: 'COMMENT',
        senderId: user.uid,
        senderName: user.username,
        targetUserRole: 'writer',
        title: `Comment on ${novelTitle}`,
        message: `"${newComment.content.substring(0, 30)}..."`,
        data: { novelTitle: novelTitle, chapterNumber: parseInt(chapterId || '1') }
    });

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Comment posted!',
        showConfirmButton: false,
        timer: 1500
    });
  };

  const handleLike = (commentId: string, isReply = false, parentId?: string) => {
      const updatedComments = [...comments];
      if (!isReply) {
          const comment = updatedComments.find(c => c.id === commentId);
          if (comment) {
              comment.isLiked = !comment.isLiked;
              comment.likes += comment.isLiked ? 1 : -1;
          }
      } else if (parentId) {
          const parent = updatedComments.find(c => c.id === parentId);
          if (parent) {
              const reply = parent.replies.find(r => r.id === commentId);
              if (reply) {
                  reply.isLiked = !reply.isLiked;
                  reply.likes += reply.isLiked ? 1 : -1;
              }
          }
      }
      setComments(updatedComments);
  };

  // --- DYNAMIC STYLES ---
  const getThemeClasses = () => {
      switch(theme) {
          case 'dark': return 'bg-slate-900 text-slate-300';
          case 'sepia': return 'bg-[#f4ecd8] text-[#5b4636]'; // Easy on eyes
          default: return 'bg-white text-slate-800';
      }
  };

  const getNavbarClasses = () => {
      switch(theme) {
          case 'dark': return 'bg-slate-900/95 border-b border-slate-800 text-slate-200';
          case 'sepia': return 'bg-[#f4ecd8]/95 border-b border-[#d3c4b5] text-[#5b4636]';
          default: return 'bg-white/95 border-b border-purple-100 text-slate-800';
      }
  };

  const getPanelClasses = () => {
      switch(theme) {
          case 'dark': return 'bg-slate-800 border-slate-700 text-slate-200';
          case 'sepia': return 'bg-[#eaddcf] border-[#d3c4b5] text-[#5b4636]';
          default: return 'bg-white border-purple-100 text-slate-800 shadow-purple-100';
      }
  };

  const currentChapterNum = parseInt(chapterId || '1');
  const prevChapterId = currentChapterNum > 1 ? currentChapterNum - 1 : null;
  const nextChapterId = currentChapterNum + 1;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sarabun ${getThemeClasses()}`}>
        
        {/* --- FIXED NAVBAR --- */}
        <div className={`fixed top-0 left-0 w-full z-40 h-16 shadow-sm backdrop-blur-sm transition-colors duration-300 ${getNavbarClasses()}`}>
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                
                {/* Left: Back & Title */}
                <div className="flex items-center gap-3 overflow-hidden">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 rounded-full hover:bg-black/10 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-xs opacity-60 truncate font-kanit">{novelTitle}</span>
                        <span className="font-bold text-sm md:text-base truncate font-kanit">{chapterTitle}</span>
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-2">
                    {/* SETTINGS TOGGLE BUTTON */}
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-full transition-all duration-300 ${showSettings ? 'bg-purple-500 text-white rotate-90' : 'hover:bg-black/10'}`}
                        title="Reading Settings"
                    >
                        <Settings size={22} />
                    </button>

                    {/* TOC BUTTON */}
                    <button 
                        onClick={() => setShowToc(true)}
                        className="p-2 rounded-full hover:bg-black/10 transition-colors"
                        title="Table of Contents"
                    >
                        <List size={22} />
                    </button>
                </div>
            </div>
        </div>

        {/* --- SETTINGS POPUP PANEL (Right under the Gear Icon) --- */}
        {showSettings && (
            <>
                {/* Invisible backdrop to close when clicking outside */}
                <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)}></div>
                
                <div className={`fixed top-16 right-4 z-50 w-72 p-5 rounded-2xl shadow-2xl border flex flex-col gap-5 animate-fade-in-up origin-top-right ${getPanelClasses()}`}>
                    
                    {/* 1. THEME SELECTOR */}
                    <div>
                        <label className="text-xs font-bold uppercase opacity-60 mb-2 flex items-center gap-1 font-kanit">
                            <Sun size={12} /> Reading Theme
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => setTheme('light')}
                                className={`h-10 rounded-lg border flex items-center justify-center gap-1 text-sm font-medium transition-all
                                    ${theme === 'light' ? 'ring-2 ring-purple-500 border-transparent bg-white text-slate-800' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <Sun size={16} /> Light
                            </button>
                            <button 
                                onClick={() => setTheme('sepia')}
                                className={`h-10 rounded-lg border flex items-center justify-center gap-1 text-sm font-medium transition-all
                                    ${theme === 'sepia' ? 'ring-2 ring-[#8f745c] border-transparent bg-[#f4ecd8] text-[#5b4636]' : 'bg-[#f4ecd8] border-[#e0d6c2] text-[#8f745c] opacity-70 hover:opacity-100'}`}
                            >
                                <Type size={16} /> Sepia
                            </button>
                            <button 
                                onClick={() => setTheme('dark')}
                                className={`h-10 rounded-lg border flex items-center justify-center gap-1 text-sm font-medium transition-all
                                    ${theme === 'dark' ? 'ring-2 ring-purple-400 border-transparent bg-slate-800 text-white' : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'}`}
                            >
                                <Moon size={16} /> Dark
                            </button>
                        </div>
                    </div>

                    {/* 2. FONT SIZE CONTROLS */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold uppercase opacity-60 font-kanit">Font Size</label>
                            <span className="text-xs font-mono opacity-80 bg-black/5 px-2 py-0.5 rounded">{fontSize}px</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleDecreaseFont}
                                className="w-10 h-10 rounded-lg flex items-center justify-center border hover:bg-black/5 transition-colors disabled:opacity-50"
                                disabled={fontSize <= 14}
                            >
                                <Minus size={18} />
                            </button>
                            
                            <input 
                                type="range" 
                                min="14" 
                                max="32" 
                                step="2"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />

                            <button 
                                onClick={handleIncreaseFont}
                                className="w-10 h-10 rounded-lg flex items-center justify-center border hover:bg-black/5 transition-colors disabled:opacity-50"
                                disabled={fontSize >= 32}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )}

        {/* --- READING AREA --- */}
        <div className="container mx-auto px-4 md:px-0 max-w-3xl pt-24 pb-20">
            
            {/* Header */}
            <div className={`text-center mb-10 pb-6 border-b border-dashed ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                <h1 className="text-2xl md:text-4xl font-bold mb-3 font-sarabun">{chapterTitle}</h1>
                <div className="flex justify-center gap-4 text-sm opacity-60 font-kanit">
                    <span className="flex items-center gap-1"><User size={14}/> Author Name</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> Oct 27, 2023</span>
                </div>
            </div>

            {/* Content Body */}
            <article 
                className="leading-loose text-justify space-y-6 transition-all duration-300"
                style={{ fontSize: `${fontSize}px` }}
            >
                {chapterContent.map((para, idx) => (
                    <p key={idx} className="indent-10">{para}</p>
                ))}
            </article>

            {/* Navigation Buttons */}
            <div className="mt-20 flex justify-between items-center gap-4 border-t border-dashed border-gray-300/30 pt-10 font-kanit">
                 <button 
                    disabled={!prevChapterId}
                    onClick={() => navigate(`/read/${novelId}/${prevChapterId}`)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                        ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-purple-300' : 'bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-600 text-slate-600'}`}
                 >
                     <ChevronLeft size={20} /> Prev Chapter
                 </button>
                 
                 <button 
                    onClick={() => setShowToc(true)}
                    className={`px-5 py-4 rounded-xl font-bold transition-colors shadow-sm
                        ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200 text-slate-700'}`}
                 >
                     <List size={20} />
                 </button>

                 <button 
                    onClick={() => navigate(`/read/${novelId}/${nextChapterId}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95"
                 >
                     Next Chapter <ChevronRight size={20} />
                 </button>
            </div>

            {/* --- COMMENT SECTION --- */}
            <div className="mt-20 pt-10 border-t border-gray-200/20" ref={commentSectionRef}>
                <div className="flex items-center gap-2 mb-8">
                    <MessageSquare className="text-purple-500" size={24} />
                    <h3 className="text-2xl font-bold font-kanit">Reader Comments</h3>
                    <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded-full">{comments.length}</span>
                </div>

                {/* Input Box */}
                <div className={`p-5 rounded-2xl mb-10 transition-colors ${theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-lg shadow-purple-500/5 border border-purple-50'}`}>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">
                            {user ? user.username[0].toUpperCase() : <User size={20} />}
                        </div>
                        <div className="flex-grow">
                            <textarea 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={user ? "Share your thoughts about this chapter..." : "Login to join the discussion"}
                                disabled={!user}
                                className={`w-full p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm h-28 font-kanit ${
                                    theme === 'dark' ? 'bg-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 text-slate-800 placeholder-slate-400'
                                }`}
                            />
                            <div className="flex justify-end mt-3">
                                <button 
                                    onClick={handlePostComment}
                                    disabled={!user || !commentText.trim()}
                                    className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 transition-all font-kanit"
                                >
                                    <Send size={16} /> Post Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-8 font-kanit">
                    {comments.map(comment => (
                        <div key={comment.id} className="animate-fade-in-up">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                    {comment.username[0].toUpperCase()}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{comment.username}</span>
                                        <span className="text-xs opacity-50">• {comment.timestamp}</span>
                                    </div>
                                    <p className={`text-sm mb-3 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {comment.content}
                                    </p>
                                    
                                    <div className="flex items-center gap-5 text-xs font-semibold opacity-70">
                                        <button 
                                            onClick={() => handleLike(comment.id)}
                                            className={`flex items-center gap-1.5 transition-colors ${comment.isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                                        >
                                            <Heart size={14} fill={comment.isLiked ? "currentColor" : "none"} /> {comment.likes} Likes
                                        </button>
                                        <button className="flex items-center gap-1.5 hover:text-purple-500 transition-colors">
                                            Reply
                                        </button>
                                    </div>

                                    {/* Nested Replies */}
                                    {comment.replies.length > 0 && (
                                        <div className={`mt-4 pl-4 border-l-2 space-y-4 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-100'}`}>
                                            {comment.replies.map(reply => (
                                                <div key={reply.id} className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold shrink-0">
                                                        {reply.username[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{reply.username}</span>
                                                            <span className="text-xs opacity-50">• {reply.timestamp}</span>
                                                        </div>
                                                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                                            {reply.content}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs font-medium opacity-70">
                                                            <button 
                                                                onClick={() => handleLike(reply.id, true, comment.id)}
                                                                className={`flex items-center gap-1 hover:text-pink-500 transition-colors ${reply.isLiked ? 'text-pink-500' : ''}`}
                                                            >
                                                                <Heart size={12} fill={reply.isLiked ? "currentColor" : "none"} /> {reply.likes}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- TOC POPUP MODAL --- */}
        {showToc && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowToc(false)}></div>
                <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col relative z-10 animate-fade-in-up overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2 font-kanit">
                            <List size={20} /> Table of Contents
                        </h3>
                        <button onClick={() => setShowToc(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="overflow-y-auto p-2 flex-grow bg-slate-50 custom-scrollbar">
                        {Array.from({length: 20}).map((_, i) => (
                            <Link 
                                key={i}
                                to={`/read/${novelId}/${i+1}`}
                                onClick={() => setShowToc(false)}
                                className={`block p-4 rounded-xl mb-2 transition-all font-kanit ${
                                    (i+1) === currentChapterNum 
                                    ? 'bg-purple-50 border border-purple-200 text-purple-700 font-bold' 
                                    : 'bg-white hover:bg-white hover:shadow-md text-slate-700 border border-gray-100'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>Chapter {i+1}</span>
                                    {(i+1) === currentChapterNum && <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Current</span>}
                                </div>
                                <div className="text-sm opacity-70 font-normal mt-1 truncate">The Awakening of the Dragon God's Power</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ChapterReader;
