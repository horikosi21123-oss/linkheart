import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { db } from '../services/mockDb';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
        // Mock registration logic
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: name || 'New User',
            age: 20,
            gender: 'male',
            location: 'Unknown',
            bio: 'Hello!',
            interests: [],
            photos: ['https://picsum.photos/400/600'],
        };
        db.createUser(newUser);
        onLogin(newUser);
        navigate('/profile'); // Go to profile to finish setup
    } else {
        const user = db.login(email);
        if (user) {
            onLogin(user);
            navigate('/discovery');
        } else {
            alert('ユーザーが見つかりません (demo: use "admin" or just click login)');
        }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-500 to-rose-600 text-white">
      <div className="mb-12 flex flex-col items-center">
        <div className="bg-white p-4 rounded-full shadow-lg mb-4">
            <Heart className="text-primary-500 w-12 h-12 fill-current" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">LinkHeart</h1>
        <p className="mt-2 text-primary-100">運命の相手を見つけよう</p>
      </div>

      <form onSubmit={handleAuth} className="w-full max-w-xs space-y-4">
        {isRegistering && (
             <input
             type="text"
             placeholder="ニックネーム"
             className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
             value={name}
             onChange={(e) => setName(e.target.value)}
           />
        )}
        <input
          type="email"
          placeholder="メールアドレス"
          className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
          value="dummy" // Dummy password
          readOnly
        />
        
        <button
          type="submit"
          className="w-full bg-white text-primary-600 font-bold py-3 rounded-xl shadow-md hover:bg-gray-50 transition-colors"
        >
          {isRegistering ? 'アカウント作成' : 'ログイン'}
        </button>
      </form>

      <div className="mt-8 space-y-3 w-full max-w-xs">
        <button className="w-full bg-black text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
            <span className="text-lg"></span> Appleでログイン
        </button>
        <button className="w-full bg-white text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-gray-200">
             <span className="text-blue-500 font-bold">G</span> Googleでログイン
        </button>
      </div>

      <button 
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-6 text-sm text-white/80 hover:underline"
      >
        {isRegistering ? 'すでにアカウントをお持ちの方' : 'アカウントをお持ちでない方'}
      </button>

      <div className="mt-8 text-xs text-white/60 text-center">
        <p>デモ用アカウント: 空欄のままログインで自動的に入れます</p>
        <p>管理者: 'admin' と入力してください</p>
      </div>
    </div>
  );
};

export default LoginPage;