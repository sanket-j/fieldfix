import React, { useState } from 'react';
import { 
  Wrench, 
  BookOpen, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Clock, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { UserProfile, Booking } from '../firebase';

interface NavbarProps {
  currentView: 'home' | 'directory' | 'wiki' | 'worker-dashboard' | 'admin';
  setCurrentView: (view: 'home' | 'directory' | 'wiki' | 'worker-dashboard' | 'admin') => void;
  currentUser: UserProfile | null;
  bookings: Booking[];
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  bookings,
  onOpenAuth,
  onSignOut,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const workerPendingCount = currentUser?.role === 'worker'
    ? bookings.filter((b) => (b.workerUserId === currentUser.uid || b.workerId === currentUser.workerId) && b.status === 'pending').length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE3D2] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C5C] text-white flex items-center justify-center shadow-md shadow-[#0F4C5C]/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-[#E07A5F]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-black tracking-tight text-[#0F4C5C]">
                Field<span className="text-[#C85A3A]">Fix</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Community Repair Hub
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentView('directory')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'directory'
                  ? 'bg-[#0F4C5C] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50 hover:text-[#0F4C5C]'
              }`}
            >
              Find Workers
            </button>

            <button
              onClick={() => setCurrentView('wiki')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'wiki'
                  ? 'bg-[#0F4C5C] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50 hover:text-[#0F4C5C]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Techniques Wiki</span>
            </button>

            {currentUser?.role === 'worker' && (
              <button
                onClick={() => setCurrentView('worker-dashboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentView === 'worker-dashboard'
                    ? 'bg-[#0F4C5C] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-200/50 hover:text-[#0F4C5C]'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Technician Workstation</span>
                {workerPendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-black animate-pulse">
                    {workerPendingCount}
                  </span>
                )}
              </button>
            )}

            {currentUser?.role === 'admin' ? (
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-[#0F4C5C] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-200/50 hover:text-[#0F4C5C]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Admin Console</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-[#0F4C5C] text-white shadow-xs font-bold'
                    : 'text-stone-500 hover:bg-stone-200/50 hover:text-[#0F4C5C]'
                }`}
                title="Restricted platform administrative portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>Admin Portal</span>
              </button>
            )}
          </nav>

          {/* Right Action: Auth / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-white border border-[#EAE3D2] pl-3 pr-2 py-1.5 rounded-2xl shadow-2xs">
                <div className="text-right">
                  <div className="text-xs font-bold text-stone-800 leading-tight">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#C85A3A]">
                    {currentUser.role}
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                  currentUser.role === 'worker'
                    ? 'bg-amber-100 text-amber-900'
                    : currentUser.role === 'admin'
                    ? 'bg-[#0F4C5C] text-white'
                    : 'bg-teal-100 text-teal-900'
                }`}>
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                </div>

                <button
                  onClick={onSignOut}
                  title="Sign out of account"
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-xl bg-[#0F4C5C] hover:bg-[#134E5E] active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {currentUser && (
              <button
                onClick={() => {
                  if (currentUser.role === 'worker') setCurrentView('worker-dashboard');
                  else if (currentUser.role === 'customer') setCurrentView('directory');
                  else setCurrentView('admin');
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE3D2] text-[11px] font-bold text-[#0F4C5C]"
              >
                {currentUser.role}
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-[#EAE3D2] text-stone-700 hover:text-[#0F4C5C]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EAE3D2] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              setCurrentView('home');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
          >
            Home
          </button>

          <button
            onClick={() => {
              setCurrentView('directory');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
          >
            Find Workers
          </button>

          <button
            onClick={() => {
              setCurrentView('wiki');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
          >
            Techniques Wiki
          </button>

          {currentUser?.role === 'worker' && (
            <button
              onClick={() => {
                setCurrentView('worker-dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-[#C85A3A] bg-amber-50"
            >
              Technician Workstation ({workerPendingCount} requests)
            </button>
          )}

          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => {
                setCurrentView('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-[#0F4C5C] bg-[#0F4C5C]/5 flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Admin Console</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentView('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Admin Portal</span>
            </button>
          )}

          <div className="pt-3 border-t border-stone-200">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-800">{currentUser.displayName || currentUser.email}</div>
                  <div className="text-[10px] text-stone-500 uppercase">{currentUser.role}</div>
                </div>
                <button
                  onClick={() => {
                    onSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#0F4C5C] text-white text-xs font-bold text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
