import { User, Match, Message, Like, INTERESTS_LIST } from '../types';

const STORAGE_KEYS = {
  USERS: 'lh_users',
  LIKES: 'lh_likes',
  MATCHES: 'lh_matches',
  MESSAGES: 'lh_messages',
  CURRENT_USER: 'lh_current_user',
};

// Seed Data
const SEED_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Kenji',
    age: 26,
    gender: 'male',
    location: '東京',
    bio: '都内でエンジニアをしています。休日はカフェで本を読んだりしてます。よろしくお願いします！',
    interests: ['カフェ巡り', '読書', '技術'],
    photos: ['https://picsum.photos/seed/kenji1/400/600', 'https://picsum.photos/seed/kenji2/400/600'],
  },
  {
    id: 'user_2',
    name: 'Ayaka',
    age: 24,
    gender: 'female',
    location: '横浜',
    bio: '旅行と美味しいものを食べるのが大好きです🍰 仲良くしてください♪',
    interests: ['旅行', '料理', '映画鑑賞'],
    photos: ['https://picsum.photos/seed/ayaka1/400/600', 'https://picsum.photos/seed/ayaka2/400/600'],
  },
  {
    id: 'user_3',
    name: 'Hiro',
    age: 28,
    gender: 'male',
    location: '埼玉',
    bio: 'アウトドア派です！キャンプとか一緒に行ける人と出会えたら嬉しいです。',
    interests: ['アウトドア', '筋トレ', '写真'],
    photos: ['https://picsum.photos/seed/hiro1/400/600'],
  },
  {
    id: 'user_4',
    name: 'Mio',
    age: 23,
    gender: 'female',
    location: '東京',
    bio: '看護師してます。最近ジムに通い始めました！',
    interests: ['筋トレ', '音楽', 'ショッピング'],
    photos: ['https://picsum.photos/seed/mio1/400/600', 'https://picsum.photos/seed/mio2/400/600'],
  },
  {
    id: 'admin_1',
    name: 'Admin User',
    age: 99,
    gender: 'other',
    location: 'System',
    bio: 'Developer Account',
    interests: [],
    photos: ['https://picsum.photos/seed/admin/400/600'],
    isAdmin: true
  }
];

class MockDB {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LIKES)) {
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MATCHES)) {
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
    }
  }

  // --- Users ---
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  getUser(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  createUser(user: User): User {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return user;
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // --- Discovery Logic ---
  getPotentialMatches(currentUserId: string): User[] {
    const users = this.getUsers();
    const likes = this.getLikes();
    
    // Filter out self and users already swiped on
    const swipedUserIds = new Set(
      likes
        .filter(l => l.fromUserId === currentUserId)
        .map(l => l.toUserId)
    );

    return users.filter(u => u.id !== currentUserId && !swipedUserIds.has(u.id));
  }

  // --- Likes & Matching ---
  getLikes(): Like[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '[]');
  }

  async swipe(fromUserId: string, toUserId: string, type: 'like' | 'skip'): Promise<{ isMatch: boolean; match?: Match }> {
    const likes = this.getLikes();
    const newLike: Like = { fromUserId, toUserId, type, timestamp: Date.now() };
    
    likes.push(newLike);
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));

    if (type === 'like') {
      // Check for mutual like
      const mutualLike = likes.find(l => l.fromUserId === toUserId && l.toUserId === fromUserId && l.type === 'like');
      
      if (mutualLike) {
        const match = this.createMatch(fromUserId, toUserId);
        return { isMatch: true, match };
      }
    }
    return { isMatch: false };
  }

  // --- Matches ---
  getMatches(): Match[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || '[]');
  }

  getUserMatches(userId: string): Match[] {
    return this.getMatches().filter(m => m.users.includes(userId));
  }

  createMatch(user1Id: string, user2Id: string): Match {
    const matches = this.getMatches();
    // Avoid duplicates
    const existing = matches.find(m => m.users.includes(user1Id) && m.users.includes(user2Id));
    if (existing) return existing;

    const newMatch: Match = {
      id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      users: [user1Id, user2Id],
      timestamp: Date.now()
    };
    matches.push(newMatch);
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    return newMatch;
  }

  // --- Messages ---
  getMessages(matchId: string): Message[] {
    const allMessages: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    return allMessages.filter(m => m.matchId === matchId).sort((a, b) => a.timestamp - b.timestamp);
  }

  sendMessage(matchId: string, senderId: string, text: string, imageUrl?: string): Message {
    const allMessages: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId,
      text,
      imageUrl,
      timestamp: Date.now(),
      read: false
    };
    allMessages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
    
    // Update match last message
    const matches = this.getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);
    if(matchIndex >= 0) {
      matches[matchIndex].lastMessage = text || 'Sent an image';
      matches[matchIndex].timestamp = Date.now(); // bump to top
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    }

    return newMessage;
  }

  // --- Auth Simulation ---
  login(email: string): User | null {
    // Simple mock login: if email contains "admin", log in as admin, else pick a random user or create one
    if (email.includes('admin')) {
      return SEED_USERS.find(u => u.isAdmin) || SEED_USERS[0];
    }
    // For demo, just return the first user that matches roughly or create a new one
    // Here we just pick User 1 for convenience if not admin
    return SEED_USERS[0];
  }

  reset() {
      localStorage.clear();
      this.init();
      window.location.reload();
  }
}

export const db = new MockDB();