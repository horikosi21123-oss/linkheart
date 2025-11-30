import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { User } from '../types';
import { RefreshCw, Trash2, HeartHandshake } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const likes = db.getLikes();
  const matches = db.getMatches();

  const handleReset = () => {
    if (confirm('全てのデータをリセットしますか？')) {
      db.reset();
    }
  };

  const forceMatch = (user1Id: string, user2Id: string) => {
    db.createMatch(user1Id, user2Id);
    alert('マッチングを強制成立させました');
    window.location.reload();
  };

  return (
    <div className="p-4 bg-gray-100 min-h-full pb-20 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Console</h1>
        <button onClick={handleReset} className="bg-red-500 text-white px-3 py-2 rounded shadow flex items-center gap-2 text-sm">
          <Trash2 size={16} /> Reset DB
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-xs text-gray-500">Users</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold">{likes.length}</div>
            <div className="text-xs text-gray-500">Swipes</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold">{matches.length}</div>
            <div className="text-xs text-gray-500">Matches</div>
        </div>
      </div>

      {/* User List */}
      <h2 className="font-bold mb-2 text-gray-700">All Users</h2>
      <div className="space-y-3">
        {users.map(u => (
          <div key={u.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
               <img src={u.photos[0]} className="w-10 h-10 rounded-full object-cover" alt=""/>
               <div>
                 <div className="font-bold text-sm">{u.name} ({u.age})</div>
                 <div className="text-xs text-gray-400">{u.id}</div>
               </div>
            </div>
            {!u.isAdmin && (
                <div className="flex gap-2">
                    {users.filter(target => target.id !== u.id && !target.isAdmin).map(target => (
                         <button 
                            key={target.id}
                            onClick={() => forceMatch(u.id, target.id)}
                            className="bg-blue-100 text-blue-600 p-1 rounded text-xs"
                            title={`Match with ${target.name}`}
                         >
                            <HeartHandshake size={14} />
                         </button>
                    ))}
                </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-400">
         管理者モード: ユーザーデータの閲覧、マッチング操作が可能です。
      </div>
    </div>
  );
};

export default AdminPage;