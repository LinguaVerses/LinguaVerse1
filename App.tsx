import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Novels from './pages/Novels';
import NovelDetails from './pages/NovelDetails';
import ChapterReader from './pages/ChapterReader';
import AdminDashboard from './pages/AdminDashboard';
import TopUp from './pages/TopUp'; 
import ContactUs from './pages/ContactUs'; 
import AboutUs from './pages/AboutUs'; // Import AboutUs
import GenericPlaceholder from './pages/GenericPlaceholder';
import { UserProfile, NotificationItem } from './types';
import Swal from 'sweetalert2';

// --- MOCK INITIAL NOTIFICATIONS ---
const MOCK_NOTIFS: NotificationItem[] = [
    {
        id: 'n1',
        type: 'TOPUP_REQUEST',
        senderName: 'ReaderOne',
        senderId: 'u1',
        targetUserRole: 'admin',
        title: 'แจ้งโอนเงิน (Top Up Request)',
        message: 'โอนเงิน 100 บาท (820 pts) ผ่าน KTB',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        isRead: false,
        data: { amount: 820, status: 'pending' }
    },
    {
        id: 'n2',
        type: 'COMMENT',
        senderName: 'FanClub99',
        targetUserRole: 'writer',
        title: 'New Comment',
        message: 'สนุกมากครับ! รอติดตามตอนต่อไป',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        data: { novelTitle: 'The Legend of Hero', chapterNumber: 5 }
    },
    {
        id: 'n3',
        type: 'CONTACT_MSG',
        senderName: 'UserError',
        senderId: 'u3',
        targetUserRole: 'admin',
        title: 'Contact: Login Issue',
        message: 'I cannot login to my account since yesterday.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
        isRead: true,
    }
];

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load Mock Data on Init
  useEffect(() => {
    setNotifications(MOCK_NOTIFS);
  }, []);

  // --- AUTOMATIC CLEANUP (3 DAYS) ---
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
        const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
        
        setNotifications(prev => {
            const valid = prev.filter(n => new Date(n.timestamp).getTime() > threeDaysAgo);
            // Log if something was removed (optional)
            if(valid.length !== prev.length) {
                console.log('Cleaned up old notifications');
            }
            return valid;
        });
    }, 60000); // Check every minute (simulation)

    return () => clearInterval(cleanupInterval);
  }, []);

  const handleLoginSuccess = (userData: UserProfile) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const updateUserPoints = (newPoints: number) => {
      if (user) setUser({ ...user, points: newPoints });
  };

  // --- NOTIFICATION HANDLERS ---

  // 1. Add Notification (Called from child pages)
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
      const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          timestamp: new Date(),
          isRead: false,
          ...notif
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  // 2. Mark as Read
  const markAsRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // 3. Delete Notification
  const deleteNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // 4. Admin Action: Approve TopUp
  const handleApproveTopUp = (notif: NotificationItem) => {
      // 1. Update Sender's Points (Mock: if user is logged in as sender, update immediately)
      // In real app: Backend update
      
      // 2. Notify Sender
      addNotification({
          type: 'TOPUP_RESULT',
          senderName: 'System (Admin)',
          targetUserRole: 'reader', // or specific user ID
          targetUserId: notif.senderId,
          title: 'เติม Points สำเร็จ! (Top Up Approved)',
          message: `ยอด ${notif.data?.amount} points ได้เข้าสู่ระบบแล้ว ขอบคุณที่ใช้บริการค่ะ`,
          data: { status: 'approved' }
      });

      // 3. Delete Request
      deleteNotification(notif.id);

      // 4. Feedback
      Swal.fire({
          icon: 'success',
          title: 'Approved!',
          text: 'Points added to user and notification sent.',
          timer: 1500,
          showConfirmButton: false
      });
  };

  // 5. Admin Action: Reject TopUp
  const handleRejectTopUp = (notif: NotificationItem) => {
      addNotification({
          type: 'TOPUP_RESULT',
          senderName: 'System (Admin)',
          targetUserRole: 'reader',
          targetUserId: notif.senderId,
          title: 'การเติมเงินถูกปฏิเสธ (Top Up Rejected)',
          message: 'ไม่สามารถเติม points ได้เนื่องจากหลักฐานไม่ถูกต้อง กรุณาติดต่อ Admin ค่ะ',
          data: { status: 'rejected' }
      });
      deleteNotification(notif.id);
      Swal.fire({
          icon: 'info',
          title: 'Rejected',
          text: 'Rejection notice sent to user.',
          timer: 1500,
          showConfirmButton: false
      });
  };

  // 6. Admin Action: Reply to Contact
  const handleReplyContact = async (notif: NotificationItem) => {
      const { value: text } = await Swal.fire({
          input: 'textarea',
          inputLabel: `Reply to ${notif.senderName}`,
          inputPlaceholder: 'Type your reply message...',
          inputAttributes: {
            'aria-label': 'Type your reply message'
          },
          showCancelButton: true,
          confirmButtonText: 'Send Reply',
          confirmButtonColor: '#9333ea'
      });

      if (text) {
          addNotification({
              type: 'CONTACT_REPLY',
              senderName: 'Admin Support',
              targetUserRole: 'reader',
              targetUserId: notif.senderId,
              title: `Re: ${notif.title}`,
              message: text
          });
          deleteNotification(notif.id);
          Swal.fire('Sent!', 'Reply has been sent.', 'success');
      }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans">
        <Navbar 
          user={user} 
          notifications={notifications}
          onOpenAuth={() => setIsAuthOpen(true)} 
          onLogout={handleLogout}
          // Pass Notification Handlers to Navbar
          onMarkRead={markAsRead}
          onDelete={deleteNotification}
          onApproveTopUp={handleApproveTopUp}
          onRejectTopUp={handleRejectTopUp}
          onReplyContact={handleReplyContact}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/novels" element={<Novels />} />
            <Route 
                path="/novel/:id" 
                element={
                    <NovelDetails 
                        user={user} 
                        updateUserPoints={updateUserPoints}
                        onOpenAuth={() => setIsAuthOpen(true)}
                        onSendNotification={addNotification}
                    />
                } 
            />
            <Route 
                path="/read/:novelId/:chapterId" 
                element={
                    <ChapterReader 
                        user={user} 
                        onOpenAuth={() => setIsAuthOpen(true)}
                        onSendNotification={addNotification}
                    />
                } 
            />
            <Route 
                path="/admin/manage" 
                element={
                    <AdminDashboard user={user} onOpenAuth={() => setIsAuthOpen(true)} />
                } 
            />
            <Route 
                path="/topup" 
                element={
                    <TopUp 
                        user={user} 
                        onOpenAuth={() => setIsAuthOpen(true)} 
                        onSendNotification={addNotification}
                    />
                } 
            />
            <Route 
                path="/contact" 
                element={
                    <ContactUs 
                        user={user} 
                        onSendNotification={addNotification}
                    />
                } 
            />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </main>

        <Footer />
        <ScrollToTop />
        
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  );
}

export default App;