import React, { useState, useEffect } from 'react';
import { 
  Worker, 
  Booking, 
  BookingStatus, 
  SkillType, 
  UserProfile,
  db 
} from '../firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc 
} from 'firebase/firestore';
import { 
  Wrench, 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  FileText, 
  MessageCircle, 
  Save, 
  Eye, 
  Edit3, 
  ExternalLink,
  Sparkles,
  Zap,
  Droplets,
  Hammer,
  Ruler
} from 'lucide-react';
import { WorkerCard } from './WorkerCard';

interface WorkerDashboardProps {
  currentUser: UserProfile;
  workers: Worker[];
  bookings: Booking[];
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  currentUser,
  workers,
  bookings,
}) => {
  // Find worker listing associated with this user
  const existingWorker = workers.find((w) => w.userId === currentUser.uid);

  // Tab: 'requests' | 'profile'
  const [activeTab, setActiveTab] = useState<'requests' | 'profile'>(
    existingWorker ? 'requests' : 'profile'
  );

  // Form State
  const [profileForm, setProfileForm] = useState<{
    name: string;
    shop: string;
    skill: SkillType;
    area: string;
    address: string;
    phone: string;
    maps: string;
    description: string;
  }>({
    name: existingWorker?.name || currentUser.displayName || '',
    shop: existingWorker?.shop || '',
    skill: existingWorker?.skill || 'Plumbing',
    area: existingWorker?.area || '',
    address: existingWorker?.address || '',
    phone: existingWorker?.phone || '',
    maps: existingWorker?.maps || '',
    description: existingWorker?.description || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Sync profile form if existingWorker updates
  useEffect(() => {
    if (existingWorker) {
      setProfileForm({
        name: existingWorker.name,
        shop: existingWorker.shop,
        skill: existingWorker.skill,
        area: existingWorker.area,
        address: existingWorker.address,
        phone: existingWorker.phone,
        maps: existingWorker.maps,
        description: existingWorker.description,
      });
    }
  }, [existingWorker]);

  // Filter bookings sent to this worker
  const myBookings = bookings.filter((b) => {
    if (b.workerUserId && b.workerUserId === currentUser.uid) return true;
    if (existingWorker && b.workerId === existingWorker.id) return true;
    return false;
  });

  // Filter by status
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const filteredBookings = myBookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.shop || !profileForm.area || !profileForm.phone) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(null);

    try {
      let formattedMaps = profileForm.maps.trim();
      if (!formattedMaps) {
        formattedMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${profileForm.shop} ${profileForm.area} Pune`
        )}`;
      }

      if (existingWorker) {
        // Update existing worker document
        await updateDoc(doc(db, 'workers', existingWorker.id), {
          ...profileForm,
          maps: formattedMaps,
          userId: currentUser.uid,
          updatedAt: Date.now(),
        });
        setSaveSuccess('Your worker profile has been updated!');
      } else {
        // Create new worker document
        const newDocId = `worker-${currentUser.uid}`;
        await setDoc(doc(db, 'workers', newDocId), {
          ...profileForm,
          maps: formattedMaps,
          userId: currentUser.uid,
          createdAt: Date.now(),
        });
        setSaveSuccess('Your public worker listing is live in the directory!');
      }

      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err: any) {
      console.error('Error saving worker profile:', err);
      alert('Failed to save profile: ' + (err.message || 'Check connection'));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Accept / Reject
  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus,
        updatedAt: Date.now(),
      });
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Failed to update request: ' + (err.message || 'Check connection'));
    }
  };

  // Preview Worker Object
  const previewWorker: Worker = {
    id: existingWorker?.id || 'preview',
    userId: currentUser.uid,
    name: profileForm.name || 'Your Full Name',
    shop: profileForm.shop || 'Your Workshop Name',
    skill: profileForm.skill,
    area: profileForm.area || 'Neighborhood (e.g. Kothrud, Pune)',
    address: profileForm.address || 'Physical Workshop Address',
    phone: profileForm.phone || '+91 98000 00000',
    maps: profileForm.maps || 'https://maps.google.com',
    description: profileForm.description || 'Describe your expertise, experience, and repair specialties.',
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#EAE3D2] p-6 mb-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 text-[#C85A3A] flex items-center justify-center shadow-2xs">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                Technician Workstation
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Verified Worker
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Welcome back, <strong className="text-stone-800">{existingWorker?.name || currentUser.displayName || 'Tradesperson'}</strong> &bull; {existingWorker ? existingWorker.shop : 'Unpublished Listing'}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {existingWorker ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Listing Active in Directory</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Profile Setup Required</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs: My Requests vs My Profile */}
      <div className="flex items-center gap-3 mb-6 border-b border-[#EAE3D2] pb-4">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-2.5 rounded-xl font-serif text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'bg-[#0F4C5C] text-white shadow-sm'
              : 'bg-white border border-[#EAE3D2] text-stone-600 hover:text-[#0F4C5C]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#E07A5F]" />
          <span>My Job Requests</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
          }`}>
            {myBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-xl font-serif text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#0F4C5C] text-white shadow-sm'
              : 'bg-white border border-[#EAE3D2] text-stone-600 hover:text-[#0F4C5C]'
          }`}
        >
          <Edit3 className="w-4 h-4 text-[#E07A5F]" />
          <span>My Public Listing</span>
          {!existingWorker && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: MY JOB REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EAE3D2]">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-stone-500 mr-1">Filter by status:</span>
              {(['all', 'pending', 'accepted', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`capitalize px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === st
                      ? 'bg-[#0F4C5C] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {st} {st !== 'all' ? `(${myBookings.filter((b) => b.status === st).length})` : `(${myBookings.length})`}
                </button>
              ))}
            </div>

            <p className="text-xs text-stone-500">
              Showing {filteredBookings.length} of {myBookings.length} customer inquiries
            </p>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EAE3D2] p-12 text-center max-w-lg mx-auto shadow-xs">
              <Clock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-stone-800">
                No Job Requests in this View
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                When customers find your shop in the directory and click "Book on WhatsApp", their requests will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBookings.map((b) => {
                const dateStr = new Date(b.requestedAt).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });

                const rawCustomerPhone = (b.customerPhone || '').replace(/[^0-9]/g, '');
                const cleanWaPhone = rawCustomerPhone.length === 10 ? `91${rawCustomerPhone}` : rawCustomerPhone;
                
                const acceptWaUrl = cleanWaPhone
                  ? `https://wa.me/${cleanWaPhone}?text=${encodeURIComponent(
                      `Hello ${b.customerName || 'Client'},\nI ACCEPT your FieldFix service request for ${b.skill} repair! 🛠️\nI am available to inspect the job. Please let me know your preferred time and address.`
                    )}`
                  : null;

                const rejectWaUrl = cleanWaPhone
                  ? `https://wa.me/${cleanWaPhone}?text=${encodeURIComponent(
                      `Hello ${b.customerName || 'Client'},\nThank you for reaching out via FieldFix. Unfortunately I have to DECLINE this request as I am currently fully booked / outside my service range today. Wishing you a quick resolution!`
                    )}`
                  : null;

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-[#EAE3D2] p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top status */}
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
                          {b.status === 'pending' && <Clock className="w-3 h-3 text-amber-700 animate-pulse" />}
                          {b.status === 'accepted' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                          {b.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-700" />}
                          <span>{b.status}</span>
                        </span>

                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateStr}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <h4 className="font-serif text-base font-bold text-stone-900">
                        {b.customerName || 'Neighborhood Resident'}
                      </h4>
                      {b.customerPhone && (
                        <div className="flex items-center gap-1 text-xs text-stone-600 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-700" />
                          <span className="font-mono">{b.customerPhone}</span>
                        </div>
                      )}

                      {/* Client Request Details */}
                      {b.notes && (
                        <div className="mt-3 p-3 bg-[#FBF9F5] rounded-xl border border-[#EAE3D2] text-xs text-stone-700 leading-relaxed">
                          <span className="font-semibold text-stone-500 block text-[10px] uppercase tracking-wider mb-0.5">
                            Client Work Request
                          </span>
                          "{b.notes}"
                        </div>
                      )}
                    </div>

                    {/* Actions: Accept or Reject Directly + WhatsApp Quick Replies */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            handleUpdateStatus(b.id, 'accepted');
                            if (acceptWaUrl) window.open(acceptWaUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept & WhatsApp</span>
                        </button>

                        <button
                          onClick={() => {
                            handleUpdateStatus(b.id, 'rejected');
                            if (rejectWaUrl) window.open(rejectWaUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-rose-200"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline & WhatsApp</span>
                        </button>
                      </div>

                      {cleanWaPhone && (
                        <a
                          href={`https://wa.me/${cleanWaPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-1.5 px-3 rounded-xl bg-[#25D366]/10 text-emerald-800 hover:bg-[#25D366]/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Direct Chat on WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY PUBLIC LISTING & PROFILE */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Edit Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#EAE3D2] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-xl font-bold text-[#0F4C5C] flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#E07A5F]" />
                  <span>Your Listing Details</span>
                </h3>
                {existingWorker && (
                  <span className="text-[11px] text-stone-500 font-medium">
                    ID: {existingWorker.id}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mb-6">
                Fill in your workshop details so local residents can find and contact you directly.
              </p>

              {saveSuccess && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Shinde"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Workshop / Shop Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shinde Electricals & Motor Works"
                      value={profileForm.shop}
                      onChange={(e) => setProfileForm({ ...profileForm, shop: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 text-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Primary Skill *
                    </label>
                    <select
                      value={profileForm.skill}
                      onChange={(e) => setProfileForm({ ...profileForm, skill: e.target.value as SkillType })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 font-semibold text-stone-800"
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Masonry">Masonry</option>
                      <option value="Carpentry">Carpentry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Neighborhood / Area *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kothrud, Pune"
                      value={profileForm.area}
                      onChange={(e) => setProfileForm({ ...profileForm, area: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Complete Physical Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shop No. 4, Near Karve Statue, Karve Road, Kothrud, Pune - 411038"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 text-stone-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98220 14852"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Google Maps Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://maps.google.com/..."
                      value={profileForm.maps}
                      onChange={(e) => setProfileForm({ ...profileForm, maps: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Short Bio & Experience Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention years of experience, specialized tools, residential vs commercial work, etc."
                    value={profileForm.description}
                    onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 text-stone-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl bg-[#0F4C5C] hover:bg-[#134E5E] active:scale-[0.99] text-white font-bold transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-[#E07A5F]" />
                  <span>{isSaving ? 'Publishing Changes...' : existingWorker ? 'Save & Update Listing' : 'Publish My Worker Listing'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#0F4C5C]" />
                Live Card Preview (Customer View)
              </span>
              <span className="text-[11px] text-stone-400">Updates live as you type</span>
            </div>

            <WorkerCard
              worker={previewWorker}
              onBookClick={() => {
                alert('This is a preview of your card. Customers will see this in the public directory.');
              }}
            />

            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D2] text-xs text-stone-600 space-y-1.5">
              <div className="font-semibold text-[#0F4C5C]">Why FieldFix?</div>
              <p className="text-[11px] leading-relaxed">
                FieldFix connects verified neighborhood repair specialists directly with local residents. Customers message you directly on WhatsApp — no middleman commissions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
