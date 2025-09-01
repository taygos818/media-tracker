import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Library, 
  BarChart3, 
  Settings, 
  Zap,
  Film
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/watchlist', icon: Library, label: 'Watchlist' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/integrations', icon: Zap, label: 'Integrations' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">MediaTracker</h1>
            <p className="text-sm text-gray-400">Personal Media Hub</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg">
          <h3 className="font-semibold text-sm">Pro Features</h3>
          <p className="text-xs text-gray-200 mt-1">
            Unlock advanced analytics and unlimited platforms
          </p>
          <button className="mt-3 bg-white text-gray-900 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};