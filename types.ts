export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  bio: string;
  interests: string[];
  photos: string[];
  isAdmin?: boolean;
}

export interface Match {
  id: string;
  users: [string, string]; // User IDs
  timestamp: number;
  lastMessage?: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  timestamp: number;
  read: boolean;
}

export interface Like {
  fromUserId: string;
  toUserId: string;
  type: 'like' | 'skip';
  timestamp: number;
}

// Mock initial data helpers
export const INTERESTS_LIST = [
  'カフェ巡り', '映画鑑賞', '旅行', '筋トレ', 'ゲーム', 
  '料理', '読書', '音楽', 'アウトドア', '写真'
];
