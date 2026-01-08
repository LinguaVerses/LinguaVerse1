import React, { useState } from 'react';
import { Mail, MessageSquare, Send, MapPin, Phone, Globe } from 'lucide-react';
import Swal from 'sweetalert2';
import { UserProfile, NotificationItem } from '../types';
import { useNavigate } from 'react-router-dom';

interface ContactUsProps {
  user: UserProfile | null;
  onSendNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ user, onSendNotification }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
       Swal.fire({
           icon: 'warning',
           title: 'Please Login',
           text: 'You need to login to send a message.',
           confirmButtonColor: '#9333ea'
       });
       return;
    }

    if (!formData.subject || !formData.message) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Info',
            text: 'Please fill in all fields.',
            confirmButtonColor: '#9333ea'
        });
        return;
    }

    // Logic: Send Notification to Admin
    onSendNotification({
        type: 'CONTACT_MSG',
        senderId: user.uid,
        senderName: user.username,
        targetUserRole: 'admin', // Send to Admin
        title: `Contact: ${formData.subject}`,
        message: formData.message,
    });

    Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Admin has received your message. We will reply shortly.',
        confirmButtonColor: '#9333ea'
    }).then(() => {
        setFormData({ subject: '', message: '' });
        navigate('/');
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 font-sarabun">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 mb-4">
                Get in Touch
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                มีคำถาม ข้อเสนอแนะ หรือพบปัญหาการใช้งาน? ทีมงาน LinguaVerse พร้อมดูแลคุณตลอด 24 ชม.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Info Card */}
            <div className="space-y-8 animate-slide-in-left">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-500/5 border border-purple-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Globe className="text-purple-600" /> Contact Information
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Email Support</h4>
                                <p className="text-slate-500">support@linguaverse.com</p>
                                <p className="text-slate-500">writer@linguaverse.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Office Location</h4>
                                <p className="text-slate-500">
                                    123 Novel Tower, 15th Floor, <br/>
                                    Bangkok, Thailand 10500
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Call Center</h4>
                                <p className="text-slate-500">02-123-4567 (09:00 - 18:00)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-slide-in-right relative">
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                 
                 <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <MessageSquare className="text-pink-500" /> Send Message
                 </h3>
                 <p className="text-slate-400 text-sm mb-6">
                    Admin จะได้รับข้อความแจ้งเตือนทันที และจะตอบกลับผ่านระบบ Notification
                 </p>

                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">หัวข้อเรื่อง (Subject)</label>
                         <input 
                            type="text" 
                            className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            placeholder="เช่น แจ้งปัญหาการเติมเงิน, สอบถามเรื่องลิขสิทธิ์"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">ข้อความ (Message)</label>
                         <textarea 
                            className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all h-40 resize-none"
                            placeholder="พิมพ์ข้อความของคุณที่นี่..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                         />
                     </div>
                     
                     <div className="pt-2">
                        <button 
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-300 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={20} /> ส่งข้อความ (Send Message)
                        </button>
                     </div>
                 </form>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
