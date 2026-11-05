import React, { useState } from 'react';
import { 
  Worker, 
  Booking, 
  BookingStatus, 
  UserProfile, 
  db, 
  seedSampleWorkersIfEmpty 
} from '../firebase';
import { 
  collection, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  ShieldCheck, 
  LogOut, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Phone, 
  MapPin, 
  Building2, 
  Wrench, 
  Search, 
  RotateCcw,
  Sparkles,
  Users,
  AlertTriangle
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: UserProfile;
  workers: Worker[];
  bookings: Booking[];
  onSignOut: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  workers,
  bookings,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'workers' | 'bookings'>('workers');
  const [workerSearch, setWorkerSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | BookingStatus>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'worker' | 'booking'; id: string; name?: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Delete worker listing (e.g. spam or incorrect info)
  const executeDeleteWorker = async (workerId: string) => {
    try {
      await deleteDoc(doc(db, 'workers', workerId));
      showToast('success', 'Worker listing successfully removed from directory.');
    } catch (err: any) {
      console.error('Error deleting worker:', err);
      showToast('error', 'Failed to delete worker: ' + (err.message || 'Check permissions'));
    } finally {
      setConfirmDelete(null);
    }
  };

  // Delete booking record (e.g. spam)
  const executeDeleteBooking = async (bookingId: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      showToast('success', 'Booking record removed from platform archives.');
    } catch (err: any) {
      console.error('Error deleting booking:', err);
      showToast('error', 'Failed to delete booking: ' + (err.message || 'Check permissions'));
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleSeedData = async () => {
    try {
      const seeded = await seedSampleWorkersIfEmpty();
      if (seeded) {
        showToast('success', 'Sample Pune workers seeded successfully.');
      } else {
        showToast('success', 'Directory already contains worker listings.');
      }
    } catch (err: any) {
      showToast('error', 'Could not seed data: ' + (err.message || String(err)));
    }
  };

  // Filtered workers
  const filteredWorkers = workers.filter((w) => {
    const q = workerSearch.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.shop.toLowerCase().includes(q) ||
      w.skill.toLowerCase().includes(q) ||
      w.area.toLowerCase().includes(q)
    );
  });

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter === 'all') return true;
    return b.status === bookingStatusFilter;
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#EAE3D2] p-6 mb-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0F4C5C] text-white flex items-center justify-center shadow-2xs">
            <ShieldCheck className="w-6 h-6 text-[#E07A5F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                Platform Oversight Console
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                System Admin
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Signed in as: <strong className="text-stone-800">{currentUser.email || currentUser.displayName || 'Administrator'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleSeedData}
            title="Seed initial Pune sample workers"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Seed Sample Workers</span>
          </button>

          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D2] shadow-2xs">
          <div className="text-stone-500 text-xs font-medium mb-1 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#0F4C5C]" />
            <span>Total Workers</span>
          </div>
          <div className="font-serif text-2xl font-bold text-[#0F4C5C]">{workers.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D2] shadow-2xs">
          <div className="text-stone-500 text-xs font-medium mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Total Bookings</span>
          </div>
          <div className="font-serif text-2xl font-bold text-amber-700">{bookings.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D2] shadow-2xs">
          <div className="text-stone-500 text-xs font-medium mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accepted Jobs</span>
          </div>
          <div className="font-serif text-2xl font-bold text-emerald-700">
            {bookings.filter((b) => b.status === 'accepted').length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D2] shadow-2xs">
          <div className="text-stone-500 text-xs font-medium mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Pending Inquiries</span>
          </div>
          <div className="font-serif text-2xl font-bold text-[#C85A3A]">
            {bookings.filter((b) => b.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6 border-b border-[#EAE3D2] pb-4">
        <button
          onClick={() => setActiveTab('workers')}
          className={`px-5 py-2.5 rounded-xl font-serif text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'workers'
              ? 'bg-[#0F4C5C] text-white shadow-sm'
              : 'bg-white border border-[#EAE3D2] text-stone-600 hover:text-[#0F4C5C]'
          }`}
        >
          <Wrench className="w-4 h-4 text-[#E07A5F]" />
          <span>All Worker Listings</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeTab === 'workers' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
          }`}>
            {workers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-xl font-serif text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'bg-[#0F4C5C] text-white shadow-sm'
              : 'bg-white border border-[#EAE3D2] text-stone-600 hover:text-[#0F4C5C]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#E07A5F]" />
          <span>Platform Booking Activity</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
          }`}>
            {bookings.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ALL WORKER LISTINGS */}
      {activeTab === 'workers' && (
        <div className="bg-white rounded-3xl border border-[#EAE3D2] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0F4C5C]">
                Platform Directory Registry
              </h3>
              <p className="text-xs text-stone-500">
                Technicians manage their own listings. Administrators can audit and remove spam listings.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search worker by name or area..."
                value={workerSearch}
                onChange={(e) => setWorkerSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 text-stone-800"
              />
            </div>
          </div>

          {filteredWorkers.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              No workers found matching your search.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredWorkers.map((w) => (
                <div
                  key={w.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/70 p-3 rounded-xl transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        {w.name}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        w.skill === 'Electrical'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : w.skill === 'Plumbing'
                          ? 'bg-teal-100 text-teal-900 border-teal-300'
                          : w.skill === 'Masonry'
                          ? 'bg-orange-100 text-orange-900 border-orange-300'
                          : 'bg-stone-200 text-stone-900 border-stone-300'
                      }`}>
                        {w.skill}
                      </span>
                      {w.userId && (
                        <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                          Self-Managed
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-600 flex items-center gap-2">
                      <span className="font-semibold text-[#C85A3A]">{w.shop}</span>
                      <span>&bull;</span>
                      <span>{w.area}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                      {w.address} | {w.phone}
                    </div>
                  </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setConfirmDelete({ type: 'worker', id: w.id, name: w.name })}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Remove Listing (Spam or Outdated)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Listing</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL BOOKINGS ACTIVITY */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EAE3D2]">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-stone-500 mr-1">Filter by status:</span>
                {(['all', 'pending', 'accepted', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingStatusFilter(st)}
                    className={`capitalize px-3 py-1.5 rounded-lg transition-all ${
                      bookingStatusFilter === st
                        ? 'bg-[#0F4C5C] text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {st} {st !== 'all' ? `(${bookings.filter((b) => b.status === st).length})` : `(${bookings.length})`}
                  </button>
                ))}
              </div>

              <p className="text-xs text-stone-500">
                Showing {filteredBookings.length} platform booking records
              </p>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EAE3D2] p-12 text-center max-w-lg mx-auto shadow-xs">
                <Clock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-stone-800">
                  No Bookings in this Filter
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBookings.map((b) => {
                  const dateStr = new Date(b.requestedAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-[#EAE3D2] p-5 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                              b.status === 'pending'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : b.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {b.status === 'pending' && <Clock className="w-3 h-3 text-amber-700" />}
                            {b.status === 'accepted' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                            {b.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-700" />}
                            <span>{b.status}</span>
                          </span>

                          <span className="text-[11px] text-stone-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {dateStr}
                          </span>
                        </div>

                        <h4 className="font-serif text-base font-bold text-[#0F4C5C]">
                          {b.workerName}
                        </h4>
                        <p className="text-xs font-semibold text-[#C85A3A] mb-2">
                          {b.skill} Service
                        </p>

                        <div className="bg-[#FBF9F5] p-3 rounded-xl border border-[#EAE3D2] text-xs space-y-1 mb-3">
                          <div className="flex items-center justify-between text-stone-700">
                            <span className="font-semibold">{b.customerName || 'Resident'}</span>
                            {b.customerPhone && (
                              <span className="font-mono text-stone-500">{b.customerPhone}</span>
                            )}
                          </div>
                          {b.notes && (
                            <p className="text-stone-600 text-[11px] italic line-clamp-2">
                              "{b.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span>Managed directly by worker</span>
                        <button
                          onClick={() => setConfirmDelete({ type: 'booking', id: b.id, name: `${b.workerName} request` })}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      {/* Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EAE3D2] shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              Confirm Removal
            </h3>
            <p className="text-xs text-stone-600 mb-5">
              Are you sure you want to remove {confirmDelete.name ? `"${confirmDelete.name}"` : 'this record'} from the platform? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmDelete.type === 'worker') {
                    executeDeleteWorker(confirmDelete.id);
                  } else {
                    executeDeleteBooking(confirmDelete.id);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
          <div className={`px-4 py-3 rounded-2xl shadow-lg border text-xs font-semibold flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
