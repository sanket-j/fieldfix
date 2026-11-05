import React from 'react';
import { 
  Zap, 
  Droplets, 
  Hammer, 
  Ruler, 
  MapPin, 
  Phone, 
  ExternalLink, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Building2
} from 'lucide-react';
import { Worker, Booking, SkillType } from '../firebase';

interface WorkerCardProps {
  worker: Worker;
  activeBooking?: Booking;
  onBookClick: (worker: Worker) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  activeBooking,
  onBookClick,
}) => {
  // Skill configuration (Color-code each worker card by skill: amber for Electrical, teal for Plumbing, terracotta for Masonry, brown for Carpentry)
  const getSkillConfig = (skill: SkillType) => {
    switch (skill) {
      case 'Electrical':
        return {
          colorName: 'Amber',
          badgeClass: 'bg-amber-100/90 text-amber-900 border-amber-300 font-semibold',
          accentBorder: 'hover:border-amber-400',
          topBar: 'bg-gradient-to-r from-amber-400 to-amber-500',
          icon: <Zap className="w-3.5 h-3.5 text-amber-700" />,
          lightBg: 'bg-amber-500/5',
        };
      case 'Plumbing':
        return {
          colorName: 'Teal',
          badgeClass: 'bg-teal-100/90 text-teal-900 border-teal-300 font-semibold',
          accentBorder: 'hover:border-teal-400',
          topBar: 'bg-gradient-to-r from-teal-500 to-[#0F4C5C]',
          icon: <Droplets className="w-3.5 h-3.5 text-teal-700" />,
          lightBg: 'bg-teal-500/5',
        };
      case 'Masonry':
        return {
          colorName: 'Terracotta',
          badgeClass: 'bg-[#FDF2ED] text-[#B84A28] border-[#E07A5F]/40 font-semibold',
          accentBorder: 'hover:border-[#E07A5F]',
          topBar: 'bg-gradient-to-r from-[#E07A5F] to-[#C85A3A]',
          icon: <Hammer className="w-3.5 h-3.5 text-[#B84A28]" />,
          lightBg: 'bg-[#E07A5F]/5',
        };
      case 'Carpentry':
        return {
          colorName: 'Brown',
          badgeClass: 'bg-[#F5EBE1] text-[#633516] border-[#D5B99B] font-semibold',
          accentBorder: 'hover:border-[#8B5E3C]',
          topBar: 'bg-gradient-to-r from-[#8B5E3C] to-[#5C3D2E]',
          icon: <Ruler className="w-3.5 h-3.5 text-[#633516]" />,
          lightBg: 'bg-[#8B5E3C]/5',
        };
      default:
        return {
          colorName: 'Teal',
          badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
          accentBorder: 'hover:border-stone-400',
          topBar: 'bg-stone-400',
          icon: <Hammer className="w-3.5 h-3.5" />,
          lightBg: 'bg-stone-50',
        };
    }
  };

  const config = getSkillConfig(worker.skill);

  // Status badge config
  const renderStatusBadge = () => {
    if (!activeBooking) return null;

    if (activeBooking.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Pending Request</span>
        </span>
      );
    }
    if (activeBooking.status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Booking Accepted</span>
        </span>
      );
    }
    if (activeBooking.status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Unavailable</span>
        </span>
      );
    }
    return null;
  };

  return (
    <div className={`relative bg-white rounded-2xl border border-[#EAE3D2] shadow-sm transition-all duration-200 hover:shadow-md ${config.accentBorder} flex flex-col justify-between overflow-hidden group`}>
      {/* Skill color indicator top bar */}
      <div className={`h-1.5 w-full ${config.topBar}`} />

      <div className="p-6 flex-1 flex flex-col">
        {/* Header with Skill & Booking Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${config.badgeClass}`}>
            {config.icon}
            <span>{worker.skill}</span>
          </span>

          {renderStatusBadge()}
        </div>

        {/* Worker Name & Shop */}
        <div className="mb-3">
          <h3 className="font-serif text-xl font-bold text-[#0F4C5C] group-hover:text-[#092C36] transition-colors">
            {worker.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mt-0.5">
            <Building2 className="w-3.5 h-3.5 text-[#C85A3A]" />
            <span className="truncate">{worker.shop}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 mb-4 flex-1">
          {worker.description}
        </p>

        {/* Details: Area, Address, Phone */}
        <div className="space-y-2 py-3 border-t border-[#F0EBE0] text-xs text-stone-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#0F4C5C] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-stone-800">{worker.area}</span>
              <p className="text-stone-500 text-[11px] leading-tight mt-0.5">{worker.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
            <a 
              href={`tel:${worker.phone.replace(/\s+/g, '')}`} 
              className="text-stone-700 hover:text-[#0F4C5C] font-mono font-medium hover:underline"
            >
              {worker.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-[#FBF9F5] border-t border-[#EAE3D2] flex items-center gap-2.5">
        {/* Google Maps Link */}
        <a
          href={worker.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-2.5 rounded-xl border border-[#D5CCB6] text-stone-700 hover:text-[#0F4C5C] hover:bg-white active:scale-95 transition-all text-xs font-medium"
          title="Open Location on Google Maps"
        >
          <MapPin className="w-4 h-4 text-[#C85A3A]" />
          <span className="ml-1.5 hidden sm:inline">Maps</span>
          <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
        </a>

        {/* WhatsApp Booking Button */}
        <button
          onClick={() => onBookClick(worker)}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-sm hover:shadow active:scale-[0.98] transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Book on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
