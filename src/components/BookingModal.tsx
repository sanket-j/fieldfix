import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  MessageCircle, 
  User, 
  Phone, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Send,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Worker, BookingStatus, UserProfile, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface BookingModalProps {
  worker: Worker | null;
  currentUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (bookingId: string) => void;
  onRequestSignIn?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  worker,
  currentUser,
  isOpen,
  onClose,
  onBookingSuccess,
  onRequestSignIn,
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedBookingId, setSavedBookingId] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Sync if currentUser changes
  useEffect(() => {
    if (currentUser?.displayName && !customerName) {
      setCustomerName(currentUser.displayName);
    }
  }, [currentUser]);

  // Clean phone number for WhatsApp international format (wa.me)
  const cleanWorkerPhone = useMemo(() => {
    if (!worker?.phone) return '';
    let digits = worker.phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('0') && digits.length === 11) {
      digits = digits.substring(1);
    }
    // Default to India country code 91 if 10 digits
    if (digits.length === 10) {
      return `91${digits}`;
    }
    return digits;
  }, [worker?.phone]);

  // Generate clean pre-filled WhatsApp message draft ONLY describing the work of client
  const whatsappDraftText = useMemo(() => {
    if (!worker) return '';
    const nameStr = customerName.trim() || (currentUser?.displayName || 'Pune Resident');
    const contactStr = customerPhone.trim() || 'Will share directly in chat';
    const descStr = issueDescription.trim() || 'Requesting service inspection & repair work';

    return `*FieldFix Service Request* 🛠️\n\nHello ${worker.name},\nI found your listing for *${worker.shop}* on the FieldFix Pune community repair directory.\n\n📋 *JOB REQUEST DETAILS:*\n• *Service Category:* ${worker.skill} Repair & Maintenance\n• *Neighborhood / Area:* ${worker.area}\n• *Client Name:* ${nameStr}\n• *Client Contact Phone:* ${contactStr}\n\n📝 *Client Work Description:*\n"${descStr}"\n\nPlease let me know your availability and estimated visit charges for this work.\n\nThank you,\n${nameStr}`;
  }, [worker, customerName, currentUser, customerPhone, issueDescription]);

  // Direct WhatsApp Web / App link URL
  const whatsappDirectUrl = useMemo(() => {
    if (!cleanWorkerPhone) return '#';
    return `https://wa.me/${cleanWorkerPhone}?text=${encodeURIComponent(whatsappDraftText)}`;
  }, [cleanWorkerPhone, whatsappDraftText]);

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(whatsappDraftText);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      // Fallback
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;
    setIsSubmitting(true);

    try {
      const defaultDesc = issueDescription.trim() || 'Requesting service inspection & repair work';
      const nameStr = customerName.trim() || (currentUser?.displayName || 'Pune Resident');

      // 1. Save booking in Firestore with status "pending"
      const docRef = await addDoc(collection(db, 'bookings'), {
        workerId: worker.id,
        workerUserId: worker.userId || '',
        workerName: worker.name,
        skill: worker.skill,
        status: 'pending' as BookingStatus,
        requestedAt: Date.now(),
        customerId: currentUser?.uid || null,
        customerName: nameStr,
        customerPhone: customerPhone.trim(),
        notes: defaultDesc,
        whatsappDraft: whatsappDraftText,
      });

      setSavedBookingId(docRef.id);
      onBookingSuccess(docRef.id);

      // 2. Open WhatsApp in a new tab with the pre-filled message
      if (cleanWorkerPhone) {
        window.open(whatsappDirectUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error creating booking request:', error);
      // Fallback: still open WhatsApp even if DB write has transient network issue
      if (cleanWorkerPhone) {
        window.open(whatsappDirectUrl, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCustomerPhone('');
    setIssueDescription('');
    setSavedBookingId(null);
    setHasCopied(false);
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !worker) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={handleModalClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#EAE3D2] overflow-hidden transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-[#0F4C5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#25D366]">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold leading-tight">
                Request Service & WhatsApp
              </h3>
              <p className="text-xs text-teal-100/90 flex items-center gap-1.5 mt-0.5">
                <span>{worker.name}</span>
                <span className="opacity-40">•</span>
                <span className="text-[#E07A5F] font-semibold">{worker.skill}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Confirmation Screen (if already submitted) */}
        {savedBookingId ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-serif text-xl font-bold text-stone-900">
                Service Request Recorded!
              </h4>
              <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                Your repair request for <strong className="text-stone-900">{worker.name}</strong> ({worker.shop}) has been logged in the community database.
              </p>
            </div>

            {/* Direct WhatsApp Link CTA */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Direct WhatsApp Link</span>
                  <p className="text-xs text-emerald-950 font-medium mt-0.5">
                    Click below to open the chat with {worker.name} ({worker.phone}):
                  </p>
                </div>
                <span className="text-xs bg-[#25D366] text-white px-2 py-0.5 rounded-full font-bold shrink-0">
                  Ready
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-center"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Open WhatsApp Chat Now</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center">
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-[#0F4C5C] hover:bg-[#134E5E] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Done / Back to Directory
              </button>
            </div>
          </div>
        ) : (
          /* Booking & WhatsApp Form */
          <form onSubmit={handleBookingSubmit} className="p-5 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
            {/* Top Info Banner */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[12px] leading-relaxed">
                Describe your repair work below to automatically prepare a tailored WhatsApp message directly for <span className="font-semibold text-stone-900">{worker.name} ({worker.phone})</span>.
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Patil / Sunita Mehta"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] text-stone-900"
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                Your Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98220 12345"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] text-stone-900 font-mono"
              />
            </div>

            {/* Problem / Work Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-400" />
                Work / Problem Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder={`Describe the work you need (e.g., "${worker.skill === 'Electrical' ? 'Short circuit in main board, lights flickering in kitchen' : worker.skill === 'Plumbing' ? 'Water dripping from bathroom ceiling pipe union' : 'Precision repair work needed'}")`}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] text-stone-900"
              />
            </div>

            {/* Pre-filled WhatsApp Draft Preview & Direct Link Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Pre-filled WhatsApp Request</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white px-2 py-0.5 rounded-md border border-emerald-200 transition-colors"
                  title="Copy draft to clipboard"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-emerald-600" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Message Box */}
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-[11px] text-stone-700 font-mono whitespace-pre-wrap max-h-28 overflow-y-auto select-all leading-relaxed shadow-2xs">
                {whatsappDraftText}
              </div>

              {/* DIRECT LINK BUTTON: Open WhatsApp immediately */}
              <div className="pt-1 flex items-center justify-between gap-2">
                <span className="text-[10px] text-stone-500">
                  Direct number: <span className="font-semibold text-stone-700">{worker.phone}</span>
                </span>

                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Open Direct Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              {/* Primary Action: Save to database & open WhatsApp */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Recording Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send & Save Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
