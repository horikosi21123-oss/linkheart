import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { User } from '../types';
import { MapPin, Info } from 'lucide-react';

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onSwipe }) => {
  const [exitX, setExitX] = useState<number | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Color overlays indicating swipe intent
  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

  const handleDragEnd = (e: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      setExitX(200);
      onSwipe('right');
    } else if (info.offset.x < -100) {
      setExitX(-200);
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity: exitX ? 0 : opacity,
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        cursor: 'grab',
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: exitX || 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="rounded-3xl overflow-hidden shadow-xl bg-white select-none relative"
    >
      {/* Photo */}
      <div 
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${user.photos[0]})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      </div>

      {/* LIKE Overlay */}
      <motion.div 
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-8 border-4 border-green-400 text-green-400 rounded-lg px-4 py-2 text-4xl font-bold transform -rotate-12 z-20"
      >
        LIKE
      </motion.div>

      {/* NOPE Overlay */}
      <motion.div 
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-8 border-4 border-red-500 text-red-500 rounded-lg px-4 py-2 text-4xl font-bold transform rotate-12 z-20"
      >
        NOPE
      </motion.div>

      {/* Info Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
        <div className="flex items-end mb-2">
          <h2 className="text-3xl font-bold mr-3">{user.name}</h2>
          <span className="text-2xl font-medium">{user.age}</span>
        </div>
        
        <div className="flex items-center text-gray-200 mb-3">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{user.location}</span>
        </div>

        <p className="text-gray-100 line-clamp-2 mb-3 text-sm">{user.bio}</p>

        <div className="flex flex-wrap gap-2">
          {user.interests.slice(0, 3).map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;