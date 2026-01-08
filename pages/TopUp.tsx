import React, { useState, useEffect } from 'react';
import { UserProfile, NotificationItem } from '../types';
import { 
  CreditCard, QrCode, Clock, CheckCircle, AlertCircle, 
  Calendar, User, Landmark, ChevronRight, Crown, Sparkles, Send 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface TopUpProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onSendNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
}

interface Package {
  id: string;
  name: string;
  price: number;
  points: number;
  badge?: string;
  type: 'monthly' | 'onetime';
}

const PACKAGES: Package[] = [
  // Monthly
  { id: 'm1', name: 'Reader Plan', price: 99, points: 900, type: 'monthly' },
  { id: 'm2', name: 'Fan Plan', price: 199, points: 2000, badge: 'Best Seller', type: 'monthly' },
  { id: 'm3', name: 'Super Fan', price: 299, points: 3300, badge: 'Premium', type: 'monthly' },
  // One-time
  { id: 'o1', name: 'Starter', price: 50, points: 400, type: 'onetime' },
  { id: 'o2', name: 'Regular', price: 100, points: 820, badge: 'Recommended', type: 'onetime' },
  { id: 'o3', name: 'Pro', price: 150, points: 1260, type: 'onetime' },
];

const TopUp: React.FC<TopUpProps> = ({ user, onOpenAuth, onSendNotification }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'monthly' | 'onetime'>('onetime');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  
  // Form State
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [transferDate, setTransferDate] = useState('');

  // Set default date-time to now
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setTransferDate(now.toISOString().slice(0, 16));
    
    // Default selection
    setSelectedPackage(PACKAGES.find(p => p.id === 'o2') || null);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
       Swal.fire({
         title: 'Please Login',
         text: 'You must be logged in to top up points.',
         icon: 'warning',
         confirmButtonColor: '#9333ea',
         allowOutsideClick: false
       }).then((result) => {
         if (result.isConfirmed) {
            onOpenAuth();
            navigate('/');
         }
       });
    }
  }, [user, navigate, onOpenAuth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !bankName || !accountName || !transferDate) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลการโอนเงินให้ครบทุกช่องนะคะ',
        confirmButtonColor: '#9333ea'
      });
      return;
    }

    if (!user) return;

    // Simulate API Call & Send Notification to Admin
    Swal.fire({
      title: 'กำลังส่งข้อมูล...',
      html: 'กรุณารอสักครู่ ระบบกำลังแจ้งเตือนไปยังแอดมิน',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => {
      
      // SEND REAL NOTIFICATION TO ADMIN
      onSendNotification({
          type: 'TOPUP_REQUEST',
          senderId: user.uid,
          senderName: user.username,
          targetUserRole: 'admin',
          title: 'แจ้งโอนเงิน (Top Up Request)',
          message: `โอนเงิน ${selectedPackage.price} บาท (${selectedPackage.points} pts) ผ่าน ${bankName}`,
          data: { amount: selectedPackage.points, status: 'pending' }
      });

      Swal.fire({
        icon: 'success',
        title: 'แจ้งโอนเงินเรียบร้อย!',
        html: `
          <div class="text-sm text-slate-600">
            แอดมินได้รับข้อมูลแล้ว จะทำการตรวจสอบและอนุมัติ<br/>
            ภายในเวลาทำการ 07:00 - 20:00 น. ค่ะ
          </div>
        `,
        confirmButtonColor: '#9333ea'
      });
      // Reset form (optional)
      setBankName('');
      setAccountName('');
    });
  };

  const filteredPackages = PACKAGES.filter(p => p.type === activeTab);

  if (!user) return null; // Prevent flicker before redirect

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 font-sarabun">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-10 animate-fade-in-up">
           <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
             Top Up Points
           </h1>
           <p className="text-slate-500 text-lg">
             เติมพอยต์ง่ายๆ อ่านนิยายได้จุใจ สนับสนุนนักเขียนที่คุณรัก
           </p>
        </div>

        {/* --- SERVICE HOURS ALERT --- */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 text-purple-800 p-4 rounded-xl shadow-sm mb-10 flex items-start gap-3 animate-pulse-slow">
           <Clock className="shrink-0 mt-1 text-purple-600" />
           <div>
             <p className="font-bold">แอดมินให้บริการเวลา 07:00 - 20:00 น.</p>
             <p className="text-sm opacity-80">ยอดที่โอนหลังจากเวลานี้ จะได้รับการอนุมัติในเช้าวันถัดไปนะคะ ขอบคุณค่ะ ❤️</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT COLUMN: PACKAGES --- */}
            <div className="lg:col-span-7 space-y-8">
                
                {/* TABS */}
                <div className="flex p-1 bg-white rounded-xl shadow-sm border border-purple-100">
                   <button 
                     onClick={() => setActiveTab('onetime')}
                     className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2
                       ${activeTab === 'onetime' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                   >
                     <CreditCard size={18} /> แบบรายครั้ง
                   </button>
                   <button 
                     onClick={() => setActiveTab('monthly')}
                     className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2
                       ${activeTab === 'monthly' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                   >
                     <Crown size={18} /> แบบรายเดือน
                   </button>
                </div>

                {/* PACKAGES GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPackages.map((pkg) => (
                       <div 
                         key={pkg.id}
                         onClick={() => setSelectedPackage(pkg)}
                         className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group overflow-hidden
                           ${selectedPackage?.id === pkg.id 
                             ? 'border-purple-500 bg-purple-50 shadow-lg scale-105' 
                             : 'border-white bg-white hover:border-purple-200 hover:shadow-md'
                           }`}
                       >
                          {pkg.badge && (
                            <div className="absolute top-0 right-0">
                               <span className={`text-[10px] font-bold px-3 py-1 rounded-bl-lg text-white shadow-sm flex items-center gap-1
                                 ${pkg.badge === 'Best Seller' ? 'bg-red-500 animate-bounce' : 'bg-orange-500'}
                               `}>
                                 {pkg.badge === 'Best Seller' && <Sparkles size={10} />}
                                 {pkg.badge}
                               </span>
                            </div>
                          )}
                          
                          <div className="mb-4">
                             <h3 className={`font-bold text-lg ${selectedPackage?.id === pkg.id ? 'text-purple-700' : 'text-slate-700'}`}>
                               {pkg.name}
                             </h3>
                             <div className="flex items-baseline gap-1 mt-1">
                               <span className="text-2xl font-bold text-slate-800">{pkg.price}</span>
                               <span className="text-xs text-slate-500">THB</span>
                             </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
                             <div className="flex flex-col">
                                <span className="text-xs text-slate-400">You get</span>
                                <span className="font-bold text-purple-600 text-lg">{pkg.points.toLocaleString()} pts</span>
                             </div>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedPackage?.id === pkg.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <CheckCircle size={18} />
                             </div>
                          </div>
                       </div>
                    ))}
                </div>
            </div>

            {/* --- RIGHT COLUMN: PAYMENT FORM --- */}
            <div className="lg:col-span-5">
               <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden sticky top-24">
                  
                  {/* Header Decoration */}
                  <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
                  
                  <div className="p-8">
                     <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <QrCode className="text-purple-600" /> Payment & Confirm
                     </h2>

                     {/* QR Code Section */}
                     <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100 text-center relative group">
                        <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold">
                           Scan Me
                        </div>
                        {selectedPackage ? (
                           <>
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PromptPay-${selectedPackage.price}-THB`} 
                                alt="PromptPay QR" 
                                className="w-48 h-48 mx-auto rounded-lg shadow-sm border-4 border-white mb-4 group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="text-purple-700 font-bold text-2xl mb-1">
                                 {selectedPackage.price} THB
                              </div>
                              <div className="text-xs text-slate-400">
                                 PromptPay (พร้อมเพย์)
                              </div>
                           </>
                        ) : (
                           <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                              กรุณาเลือกแพ็กเกจ
                           </div>
                        )}
                     </div>

                     {/* Bank Info */}
                     <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                              <Landmark size={20} />
                           </div>
                           <div>
                              <p className="text-xs text-slate-500">ธนาคารกรุงไทย (Krungthai Bank)</p>
                              <p className="font-bold text-slate-800">987-6-54321-0</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500">
                              <User size={20} />
                           </div>
                           <div>
                              <p className="text-xs text-slate-500">ชื่อบัญชี</p>
                              <p className="font-bold text-slate-800">ทิติภา ผาตินาวิน</p>
                           </div>
                        </div>
                     </div>

                     {/* Form */}
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Username</label>
                           <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-lg text-slate-600 cursor-not-allowed">
                              <User size={16} />
                              <span className="font-medium">{user.username}</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">ธนาคารที่โอน *</label>
                              <input 
                                required
                                type="text" 
                                placeholder="เช่น กสิกร, SCB"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                              />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">ชื่อบัญชีผู้โอน *</label>
                              <input 
                                required
                                type="text" 
                                placeholder="ชื่อจริง-นามสกุล"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">วันที่และเวลาที่โอน *</label>
                           <input 
                              required
                              type="datetime-local"
                              value={transferDate}
                              onChange={(e) => setTransferDate(e.target.value)}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                           />
                        </div>
                        
                        <div className="pt-4">
                           <button 
                             type="submit"
                             className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-300 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                           >
                              <Send size={20} /> แจ้งโอนเงิน (Notify Transfer)
                           </button>
                        </div>
                     </form>

                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
