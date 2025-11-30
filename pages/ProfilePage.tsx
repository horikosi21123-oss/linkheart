import React, { useState } from 'react';
import { User, INTERESTS_LIST } from '../types';
import { db } from '../services/mockDb';
import { Settings, LogOut, Camera, Save } from 'lucide-react';

interface ProfilePageProps {
  currentUser: User;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(currentUser);

  const handleSave = () => {
    db.updateUser(formData);
    // In a real app we would update the global context here
    alert('保存しました！');
    setIsEditing(false);
  };

  const toggleInterest = (interest: string) => {
    const current = formData.interests;
    if (current.includes(interest)) {
      setFormData({ ...formData, interests: current.filter(i => i !== interest) });
    } else {
      setFormData({ ...formData, interests: [...current, interest] });
    }
  };

  if (isEditing) {
    return (
      <div className="h-full bg-white flex flex-col overflow-y-auto">
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button onClick={() => setIsEditing(false)} className="text-gray-500">キャンセル</button>
          <h1 className="font-bold">プロフィール編集</h1>
          <button onClick={handleSave} className="text-primary-500 font-bold">完了</button>
        </div>

        <div className="p-4 space-y-6 pb-20">
          {/* Photos */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {formData.photos.map((photo, idx) => (
              <div key={idx} className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg relative overflow-hidden">
                <img src={photo} className="w-full h-full object-cover" alt="" />
                <button className="absolute bottom-1 right-1 bg-black/50 text-white p-1 rounded-full">
                    <Camera size={12} />
                </button>
              </div>
            ))}
            <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <Camera className="text-gray-300" />
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">ニックネーム</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full mt-1 p-2 border-b border-gray-200 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">自己紹介</label>
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full mt-1 p-2 border rounded-lg border-gray-200 focus:outline-none focus:border-primary-500 text-sm h-24"
              />
            </div>
             <div>
              <label className="text-xs font-bold text-gray-500 uppercase">居住地</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full mt-1 p-2 border-b border-gray-200 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">興味・関心</label>
            <div className="flex flex-wrap gap-2">
                {INTERESTS_LIST.map(tag => (
                    <button
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1 rounded-full text-xs border ${
                            formData.interests.includes(tag)
                            ? 'bg-primary-50 border-primary-500 text-primary-600 font-medium'
                            : 'bg-white border-gray-300 text-gray-500'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col relative">
      {/* Header Profile Pic Style */}
      <div className="relative h-64 w-full">
         <img src={currentUser.photos[0]} className="w-full h-full object-cover" alt="Profile" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
         <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold flex items-end gap-2">
                {currentUser.name} <span className="text-xl font-normal">{currentUser.age}</span>
            </h1>
            <p className="opacity-90">{currentUser.location}</p>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 -mt-4 bg-white rounded-t-3xl relative p-6 space-y-6 overflow-y-auto">
         {/* Action Bar */}
         <div className="flex justify-around border-b border-gray-100 pb-6">
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-sm">
                    <Settings size={20} />
                </div>
                <span className="text-xs font-medium text-gray-500">設定・編集</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer relative">
                 <div className="w-16 h-16 -mt-8 bg-white p-1 rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-rose-600 rounded-full flex items-center justify-center text-white">
                        <span className="text-xs font-bold">Plan</span>
                    </div>
                 </div>
                 <span className="text-xs font-medium text-primary-500 font-bold">無料プラン</span>
            </div>
             <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onLogout}>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-sm">
                    <LogOut size={20} />
                </div>
                <span className="text-xs font-medium text-gray-500">ログアウト</span>
            </div>
         </div>

         {/* Bio */}
         <div>
            <h3 className="font-bold text-gray-800 mb-2">自己紹介</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
                {currentUser.bio}
            </p>
         </div>

         {/* Interests */}
         <div>
            <h3 className="font-bold text-gray-800 mb-2">興味・関心</h3>
            <div className="flex flex-wrap gap-2">
                {currentUser.interests.map(tag => (
                     <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-600 text-xs rounded-full font-medium">
                        {tag}
                     </span>
                ))}
            </div>
         </div>
         
         <div className="h-10"></div>
      </div>
    </div>
  );
};

export default ProfilePage;