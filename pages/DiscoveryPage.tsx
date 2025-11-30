import React, { useState, useEffect } from 'react';
import { User, Match } from '../types';
import { db } from '../services/mockDb';
import SwipeCard from '../components/SwipeCard';
import { X, Heart, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscoveryPageProps {
  currentUser: User;
}

const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ currentUser }) => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [matchPopup, setMatchPopup] = useState<Match | null>(null);

  useEffect(() => {
    loadProfiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  const loadProfiles = () => {
    const potential = db.getPotentialMatches(currentUser.id);
    setProfiles(potential);
  };

  const handleDemoReset = () => {
    // Demo helper: clear likes for current user so they can swipe again
    const likes = db.getLikes();
    const otherUsersLikes = likes.filter(l => l.fromUserId !== currentUser.id);
    localStorage.setItem('lh_likes', JSON.stringify(otherUsersLikes));
    loadProfiles();
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (profiles.length === 0) return;

    const targetUser = profiles[0]; // The top card
    const type = direction === 'right' ? 'like' : 'skip';

    // Remove from stack visually immediately
    setProfiles((prev) => prev.slice(1));

    // Process logic
    const result = await db.swipe(currentUser.id, targetUser.id, type);
    
    if (result.isMatch && result.match) {
      setMatchPopup(result.match);
    }
  };

  const buttonSwipe = (dir: 'left' | 'right') => {
    handleSwipe(dir);
  };

  const isDeckEmpty = profiles.length === 0;

  return (
    <div className="h-full flex flex-col relative bg-gradient-to-b from-gray-50 to-gray-200">
      
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <h1 className="text-xl font-bold text-primary-500">LinkHeart</h1>
        <button className="p-2 bg-gray-100 rounded-full text-gray-500">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Card Deck */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full h-[65vh] max-h-[600px] max-w-sm">
          <AnimatePresence>
            {profiles.length > 0 ? (
              profiles.map((profile, index) => (
                <div
                    key={profile.id}
                    className="absolute inset-0 z-10"
                    style={{ zIndex: profiles.length - index }}
                >
                     {/* Only render the top 2 cards for performance */}
                    {index <= 1 && (
                        <SwipeCard 
                            user={profile} 
                            onSwipe={handleSwipe} 
                        />
                    )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                    <RefreshCcw size={40} className="text-gray-400" />
                </div>
                <p className="font-medium">近くに相手がいません</p>
                <p className="text-sm mt-2 text-gray-400 mb-6">条件を変更するか、後でもう一度お試しください。</p>
                
                <button 
                    onClick={handleDemoReset} 
                    className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
                >
                    [デモ] 最初からやり直す
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="h-24 flex items-center justify-center gap-8 pb-4">
        <button 
          onClick={() => buttonSwipe('left')}
          disabled={isDeckEmpty}
          className={`w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200
            ${isDeckEmpty 
                ? 'opacity-50 cursor-not-allowed text-gray-300 shadow-none' 
                : 'text-red-500 hover:scale-110'
            }`}
        >
          <X size={28} />
        </button>
        <button 
           onClick={() => buttonSwipe('right')}
           disabled={isDeckEmpty}
           className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
            ${isDeckEmpty 
                ? 'bg-gray-200 opacity-50 cursor-not-allowed text-gray-400 shadow-none' 
                : 'bg-gradient-to-r from-primary-500 to-rose-600 shadow-primary-500/30 text-white hover:scale-110'
            }`}
        >
          <Heart size={28} fill={isDeckEmpty ? "none" : "currentColor"} />
        </button>
      </div>

      {/* Match Popup */}
      <AnimatePresence>
        {matchPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.h2 
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="text-5xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8"
            >
                It's a Match!
            </motion.h2>
            
            <p className="text-white mb-8 text-lg">お互いにいいねしました！</p>
            
            <div className="flex gap-4 w-full">
                <button 
                    onClick={() => setMatchPopup(null)}
                    className="flex-1 bg-white text-gray-900 py-3 rounded-full font-bold"
                >
                    続けて探す
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscoveryPage;