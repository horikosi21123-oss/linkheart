import React, { useState, useEffect, useRef } from 'react';
import { User, Match, Message } from '../types';
import { db } from '../services/mockDb';
import { ChevronLeft, Send, Image as ImageIcon, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface MatchesPageProps {
  currentUser: User;
}

const MatchesPage: React.FC<MatchesPageProps> = ({ currentUser }) => {
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  
  if (activeMatch) {
    return (
      <ChatInterface 
        match={activeMatch} 
        currentUser={currentUser} 
        onBack={() => setActiveMatch(null)} 
      />
    );
  }

  return (
    <MatchList 
      currentUser={currentUser} 
      onSelectMatch={setActiveMatch} 
    />
  );
};

// --- Sub-components ---

const MatchList: React.FC<{ currentUser: User, onSelectMatch: (m: Match) => void }> = ({ currentUser, onSelectMatch }) => {
  const [matches, setMatches] = useState<(Match & { otherUser: User | undefined })[]>([]);

  useEffect(() => {
    const rawMatches = db.getUserMatches(currentUser.id);
    const enriched = rawMatches.map(m => {
        const otherId = m.users.find(id => id !== currentUser.id) || '';
        return { ...m, otherUser: db.getUser(otherId) };
    }).sort((a, b) => b.timestamp - a.timestamp);
    setMatches(enriched);
  }, [currentUser.id]);

  return (
    <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">メッセージ</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {matches.length === 0 ? (
                <div className="p-8 text-center text-gray-400 mt-10">
                    <p>まだマッチしていません。</p>
                    <p className="text-sm mt-2">気になる人に「いいね」を送ってみましょう！</p>
                </div>
            ) : (
                matches.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => onSelectMatch(item)}
                        className="flex items-center px-4 py-3 border-b border-gray-50 active:bg-gray-50 cursor-pointer"
                    >
                        <img 
                            src={item.otherUser?.photos[0]} 
                            alt="" 
                            className="w-14 h-14 rounded-full object-cover border-2 border-primary-100"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-gray-800 truncate">{item.otherUser?.name}</h3>
                                <span className="text-xs text-gray-400">
                                    {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                                {item.lastMessage || 'マッチしました！メッセージを送りましょう'}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

const ChatInterface: React.FC<{ match: Match, currentUser: User, onBack: () => void }> = ({ match, currentUser, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const otherUserId = match.users.find(id => id !== currentUser.id) || '';
    const otherUser = db.getUser(otherUserId);
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMessages(db.getMessages(match.id));
        const interval = setInterval(() => {
            setMessages(db.getMessages(match.id));
        }, 3000); // Polling for demo
        return () => clearInterval(interval);
    }, [match.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        db.sendMessage(match.id, currentUser.id, input);
        setInput('');
        setMessages(db.getMessages(match.id));
        
        // Simulation: Auto reply after 2 seconds
        if (match.id.includes('match_')) { // simple check
            setTimeout(() => {
                 db.sendMessage(match.id, otherUserId, `Re: ${input}`);
                 setMessages(db.getMessages(match.id));
            }, 2000);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Fake upload - in real app use FormData/Cloud storage
            const fakeUrl = URL.createObjectURL(file);
            db.sendMessage(match.id, currentUser.id, '', fakeUrl);
            setMessages(db.getMessages(match.id));
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 z-50 absolute top-0 left-0 w-full h-full">
            {/* Chat Header */}
            <div className="h-14 bg-white shadow-sm flex items-center px-4 flex-shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <img src={otherUser?.photos[0]} className="w-9 h-9 rounded-full ml-2 object-cover" alt="" />
                <h2 className="ml-3 font-bold text-gray-800">{otherUser?.name}</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                {msg.imageUrl ? (
                                    <img src={msg.imageUrl} className="rounded-xl mb-1 border border-gray-200 max-h-48 object-cover" alt="sent" />
                                ) : (
                                    <div className={`px-4 py-2 rounded-2xl text-sm ${
                                        isMe 
                                        ? 'bg-primary-500 text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'
                                    }`}>
                                        {msg.text}
                                    </div>
                                )}
                                <div className="flex items-center mt-1 space-x-1">
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </span>
                                    {isMe && msg.read && <CheckCheck size={12} className="text-primary-500"/>}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-3 flex items-center gap-3 border-t border-gray-100">
                <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-primary-500">
                    <ImageIcon size={24} />
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </button>
                <form onSubmit={handleSend} className="flex-1 flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-300"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim()}
                        className="p-2 bg-primary-500 text-white rounded-full disabled:opacity-50 disabled:bg-gray-300"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MatchesPage;