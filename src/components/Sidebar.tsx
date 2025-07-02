import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Layers, 
  Package, 
  FileText, 
  Users, 
  Newspaper, 
  Gift, 
  UserPlus, 
  Image, 
  Coins, 
  RefreshCw, 
  MoreHorizontal, 
  Settings, 
  HelpCircle, 
  FileCheck, 
  Shield,
  X,
  Car
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { icon: Layers, label: 'Scheme', path: '/scheme' },
  { icon: Package, label: 'Product', path: '/product' },
  { icon: FileText, label: 'Report', path: '/report' },
  { icon: Users, label: 'User & Executive', path: '/user-executive' },
  { icon: Newspaper, label: 'News Update', path: '/news-update' },
  { icon: Gift, label: 'Gift Purchase', path: '/gift-purchase' },
  { icon: UserPlus, label: 'Create App User', path: '/create-app-user' },
  { icon: Image, label: 'Add Banner', path: '/add-banner' },
  { icon: Coins, label: 'Generate Redeem', path: '/generate-redeem' },
  { icon: RefreshCw, label: 'Redeem Request', path: '/redeem-request' },
  { icon: MoreHorizontal, label: 'Others', path: '/others' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'FAQ', path: '/faq' },
  { icon: FileCheck, label: 'Terms & Conditions', path: '/terms-conditions' },
  { icon: Shield, label: 'Privacy Policy', path: '/privacy-policy' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FASTAGCAB</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className={clsx(
                    'mr-3 h-5 w-5',
                    isActive ? 'text-blue-700' : 'text-gray-400'
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-4 left-3 right-3">
          <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-150">
            Reload
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;