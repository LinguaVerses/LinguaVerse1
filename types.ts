
export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  points: number;
  role: 'admin' | 'writer' | 'reader';
}

export enum NovelStatus {
  COMING_SOON = 'Coming Soon',
  ONGOING = 'Ongoing',
  COMPLETE = 'Complete',
  HIATUS = 'Hiatus'
}

export enum NovelLanguage {
  ALL = 'All',
  KR = 'KR',
  CN = 'CN',
  JP = 'JP',
  EN = 'EN',
  TH = 'TH'
}

export const NOVEL_GENRES = [
  'Action', 'Adult', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Josei', 'Mature', 'Psychological', 'Romance', 'Slice of Life', 
  'Smut', 'Supernatural', 'Tragedy', 'Yaoi', 'Yuri'
];

export interface Novel {
  id: string;
  titleEn: string;
  titleOriginal?: string;
  titleTh?: string;
  coverUrl: string;
  status: NovelStatus;
  rating: number;
  language: NovelLanguage;
  genres: string[];
  author: string;
  isNew: boolean;
  isUp: boolean;
  isCopyrighted: boolean;
  description?: string;
}

export interface Comment {
  id: string;
  username: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}

// --- NEW NOTIFICATION TYPES ---
export type NotificationType = 'TOPUP_REQUEST' | 'TOPUP_RESULT' | 'COFFEE' | 'COMMENT' | 'CONTACT_MSG' | 'CONTACT_REPLY';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  senderId?: string;     // User who triggered the action
  senderName: string;
  targetUserRole: 'admin' | 'writer' | 'reader' | 'all'; // Who should see this
  targetUserId?: string; // If specific user (e.g. for replies)
  
  title: string;
  message: string;
  timestamp: Date; // Use Date object for easier 3-day calculation
  isRead: boolean;

  // Context Data (Optional based on type)
  data?: {
    amount?: number;       // For TopUp/Coffee
    cupSize?: string;      // For Coffee
    novelTitle?: string;   // For Comment/Coffee
    chapterNumber?: number;// For Comment
    link?: string;         // Navigation link
    status?: 'pending' | 'approved' | 'rejected'; // For TopUp Logic
  };
}
