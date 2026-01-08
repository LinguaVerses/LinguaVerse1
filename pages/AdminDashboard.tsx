import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusCircle, Edit3, Trash2, BookOpen, Save, Upload, Search, 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  RotateCcw, RotateCw, Minus, Check, ChevronDown, Lock, Palette,
  Settings, List, ListOrdered, Calendar, DollarSign, FileText, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import { UserProfile, NOVEL_GENRES, NovelLanguage, NovelStatus, Novel } from '../types';
import { MOCK_NOVELS } from '../constants';

// --- TYPES & INTERFACES ---
interface AdminDashboardProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
}

type TabType = 'add' | 'edit' | 'delete' | 'chapter';
type ChapterTabType = 'add_chap' | 'list_chap';

interface NovelFormData {
  id?: string;
  coverUrl: string;
  titleEn: string;
  titleTh: string;
  titleOriginal: string;
  author: string;
  language: string;
  status: string;
  isCopyrighted: boolean;
  genres: string[];
  description: string;
}

interface ChapterFormData {
  id?: string;
  novelId: string;
  chapterNumber: string; // Keep as string for input, parse later
  title: string;
  priceTier: 'Free' | 'Standard' | 'Special' | 'Extra';
  points: number;
  publishDate: string;
  content: string;
}

const INITIAL_FORM_DATA: NovelFormData = {
  coverUrl: 'https://via.placeholder.com/300x450?text=Cover+Image',
  titleEn: '',
  titleTh: '',
  titleOriginal: '',
  author: '',
  language: 'KR',
  status: 'Ongoing',
  isCopyrighted: false,
  genres: [],
  description: ''
};

// Helper to get local ISO string for datetime-local input
const getLocalISOString = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const INITIAL_CHAPTER_DATA: ChapterFormData = {
  novelId: '',
  chapterNumber: '',
  title: '',
  priceTier: 'Free',
  points: 0,
  publishDate: getLocalISOString(),
  content: ''
};

// --- CONSTANTS ---
const PRICE_TIERS = [
  { id: 'Free', label: 'Free (0 pts)', points: 0, color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { id: 'Standard', label: 'Standard (10 pts)', points: 10, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'Special', label: 'Side Story (15 pts)', points: 15, color: 'bg-green-50 text-green-600 border-green-200' },
  { id: 'Extra', label: 'Extra/NC (20 pts)', points: 20, color: 'bg-orange-50 text-orange-600 border-orange-200' },
] as const;

const EDITOR_COLORS = [
  { color: '#000000', name: 'Black' },
  { color: '#666666', name: 'Gray' },
  { color: '#ff0000', name: 'Red' },
  { color: '#0000ff', name: 'Blue' },
  { color: '#1e90ff', name: 'Light Blue' },
  { color: '#228b22', name: 'Green' },
  { color: '#ff1493', name: 'Deep Pink' },
  { color: '#a52a2a', name: 'Brown' },
  { color: '#9900ff', name: 'Purple' },
  { color: '#ff7f50', name: 'Orange' },
];

// --- MOCK CHAPTER DATA GENERATOR ---
const generateMockChapters = (novelId: string) => {
    return Array.from({ length: 10 }).map((_, i) => ({
        id: `ch-${novelId}-${i+1}`,
        novelId: novelId,
        chapterNumber: (i + 1).toString(),
        title: `บทที่ ${i+1} การเริ่มต้นใหม่`,
        priceTier: i < 3 ? 'Free' : 'Standard',
        points: i < 3 ? 0 : 10,
        publishDate: '2023-10-27T18:00', // Mock data with time
        content: '<p>เนื้อหาตัวอย่าง...</p>'
    }));
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onOpenAuth }) => {
  // Main Tabs
  const [activeTab, setActiveTab] = useState<TabType>('add');
  
  // Novel Form State
  const [formData, setFormData] = useState<NovelFormData>(INITIAL_FORM_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);

  // Chapter Management State
  const [activeChapterTab, setActiveChapterTab] = useState<ChapterTabType>('add_chap');
  const [chapterFormData, setChapterFormData] = useState<ChapterFormData>(INITIAL_CHAPTER_DATA);
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');
  const [selectedNovelForChapter, setSelectedNovelForChapter] = useState<Novel | null>(null);
  const [mockChaptersList, setMockChaptersList] = useState<any[]>([]); // List of chapters for the selected novel
  
  // Rich Text Editor State
  const editorRef = useRef<HTMLDivElement>(null);
  const chapterEditorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Authorization Check
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      Swal.fire({
        title: 'Access Denied',
        text: 'Please login to access the Writer Dashboard.',
        icon: 'warning',
        confirmButtonColor: '#9333ea',
        allowOutsideClick: false
      }).then(() => {
        onOpenAuth();
      });
    }
  }, [user]);

  // --- COMMON EDITOR FUNCTIONS ---
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    // Focus back on the correct editor
    if (activeTab === 'chapter') {
        if (chapterEditorRef.current) chapterEditorRef.current.focus();
    } else {
        if (editorRef.current) editorRef.current.focus();
    }
  };

  const handleColorSelect = (color: string) => {
    execCmd('foreColor', color);
    setShowColorPicker(false);
  };

  // Paste Restriction Logic
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Check for Ctrl+V or Cmd+V (Mac)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      if (!e.shiftKey) {
        e.preventDefault();
        Swal.fire({
          icon: 'warning',
          title: 'ไม่อนุญาตให้วางแบบปกติ (Ctrl+V)',
          html: 'เพื่อป้องกันโค้ดขยะในฐานข้อมูล กรุณาใช้คีย์ลัด <br/><b>Ctrl + Shift + V</b><br/> เพื่อวางข้อความแบบธรรมดา (Plain Text) เท่านั้นค่ะ',
          confirmButtonColor: '#9333ea',
          timer: 4000,
          timerProgressBar: true
        });
      }
    }
  };

  // Sync editor content
  const handleEditorInput = (ref: React.RefObject<HTMLDivElement>, setter: Function, field: string) => {
    if (ref.current) {
        if (field === 'novelDesc') {
            setFormData(prev => ({ ...prev, description: ref.current?.innerHTML || '' }));
        } else if (field === 'chapterContent') {
            setChapterFormData(prev => ({ ...prev, content: ref.current?.innerHTML || '' }));
        }
    }
  };

  // --- NOVEL FORM HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => {
      const current = prev.genres;
      if (current.includes(genre)) {
        return { ...prev, genres: current.filter(g => g !== genre) };
      } else {
        return { ...prev, genres: [...current, genre] };
      }
    });
  };

  // --- CHAPTER FORM HANDLERS ---
  const handleChapterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setChapterFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceSelect = (tierId: string) => {
      const selected = PRICE_TIERS.find(t => t.id === tierId);
      if (selected) {
          setChapterFormData(prev => ({
              ...prev,
              priceTier: selected.id as any,
              points: selected.points
          }));
      }
  };

  // --- SEARCH LOGIC ---
  const handleNovelSearch = (query: string, setQuery: Function, setSelection: Function, isChapterMode: boolean = false) => {
    const found = MOCK_NOVELS.find(n => n.titleEn.toLowerCase().includes(query.toLowerCase()));
    if (found) {
        setSelection(found);
        if (isChapterMode) {
            // Load mock chapters for this novel
            setMockChaptersList(generateMockChapters(found.id));
            setChapterFormData(prev => ({...INITIAL_CHAPTER_DATA, novelId: found.id}));
            if (chapterEditorRef.current) chapterEditorRef.current.innerHTML = '';
        }
    } else {
        Swal.fire({ icon: 'error', title: 'ไม่พบข้อมูล', text: 'ไม่พบนิยายที่คุณค้นหา', confirmButtonColor: '#9333ea' });
        setSelection(null);
        if (isChapterMode) setMockChaptersList([]);
    }
  };

  // --- RESET LOGIC ---
  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    if (editorRef.current) editorRef.current.innerHTML = '';
    setSearchQuery('');
    setSelectedNovel(null);
  };

  const resetChapterForm = () => {
      setChapterFormData({
          ...INITIAL_CHAPTER_DATA,
          novelId: selectedNovelForChapter?.id || ''
      });
      if (chapterEditorRef.current) chapterEditorRef.current.innerHTML = '';
  };

  // --- SAVE/UPDATE/DELETE ACTIONS ---
  const handleSave = (type: 'novel' | 'chapter') => {
    Swal.fire({
      icon: 'success',
      title: 'บันทึกเรียบร้อย!',
      text: type === 'novel' ? 'นิยายถูกเพิ่มลงในระบบแล้ว' : 'เพิ่มตอนใหม่เรียบร้อยแล้ว',
      confirmButtonColor: '#9333ea'
    }).then(() => {
        if (type === 'novel') resetForm();
        else {
            // Add to mock list for visual feedback
            setMockChaptersList(prev => [...prev, {
                id: `new-${Date.now()}`,
                ...chapterFormData
            }]);
            resetChapterForm();
        }
    });
  };

  const handleLoadForEdit = () => {
      if(selectedNovel) {
          setFormData({
              id: selectedNovel.id,
              coverUrl: selectedNovel.coverUrl,
              titleEn: selectedNovel.titleEn,
              titleTh: selectedNovel.titleTh || '',
              titleOriginal: selectedNovel.titleOriginal || '',
              author: selectedNovel.author,
              language: selectedNovel.language,
              status: selectedNovel.status,
              isCopyrighted: selectedNovel.isCopyrighted,
              genres: selectedNovel.genres,
              description: selectedNovel.description || ''
          });
          if(editorRef.current) editorRef.current.innerHTML = selectedNovel.description || '';
      }
  };

  const handleEditChapter = (chapter: any) => {
      setChapterFormData({
          id: chapter.id,
          novelId: chapter.novelId,
          chapterNumber: chapter.chapterNumber,
          title: chapter.title.replace(`บทที่ ${chapter.chapterNumber} `, ''), // Strip prefix for edit
          priceTier: chapter.points === 0 ? 'Free' : chapter.points === 10 ? 'Standard' : chapter.points === 15 ? 'Special' : 'Extra',
          points: chapter.points,
          publishDate: chapter.publishDate,
          content: chapter.content
      });
      setActiveChapterTab('add_chap'); // Switch to form tab
      if(chapterEditorRef.current) chapterEditorRef.current.innerHTML = chapter.content;
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (type: 'novel' | 'chapter', id?: string) => {
    Swal.fire({
      title: type === 'novel' ? 'ลบนิยาย?' : 'ลบตอนนิยาย?',
      text: "การกระทำนี้ไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ยืนยันการลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
            title: 'ลบสำเร็จ!', 
            text: 'ข้อมูลถูกลบออกจากระบบแล้ว', 
            icon: 'success',
            confirmButtonColor: '#9333ea'
        });
        if (type === 'novel') resetForm();
        else {
            setMockChaptersList(prev => prev.filter(c => c.id !== id));
            resetChapterForm();
        }
      }
    });
  };

  if (!user) return null;

  // --- RENDER HELPERS ---
  const renderEditorToolbar = (targetRef: React.RefObject<HTMLDivElement>) => (
    <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <button onClick={() => execCmd('bold')} className="toolbar-btn" title="Bold"><Bold size={16}/></button>
        <button onClick={() => execCmd('italic')} className="toolbar-btn" title="Italic"><Italic size={16}/></button>
        <button onClick={() => execCmd('underline')} className="toolbar-btn" title="Underline"><Underline size={16}/></button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Color Picker */}
        <div className="relative">
            <button 
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="toolbar-btn flex items-center gap-1" 
                title="Font Color"
            >
                <Palette size={16}/> <ChevronDown size={12}/>
            </button>
            {showColorPicker && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker(false)}></div>
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg p-2 z-20 grid grid-cols-5 gap-1 w-40">
                        {EDITOR_COLORS.map((c) => (
                            <button
                                key={c.color}
                                onClick={() => handleColorSelect(c.color)}
                                className="w-6 h-6 rounded-full border border-gray-100 hover:scale-110 transition-transform"
                                style={{ backgroundColor: c.color }}
                                title={c.name}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button onClick={() => execCmd('justifyLeft')} className="toolbar-btn"><AlignLeft size={16}/></button>
        <button onClick={() => execCmd('justifyCenter')} className="toolbar-btn"><AlignCenter size={16}/></button>
        <button onClick={() => execCmd('justifyRight')} className="toolbar-btn"><AlignRight size={16}/></button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button onClick={() => execCmd('insertOrderedList')} className="toolbar-btn" title="Numbered List"><ListOrdered size={16}/></button>
        <button onClick={() => execCmd('insertUnorderedList')} className="toolbar-btn" title="Bullet List"><List size={16}/></button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button onClick={() => execCmd('insertHorizontalRule')} className="toolbar-btn" title="Horizontal Line"><Minus size={16}/></button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button onClick={() => execCmd('undo')} className="toolbar-btn"><RotateCcw size={16}/></button>
        <button onClick={() => execCmd('redo')} className="toolbar-btn"><RotateCw size={16}/></button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-16 flex flex-col md:flex-row">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-[calc(100vh-64px)] shrink-0 z-20">
        <div className="p-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
                <Settings className="text-purple-600" /> Dashboard
            </h2>
            <p className="text-xs text-slate-500">Writer Management System</p>
        </div>
        
        <nav className="flex flex-col space-y-1 px-3">
            <div className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase mt-2">Novels</div>
            <button 
                onClick={() => { setActiveTab('add'); resetForm(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'add' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-gray-50'}`}
            >
                <PlusCircle size={18} /> เพิ่มนิยาย
            </button>
            <button 
                onClick={() => { setActiveTab('edit'); resetForm(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'edit' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-gray-50'}`}
            >
                <Edit3 size={18} /> แก้ไขนิยาย
            </button>
            <button 
                onClick={() => { setActiveTab('delete'); resetForm(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'delete' ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:bg-gray-50'}`}
            >
                <Trash2 size={18} /> ลบนิยาย
            </button>
            
            <div className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase mt-4">Chapters</div>
            <button 
                onClick={() => { setActiveTab('chapter'); resetForm(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chapter' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-gray-50'}`}
            >
                <BookOpen size={18} /> จัดการตอนนิยาย
            </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
        
        {/* HEADER */}
        <div className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-slate-800">
                {activeTab === 'add' && 'เพิ่มนิยายใหม่ (Add Novel)'}
                {activeTab === 'edit' && 'แก้ไขนิยาย (Edit Novel)'}
                {activeTab === 'delete' && 'ลบนิยาย (Delete Novel)'}
                {activeTab === 'chapter' && 'จัดการตอนนิยาย (Chapter Management)'}
            </h1>
        </div>

        {/* ---------------------------------------------------- */}
        {/*           CHAPTER MANAGEMENT SECTION                 */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'chapter' && (
            <div className="space-y-6">
                
                {/* 1. SELECT NOVEL CARD */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                         <Search size={20} className="text-purple-600"/> 
                         ขั้นตอนที่ 1: เลือกนิยาย (Select Novel)
                     </h3>
                     <div className="flex gap-4">
                        <div className="relative flex-grow max-w-2xl">
                            <input 
                                type="text" 
                                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="ค้นหาชื่อนิยาย (English Title)..."
                                value={chapterSearchQuery}
                                onChange={(e) => setChapterSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => handleNovelSearch(chapterSearchQuery, setChapterSearchQuery, setSelectedNovelForChapter, true)}
                            className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                        >
                            ค้นหา & โหลด
                        </button>
                     </div>

                     {selectedNovelForChapter && (
                         <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-4 animate-fade-in-up">
                             <img src={selectedNovelForChapter.coverUrl} className="w-12 h-16 object-cover rounded shadow-sm" alt="cover"/>
                             <div>
                                 <div className="text-xs text-purple-600 font-bold uppercase mb-1">Selected Novel</div>
                                 <h4 className="font-bold text-slate-800 text-lg">{selectedNovelForChapter.titleEn}</h4>
                                 <p className="text-sm text-slate-500">{selectedNovelForChapter.titleTh}</p>
                             </div>
                             <button onClick={() => setSelectedNovelForChapter(null)} className="ml-auto text-slate-400 hover:text-red-500">
                                 <X size={20}/>
                             </button>
                         </div>
                     )}
                </div>

                {/* 2. SUB TABS (VISIBLE AFTER SELECTION) */}
                {selectedNovelForChapter && (
                    <div className="animate-fade-in-up">
                        <div className="flex border-b border-gray-200 mb-6">
                            <button 
                                onClick={() => setActiveChapterTab('add_chap')}
                                className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeChapterTab === 'add_chap' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-purple-500'}`}
                            >
                                <PlusCircle size={16}/> {chapterFormData.id ? 'แก้ไขตอน (Edit Mode)' : 'เพิ่มตอนนิยาย (Add Chapter)'}
                            </button>
                            <button 
                                onClick={() => { setActiveChapterTab('list_chap'); resetChapterForm(); }}
                                className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeChapterTab === 'list_chap' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-purple-500'}`}
                            >
                                <ListOrdered size={16}/> รายการตอน / แก้ไข / ลบ
                            </button>
                        </div>

                        {/* SUB-TAB: ADD/EDIT CHAPTER */}
                        {activeChapterTab === 'add_chap' && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                         <div className="col-span-1">
                                             <label className="label-text">ลำดับตอน (เลขเท่านั้น)</label>
                                             <input 
                                                type="number" 
                                                name="chapterNumber"
                                                value={chapterFormData.chapterNumber}
                                                onChange={handleChapterInputChange}
                                                className="input-field" 
                                                placeholder="1"
                                             />
                                         </div>
                                         <div className="col-span-2 md:col-span-3">
                                             <label className="label-text">ชื่อตอน</label>
                                             <input 
                                                type="text" 
                                                name="title"
                                                value={chapterFormData.title}
                                                onChange={handleChapterInputChange}
                                                className="input-field" 
                                                placeholder="เช่น การเริ่มต้น..."
                                             />
                                         </div>
                                     </div>

                                     <div>
                                         <label className="label-text mb-3 block">เลือกราคาตอน (Pricing Tier)</label>
                                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                             {PRICE_TIERS.map((tier) => (
                                                 <button
                                                    key={tier.id}
                                                    onClick={() => handlePriceSelect(tier.id)}
                                                    className={`p-3 rounded-xl border text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all
                                                        ${chapterFormData.priceTier === tier.id 
                                                            ? `ring-2 ring-purple-500 ${tier.color}` 
                                                            : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'
                                                        }`}
                                                 >
                                                     <span>{tier.label}</span>
                                                     {chapterFormData.priceTier === tier.id && <Check size={16}/>}
                                                 </button>
                                             ))}
                                         </div>
                                     </div>

                                     {/* CHAPTER EDITOR */}
                                     <div>
                                         <div className="flex justify-between items-end mb-2">
                                            <label className="label-text">เนื้อหานิยาย</label>
                                            <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                                Tip: Ctrl+Shift+V to Paste
                                            </div>
                                         </div>
                                         <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                                             {renderEditorToolbar(chapterEditorRef)}
                                             <div 
                                                ref={chapterEditorRef}
                                                contentEditable
                                                onInput={() => handleEditorInput(chapterEditorRef, setChapterFormData, 'chapterContent')}
                                                onKeyDown={handleEditorKeyDown}
                                                className="min-h-[500px] p-8 focus:outline-none font-sarabun text-lg text-slate-800 bg-white editor-content leading-relaxed"
                                                style={{ backgroundColor: '#fff' }}
                                             ></div>
                                         </div>
                                     </div>
                                     
                                     <div className="flex gap-4 pt-4">
                                        <button 
                                            onClick={() => handleSave('chapter')}
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all flex justify-center items-center gap-2"
                                        >
                                            <Save size={20} /> {chapterFormData.id ? 'อัปเดตตอน (Update)' : 'บันทึกตอนใหม่ (Save Chapter)'}
                                        </button>
                                        <button 
                                            onClick={resetChapterForm}
                                            className="px-6 py-3 bg-gray-100 text-slate-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            เคลียร์
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Right Sidebar (Date/Preview) */}
                                <div className="space-y-6">
                                     <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                         <label className="label-text mb-2 flex items-center gap-2">
                                             <Calendar size={14}/> วันที่และเวลาเผยแพร่ (Publish Date & Time)
                                         </label>
                                         <input 
                                            type="datetime-local"
                                            name="publishDate"
                                            value={chapterFormData.publishDate}
                                            onChange={handleChapterInputChange}
                                            className="input-field"
                                         />
                                         <p className="text-xs text-purple-500 mt-2">
                                             * สามารถตั้งเวลาล่วงหน้าได้ (Auto-publish)
                                         </p>
                                     </div>

                                     {/* Preview Price Badge */}
                                     <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                                         <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Preview Badge</h4>
                                         <div className="flex justify-center">
                                             <span className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${PRICE_TIERS.find(t => t.id === chapterFormData.priceTier)?.color}`}>
                                                 {chapterFormData.priceTier === 'Free' ? <BookOpen size={16}/> : <DollarSign size={16}/>}
                                                 {PRICE_TIERS.find(t => t.id === chapterFormData.priceTier)?.label}
                                             </span>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        )}

                        {/* SUB-TAB: LIST CHAPTERS */}
                        {activeChapterTab === 'list_chap' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-slate-600">
                                        <thead className="text-xs text-slate-700 uppercase bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4">#</th>
                                                <th className="px-6 py-4">Title</th>
                                                <th className="px-6 py-4">Price</th>
                                                <th className="px-6 py-4">Date & Time</th>
                                                <th className="px-6 py-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {mockChaptersList.length > 0 ? (
                                                mockChaptersList.map((chapter) => (
                                                    <tr key={chapter.id} className="hover:bg-purple-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-mono font-bold">{chapter.chapterNumber}</td>
                                                        <td className="px-6 py-4 font-medium text-slate-800">{chapter.title}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${PRICE_TIERS.find(t => t.points === chapter.points)?.color}`}>
                                                                {chapter.points === 0 ? 'Free' : `${chapter.points} pts`}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">{chapter.publishDate.replace('T', ' ')}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button 
                                                                    onClick={() => handleEditChapter(chapter)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"
                                                                >
                                                                    <Edit3 size={16}/>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete('chapter', chapter.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"
                                                                >
                                                                    <Trash2 size={16}/>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                                        <FileText size={40} className="mx-auto mb-2 opacity-20"/>
                                                        No chapters found. Start adding one!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}

        {/* ---------------------------------------------------- */}
        {/*           SEARCH SECTION (NOVEL EDIT/DELETE)         */}
        {/* ---------------------------------------------------- */}
        {(activeTab === 'edit' || activeTab === 'delete') && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">ค้นหานิยาย (English Title)</label>
                <div className="flex gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            placeholder="Type to search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => handleNovelSearch(searchQuery, setSearchQuery, setSelectedNovel)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                        ค้นหา
                    </button>
                </div>
                
                {selectedNovel && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between animate-fade-in-up">
                        <div className="flex items-center gap-4">
                            <img src={selectedNovel.coverUrl} alt="cover" className="w-12 h-16 object-cover rounded shadow-sm" />
                            <div>
                                <h4 className="font-bold text-slate-800">{selectedNovel.titleEn}</h4>
                                <p className="text-xs text-slate-500">{selectedNovel.author} • {selectedNovel.status}</p>
                            </div>
                        </div>
                        {activeTab === 'edit' ? (
                            <button 
                                onClick={handleLoadForEdit}
                                className="bg-white text-purple-600 border border-purple-200 px-4 py-2 rounded-lg font-medium hover:bg-purple-100 transition-colors"
                            >
                                Load Data
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleDelete('novel')}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        )}

        {/* ---------------------------------------------------- */}
        {/*           NOVEL FORM SECTION (ADD/EDIT)              */}
        {/* ---------------------------------------------------- */}
        {(activeTab === 'add' || (activeTab === 'edit' && formData.id)) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Input Fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-4">ข้อมูลทั่วไป</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label-text">ชื่อเรื่องภาษาอังกฤษ *</label>
                                <input name="titleEn" value={formData.titleEn} onChange={handleInputChange} className="input-field" placeholder="English Title" />
                            </div>
                            <div>
                                <label className="label-text">ชื่อเรื่องภาษาไทย</label>
                                <input name="titleTh" value={formData.titleTh} onChange={handleInputChange} className="input-field" placeholder="ชื่อไทย" />
                            </div>
                            <div>
                                <label className="label-text">ชื่อเรื่องต้นฉบับ</label>
                                <input name="titleOriginal" value={formData.titleOriginal} onChange={handleInputChange} className="input-field" placeholder="Original Title" />
                            </div>
                            <div>
                                <label className="label-text">ชื่อผู้แต่ง *</label>
                                <input name="author" value={formData.author} onChange={handleInputChange} className="input-field" placeholder="Author Name" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div>
                                <label className="label-text">ภาษาต้นฉบับ</label>
                                <select name="language" value={formData.language} onChange={handleInputChange} className="input-field">
                                    {Object.values(NovelLanguage).filter(l => l !== 'All').map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                             </div>
                             <div>
                                <label className="label-text">สถานะ</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="input-field">
                                    {Object.values(NovelStatus).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                             </div>
                             <div className="flex items-center pt-6">
                                <label className="flex items-center cursor-pointer gap-2">
                                    <input 
                                        type="checkbox" 
                                        name="isCopyrighted" 
                                        checked={formData.isCopyrighted}
                                        onChange={handleCheckboxChange}
                                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                                    />
                                    <span className="text-sm font-medium text-slate-700">เป็นนิยายลิขสิทธิ์</span>
                                </label>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-4">Genre (เลือกได้มากกว่า 1)</h3>
                        <div className="flex flex-wrap gap-2">
                            {NOVEL_GENRES.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => toggleGenre(genre)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                        formData.genres.includes(genre)
                                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                        : 'bg-white text-slate-600 border-gray-200 hover:border-purple-300'
                                    }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- RICH TEXT EDITOR (NOVEL SYNOPSIS) --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-4 flex justify-between items-center">
                            <span>เรื่องย่อ</span>
                            <span className="text-xs font-normal text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                                Tip: ใช้ Ctrl+Shift+V เพื่อวางข้อความ
                            </span>
                        </h3>
                        
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                            {renderEditorToolbar(editorRef)}
                            <div 
                                ref={editorRef}
                                contentEditable
                                onInput={() => handleEditorInput(editorRef, setFormData, 'novelDesc')}
                                onKeyDown={handleEditorKeyDown}
                                className="min-h-[350px] p-6 focus:outline-none font-sarabun text-lg text-slate-700 bg-white editor-content leading-relaxed"
                                style={{ backgroundColor: '#fff' }}
                            >
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={() => handleSave('novel')}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all flex justify-center items-center gap-2"
                        >
                            <Save size={20} /> {activeTab === 'add' ? 'บันทึกนิยาย (Save)' : 'อัปเดตข้อมูล (Update)'}
                        </button>
                        <button 
                            onClick={resetForm}
                            className="px-6 py-3 bg-gray-100 text-slate-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            ยกเลิก
                        </button>
                    </div>

                </div>

                {/* Right: Preview & Cover */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-4">หน้าปก (Cover Link)</h3>
                        <div className="mb-4">
                            <input 
                                name="coverUrl" 
                                value={formData.coverUrl} 
                                onChange={handleInputChange} 
                                className="input-field text-xs mb-2" 
                                placeholder="https://..." 
                            />
                            
                            {/* Preview Card */}
                            <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center group">
                                {formData.coverUrl ? (
                                    <img src={formData.coverUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300x450?text=Invalid+Image'} />
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                        <Upload size={32} />
                                        <span className="text-xs mt-2">No Image</span>
                                    </div>
                                )}

                                {/* Copyright Badge */}
                                {formData.isCopyrighted && (
                                    <div className="absolute top-0 right-0 m-0">
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-md z-10">
                                            ลิขสิทธิ์
                                        </span>
                                    </div>
                                )}
                                
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2 text-white">
                                    <p className="text-xs font-bold truncate">{formData.titleEn || 'Title'}</p>
                                    <p className="text-[10px] opacity-80 truncate">{formData.author || 'Author'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-xl text-xs text-purple-800 border border-purple-100">
                            <p className="font-bold mb-1">💡 Tips:</p>
                            <p>ใช้รูปภาพขนาดอัตราส่วน 2:3 (เช่น 600x900px) เพื่อความสวยงามที่สุด</p>
                        </div>
                    </div>
                </div>

            </div>
        )}
      </main>

      <style>{`
        .input-field {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid #e2e8f0;
            background-color: #f8fafc;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s;
        }
        .input-field:focus {
            background-color: #fff;
            border-color: #a855f7;
            box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.1);
        }
        .label-text {
            display: block;
            font-size: 0.75rem;
            font-weight: 600;
            color: #64748b;
            margin-bottom: 0.25rem;
        }
        .toolbar-btn {
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            color: #475569;
            transition: background-color 0.1s;
        }
        .toolbar-btn:hover {
            background-color: #e2e8f0;
            color: #000;
        }
        /* Custom Editor Styles for Spacing */
        .editor-content p, .editor-content div {
            margin-bottom: 1.5em; /* Increased spacing as requested */
            line-height: 1.8;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;