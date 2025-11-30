import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Using react-router-dom from HashRouter in App
import { Flame, MessageCircle, User } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideNav }) => {
  const location = useLocation();

  const navItems = [
    { path: '/discovery', icon: Flame, label: '探す' },
    { path: '/matches', icon: MessageCircle, label: 'メッセージ' },
    { path: '/profile', icon: User, label: 'マイページ' },
  ];

  return (
    <div className="max-w-md mx-auto h-full flex flex-col bg-white shadow-2xl overflow-hidden relative sm:rounded-xl sm:my-4 sm:h-[90vh] sm:border border-gray-200">
      <main className="flex-1 overflow-hidden relative bg-gray-50">
        {children}
      </main>

      {!hideNav && (
        <nav className="h-16 bg-white border-t border-gray-100 flex justify-around items-center z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                  isActive ? "text-primary-500" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon size={24} className={clsx(isActive && "fill-current")} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default Layout;