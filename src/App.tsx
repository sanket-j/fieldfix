/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  auth, 
  db, 
  Worker, 
  Booking, 
  SkillType, 
  UserProfile,
  getUserProfile,
  seedSampleWorkersIfEmpty, 
  SAMPLE_WORKERS 
} from './firebase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkerCard } from './components/WorkerCard';
import { BookingModal } from './components/BookingModal';
import { WikiSection } from './components/WikiSection';
import { WorkerDashboard } from './components/WorkerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { AuthModal } from './components/AuthModal';
import { 
  Search, 
  Filter, 
  MapPin, 
  Wrench, 
  Zap, 
  Droplets, 
  Hammer, 
  Ruler, 
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';

export type AppView = 'home' | 'directory' | 'wiki' | 'worker-dashboard' | 'admin';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<AppView>('home');

  // Firebase Real-time Data
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // User Account Session State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('fieldfix_active_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Search & Filtering State (for Directory)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<'All' | SkillType>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');

  // Booking Modal State
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<Worker | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setCurrentUser(profile);
            localStorage.setItem('fieldfix_active_user', JSON.stringify(profile));
          } else {
            // Check admin email
            const isAdmin = user.email === 'admin@fieldfix.org' || user.email === 'sanketjadhav2503@gmail.com';
            const fallbackProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'FieldFix User',
              role: isAdmin ? 'admin' : 'customer',
              createdAt: Date.now(),
            };
            setCurrentUser(fallbackProfile);
            localStorage.setItem('fieldfix_active_user', JSON.stringify(fallbackProfile));
          }
        } catch (e) {
          console.warn('Error fetching user profile:', e);
        }
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Listen to Firestore workers and bookings in real-time
  useEffect(() => {
    // 1. Initial seed check if empty
    seedSampleWorkersIfEmpty().catch((err) => console.log('Seed check:', err));

    // 2. Real-time workers listener
    const workersCol = collection(db, 'workers');
    const unsubscribeWorkers = onSnapshot(workersCol, (snapshot) => {
      const fetchedWorkers: Worker[] = [];
      snapshot.forEach((doc) => {
        fetchedWorkers.push({ id: doc.id, ...(doc.data() as Omit<Worker, 'id'>) });
      });

      if (fetchedWorkers.length === 0) {
        setWorkers(SAMPLE_WORKERS.map((w, i) => ({ id: `worker-pune-${i + 1}`, ...w })));
      } else {
        setWorkers(fetchedWorkers);
      }
      setIsLoading(false);
    }, (error) => {
      console.warn('Workers snapshot error (using fallback):', error);
      setWorkers(SAMPLE_WORKERS.map((w, i) => ({ id: `worker-pune-${i + 1}`, ...w })));
      setIsLoading(false);
    });

    // 3. Real-time bookings listener
    const bookingsCol = collection(db, 'bookings');
    const bookingsQuery = query(bookingsCol, orderBy('requestedAt', 'desc'));
    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const fetchedBookings: Booking[] = [];
      snapshot.forEach((doc) => {
        fetchedBookings.push({ id: doc.id, ...(doc.data() as Omit<Booking, 'id'>) });
      });
      setBookings(fetchedBookings);
    }, (error) => {
      console.warn('Bookings snapshot error:', error);
    });

    return () => {
      unsubscribeWorkers();
      unsubscribeBookings();
    };
  }, []);

  // Create a map of latest booking per worker ID for fast lookup on worker cards
  const workerLatestBookingMap = useMemo(() => {
    const map: Record<string, Booking> = {};
    for (const b of bookings) {
      if (!map[b.workerId] || b.requestedAt > map[b.workerId].requestedAt) {
        map[b.workerId] = b;
      }
    }
    return map;
  }, [bookings]);

  // Extract unique areas from workers
  const uniqueAreas = useMemo(() => {
    const set = new Set<string>();
    workers.forEach((w) => {
      if (w.area) {
        const mainArea = w.area.split(',')[0].trim();
        set.add(mainArea);
      }
    });
    return Array.from(set).sort();
  }, [workers]);

  // Filtered workers
  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      // Skill filter
      if (selectedSkill !== 'All' && w.skill !== selectedSkill) {
        return false;
      }

      // Area filter
      if (selectedArea !== 'All') {
        const mainArea = w.area.split(',')[0].trim().toLowerCase();
        if (mainArea !== selectedArea.toLowerCase() && !w.area.toLowerCase().includes(selectedArea.toLowerCase())) {
          return false;
        }
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = w.name.toLowerCase().includes(q);
        const matchesShop = w.shop.toLowerCase().includes(q);
        const matchesArea = w.area.toLowerCase().includes(q);
        const matchesAddress = w.address.toLowerCase().includes(q);
        const matchesDesc = w.description.toLowerCase().includes(q);
        const matchesSkill = w.skill.toLowerCase().includes(q);
        return matchesName || matchesShop || matchesArea || matchesAddress || matchesDesc || matchesSkill;
      }

      return true;
    });
  }, [workers, selectedSkill, selectedArea, searchQuery]);

  // Handle successful login or registration
  const handleAuthSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    localStorage.setItem('fieldfix_active_user', JSON.stringify(profile));

    // Send user to correct view based on their role
    if (profile.role === 'worker') {
      setCurrentView('worker-dashboard');
    } else if (profile.role === 'customer') {
      setCurrentView('directory');
    } else if (profile.role === 'admin') {
      setCurrentView('admin');
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem('fieldfix_active_user');
    setCurrentUser(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setCurrentView('home');
  };

  const handleOpenBookingModal = (worker: Worker) => {
    setSelectedWorkerForBooking(worker);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1E292B]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        bookings={bookings}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 1. HOME VIEW */}
        {currentView === 'home' && (
          <>
            <Hero
              onFindWorkersClick={() => {
                setCurrentView('directory');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBrowseWikiClick={() => {
                setCurrentView('wiki');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              workersCount={workers.length}
            />

            {/* Quick Teaser of Directory on Home */}
            <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#EAE3D2]">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C5C]/10 text-[#0F4C5C] text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Featured Local Workers</span>
                  </div>
                  <h2 className="font-serif text-3xl font-extrabold text-[#0F4C5C]">
                    Neighborhood Repair Technicians
                  </h2>
                  <p className="text-stone-600 text-sm mt-1">
                    Direct WhatsApp booking with verified neighborhood repair workshops.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('directory')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F4C5C] hover:bg-[#134E5E] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Explore Full Directory ({workers.length})</span>
                  <ArrowRight className="w-4 h-4 text-[#E07A5F]" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workers.slice(0, 3).map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    activeBooking={workerLatestBookingMap[worker.id]}
                    onBookClick={handleOpenBookingModal}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* 2. FULL WORKERS DIRECTORY VIEW */}
        {currentView === 'directory' && (
          <section id="workers-directory" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
            {/* Directory Header & Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C5C]/10 text-[#0F4C5C] text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Live Pune Directory &bull; Direct WhatsApp Booking</span>
                </div>
                <h2 className="font-serif text-3xl font-extrabold text-[#0F4C5C]">
                  Neighborhood Repair Workers
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Find and book trusted local tradespeople with verified physical shops.
                </p>
              </div>

              {/* Quick Results Summary */}
              <div className="flex items-center gap-3 text-xs font-medium text-stone-500">
                <span>
                  Showing <strong className="text-stone-800">{filteredWorkers.length}</strong> of{' '}
                  <strong className="text-stone-800">{workers.length}</strong> workers
                </span>
                {(selectedSkill !== 'All' || selectedArea !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedSkill('All');
                      setSelectedArea('All');
                      setSearchQuery('');
                    }}
                    className="text-[#C85A3A] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="bg-white rounded-2xl border border-[#EAE3D2] p-4 mb-8 shadow-xs space-y-4">
              {/* Search Bar + Area Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by worker name, shop name, or neighborhood (e.g. Kothrud, Baner, Inverter)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] text-stone-800"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 text-stone-800 font-medium"
                  >
                    <option value="All">All Pune Areas</option>
                    {uniqueAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skill Filter Pills with Color Accents */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  Skill:
                </span>

                <button
                  onClick={() => setSelectedSkill('All')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedSkill === 'All'
                      ? 'bg-[#0F4C5C] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All Skills ({workers.length})
                </button>

                <button
                  onClick={() => setSelectedSkill('Electrical')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedSkill === 'Electrical'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Electrical</span>
                </button>

                <button
                  onClick={() => setSelectedSkill('Plumbing')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedSkill === 'Plumbing'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5 text-teal-600" />
                  <span>Plumbing</span>
                </button>

                <button
                  onClick={() => setSelectedSkill('Masonry')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedSkill === 'Masonry'
                      ? 'bg-[#C85A3A] text-white shadow-sm'
                      : 'bg-[#FDF2ED] text-[#B84A28] border border-[#E07A5F]/30 hover:bg-[#FBE8DE]'
                  }`}
                >
                  <Hammer className="w-3.5 h-3.5 text-[#B84A28]" />
                  <span>Masonry</span>
                </button>

                <button
                  onClick={() => setSelectedSkill('Carpentry')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedSkill === 'Carpentry'
                      ? 'bg-[#5C3D2E] text-white shadow-sm'
                      : 'bg-[#F5EBE1] text-[#633516] border border-[#D5B99B] hover:bg-[#EBDCCF]'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5 text-[#633516]" />
                  <span>Carpentry</span>
                </button>
              </div>
            </div>

            {/* Workers Grid */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#0F4C5C] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-stone-500 font-medium">
                  Loading verified neighborhood workers...
                </p>
              </div>
            ) : filteredWorkers.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EAE3D2] p-12 text-center max-w-lg mx-auto shadow-xs">
                <Wrench className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-stone-800">
                  No Workers Found
                </h3>
                <p className="text-xs text-stone-500 mt-1 mb-4">
                  No craftspeople matched your selected skill or area query.
                </p>
                <button
                  onClick={() => {
                    setSelectedSkill('All');
                    setSelectedArea('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0F4C5C] text-white text-xs font-semibold hover:bg-[#134E5E] transition-colors"
                >
                  View All Workers
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    activeBooking={workerLatestBookingMap[worker.id]}
                    onBookClick={handleOpenBookingModal}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* 3. TECHNIQUES WIKI VIEW */}
        {currentView === 'wiki' && (
          <div className="animate-in fade-in">
            <WikiSection />
          </div>
        )}

        {/* 4. WORKER DASHBOARD VIEW */}
        {currentView === 'worker-dashboard' && currentUser && (
          <WorkerDashboard
            currentUser={currentUser}
            workers={workers}
            bookings={bookings}
          />
        )}

        {/* 5. ADMIN SECTION VIEW */}
        {currentView === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminPanel
              currentUser={currentUser}
              workers={workers}
              bookings={bookings}
              onSignOut={handleSignOut}
            />
          ) : (
            <AdminLogin
              currentUser={currentUser}
              onAdminAuthenticated={(profile) => {
                setCurrentUser(profile);
                setCurrentView('admin');
              }}
              onBack={() => setCurrentView('directory')}
            />
          )
        )}
      </main>

      {/* Booking WhatsApp Modal */}
      <BookingModal
        worker={selectedWorkerForBooking}
        currentUser={currentUser}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedWorkerForBooking(null);
        }}
        onBookingSuccess={(bookingId) => {
          try {
            const existing = JSON.parse(localStorage.getItem('fieldfix_recent_bookings') || '[]');
            localStorage.setItem('fieldfix_recent_bookings', JSON.stringify([bookingId, ...existing.filter((id: string) => id !== bookingId)]));
          } catch {}
        }}
        onRequestSignIn={() => {
          setIsBookingModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Auth Modal (Sign Up / Sign In with Role Choice) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onOpenAdmin={() => {
          setIsAuthModalOpen(false);
          setCurrentView('admin');
        }}
      />

      {/* Footer */}
      <footer className="mt-16 bg-[#0F4C5C] text-stone-300 border-t border-[#092C36] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E07A5F]">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white tracking-tight">
                  FieldFix
                </span>
                <p className="text-xs text-teal-200">
                  Community-powered repairs & vernacular engineering archive
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-stone-300">
              <button 
                onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => { setCurrentView('directory'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                Workers Directory
              </button>
              <button 
                onClick={() => { setCurrentView('wiki'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                Techniques Wiki
              </button>
              {currentUser?.role === 'worker' && (
                <button 
                  onClick={() => { setCurrentView('worker-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Technician Workstation
                </button>
              )}
              <button 
                onClick={() => { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                {currentUser?.role === 'admin' ? 'Admin Console' : 'Admin Portal'}
              </button>
            </div>

            <div className="text-xs text-stone-400 text-center md:text-right">
              <p>Pune Neighborhood Network &bull; Grounded in Traditional Craft</p>
              <p className="text-[11px] text-teal-300/80 mt-0.5">Real-time sync via Google Cloud Firestore</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
