import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Bell, User, Settings, Plus, LogIn, Trash2, Check, XCircle, 
  MessageSquare, Coffee, CreditCard, Mail, Reply, ExternalLink 
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';
import { NAV_LINKS } from '../constants';
import Swal from 'sweetalert2';

interface NavbarProps {
  user: UserProfile | null;
  notifications: NotificationItem[]; // Receive from App
  onOpenAuth: () => void;
  onLogout: () => void;
  // Notification Handlers
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onApproveTopUp: (n: NotificationItem) => void;
  onRejectTopUp: (n: NotificationItem) => void;
  onReplyContact: (n: NotificationItem) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
    user, notifications, onOpenAuth, onLogout,
    onMarkRead, onDelete, onApproveTopUp, onRejectTopUp, onReplyContact
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close Dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettingsClick = () => {
      navigate('/admin/manage');
  };

  // Filter Notifications based on User Role
  const myNotifications = notifications.filter(n => {
      if (!user) return false;
      // Admin sees TopUp Requests & Contact Messages
      if (user.role === 'admin' && (n.type === 'TOPUP_REQUEST' || n.type === 'CONTACT_MSG')) return true;
      // Writer sees Coffee & Comments
      if (user.role === 'writer' && (n.type === 'COFFEE' || n.type === 'COMMENT')) return true;
      // Reader sees TopUp Results, Replies, or if explicitly targeted
      if (user.role === 'reader' && (n.type === 'TOPUP_RESULT' || n.type === 'CONTACT_REPLY')) return true;
      
      // Fallback for direct targeting
      if (n.targetUserId === user.uid) return true;
      if (n.targetUserRole === 'all') return true;
      
      return false;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const handleNotifClick = (n: NotificationItem) => {
      if (!n.isRead) onMarkRead(n.id);
  };

  // --- RENDER ITEM HELPER ---
  const renderNotificationItem = (n: NotificationItem) => {
      let Icon = Bell;
      let colorClass = "bg-gray-100 text-gray-500";

      switch(n.type) {
          case 'TOPUP_REQUEST': Icon = CreditCard; colorClass = "bg-blue-100 text-blue-600"; break;
          case 'TOPUP_RESULT': Icon = CreditCard; colorClass = n.data?.status === 'approved' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"; break;
          case 'COFFEE': Icon = Coffee; colorClass = "bg-amber-100 text-amber-600"; break;
          case 'COMMENT': Icon = MessageSquare; colorClass = "bg-pink-100 text-pink-600"; break;
          case 'CONTACT_MSG': Icon = Mail; colorClass = "bg-purple-100 text-purple-600"; break;
          case 'CONTACT_REPLY': Icon = Reply; colorClass = "bg-indigo-100 text-indigo-600"; break;
      }

      // Format Date: "DD/MM/YYYY HH:mm"
      const dateStr = new Date(n.timestamp).toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      return (
          <div key={n.id} onClick={() => handleNotifClick(n)} className={`p-4 border-b border-gray-100 hover:bg-slate-50 transition-colors relative group ${!n.isRead ? 'bg-purple-50/40' : ''}`}>
              <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon size={18} />
                  </div>
                  <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm text-slate-800 truncate pr-2">{n.title}</h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{dateStr}</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-1">
                          <span className="font-semibold">{n.senderName}:</span> {n.message}
                      </p>
                      {/* --- ACTIONS AREA --- */}
                      <div className="mt-2 flex flex-wrap gap-2">
                          
                          {/* 1. TOPUP ACTIONS (ADMIN) */}
                          {n.type === 'TOPUP_REQUEST' && user?.role === 'admin' && (
                              <>
                                  <button onClick={(e) => { e.stopPropagation(); onApproveTopUp(n); }} className="px-3 py-1 bg-green-500 text-white text-[10px] rounded-full font-bold hover:bg-green-600 flex items-center gap-1">
                                      <Check size={10} /> Approve
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); onRejectTopUp(n); }} className="px-3 py-1 bg-red-500 text-white text-[10px] rounded-full font-bold hover:bg-red-600 flex items-center gap-1">
                                      <XCircle size={10} /> Reject
                                  </button>
                              </>
                          )}

                          {/* 2. COMMENT ACTIONS (WRITER) */}
                          {n.type === 'COMMENT' && (
                              <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    navigate(`/read/novel-0/${n.data?.chapterNumber || 1}`); // Mock link
                                    onDelete(n.id);
                                }} 
                                className="px-3 py-1 bg-purple-100 text-purple-600 text-[10px] rounded-full font-bold hover:bg-purple-200 flex items-center gap-1"
                              >
                                  <ExternalLink size={10} /> Read & Reply
                              </button>
                          )}

                          {/* 3. CONTACT ACTIONS (ADMIN) */}
                          {n.type === 'CONTACT_MSG' && user?.role === 'admin' && (
                              <button onClick={(e) => { e.stopPropagation(); onReplyContact(n); }} className="px-3 py-1 bg-blue-500 text-white text-[10px] rounded-full font-bold hover:bg-blue-600 flex items-center gap-1">
                                  <Reply size={10} /> Reply
                              </button>
                          )}

                          {/* DELETE BUTTON (ALL) */}
                          <button 
                              onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
                              className="px-2 py-1 text-slate-400 hover:text-red-500 text-[10px] flex items-center gap-1 ml-auto"
                              title="Delete Notification"
                          >
                              <Trash2 size={12} />
                          </button>
                      </div>
                  </div>
              </div>
              {!n.isRead && (
                  <div className="absolute top-4 right-2 w-2 h-2 bg-pink-500 rounded-full"></div>
              )}
          </div>
      );
  };

  return (
    <nav className="fixed w-full z-40 top-0 start-0 border-b border-gray-200/50 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
            L
          </div>
          <span className="self-center text-2xl font-bold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
            LinguaVerse
          </span>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu Content */}
        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent items-center">
            
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded md:p-0 transition-colors duration-300 ${
                      isActive
                        ? 'text-purple-700 font-bold'
                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-purple-600'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}

            {/* Auth / User Section */}
            <li className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3 items-center w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-200">
              {user ? (
                <>
                  {/* NOTIFICATION BELL */}
                  <div className="relative" ref={notifRef}>
                      <button 
                        onClick={() => setShowNotif(!showNotif)}
                        className={`relative p-2 transition-colors rounded-full ${showNotif ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'}`}
                      >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                      </button>

                      {/* NOTIFICATION DROPDOWN */}
                      {showNotif && (
                          <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up origin-top-right">
                              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
                                  <h3 className="font-bold text-slate-800">Notifications</h3>
                                  <span className="text-xs text-purple-600 font-bold bg-white px-2 py-1 rounded-full">{unreadCount} New</span>
                              </div>
                              
                              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                  {myNotifications.length > 0 ? (
                                      myNotifications.map(n => renderNotificationItem(n))
                                  ) : (
                                      <div className="p-8 text-center text-slate-400">
                                          <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                          <p className="text-sm">No notifications yet.</p>
                                      </div>
                                  )}
                              </div>

                              <div className="p-3 border-t border-gray-100 bg-slate-50 text-center">
                                  <p className="text-[10px] text-slate-400">Notifications are automatically deleted after 3 days.</p>
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                    <span className="text-sm font-semibold text-purple-900">{user.points} pts</span>
                    <button 
                        onClick={() => navigate('/topup')}
                        className="bg-purple-600 text-white rounded-full p-0.5 hover:bg-purple-700 transition-colors"
                        title="Top Up Points"
                    >
                        <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 hidden md:inline truncate max-w-[100px]">{user.username}</span>
                    <button 
                        onClick={handleSettingsClick}
                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                        title="Writer Dashboard"
                    >
                        <Settings size={20} />
                    </button>
                    <button 
                        onClick={onLogout}
                        className="text-xs text-red-500 hover:underline md:hidden"
                    >
                        Logout
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                      onOpenAuth();
                      setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/30 w-full md:w-auto justify-center"
                >
                  <LogIn size={16} />
                  Sign In / Up
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;