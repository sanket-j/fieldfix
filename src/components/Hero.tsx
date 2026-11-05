import React from 'react';
import { Search, BookOpen, MessageSquare, ShieldCheck, ArrowRight, Sparkles, MapPin } from 'lucide-react';

interface HeroProps {
  onFindWorkersClick: () => void;
  onBrowseWikiClick: () => void;
  workersCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onFindWorkersClick,
  onBrowseWikiClick,
  workersCount,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-[#EAE3D2] bg-gradient-to-b from-[#F4EFE6]/70 via-[#FBF9F5] to-[#FBF9F5]">
      {/* Decorative background grid subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#0F4C5C 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E07A5F]/10 border border-[#E07A5F]/20 text-[#C85A3A] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pune Grassroots Repair & Traditional Engineering</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F4C5C] leading-[1.15]">
            Local Hands. <br className="hidden sm:inline" />
            <span className="text-[#C85A3A] italic font-serif">Timeless Wisdom.</span> <br />
            Reliable Home Repairs.
          </h1>

          {/* Short description */}
          <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-2xl mx-auto">
            FieldFix connects Pune residents directly with trusted neighborhood electricians, plumbers, masons, and carpenters, while archiving traditional low-cost engineering practices for resilient communities.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onFindWorkersClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#0F4C5C] text-white font-semibold text-sm hover:bg-[#134E5E] active:scale-[0.98] transition-all shadow-md shadow-[#0F4C5C]/15"
            >
              <Search className="w-4 h-4 text-[#E07A5F]" />
              <span>Find Workers ({workersCount} Verified)</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
            </button>

            <button
              onClick={onBrowseWikiClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-[#D5CCB6] text-[#0F4C5C] font-semibold text-sm hover:bg-[#F4EFE6] active:scale-[0.98] transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-[#E07A5F]" />
              <span>Browse the Wiki</span>
            </button>
          </div>
        </div>

        {/* 3-Step Feature Overview */}
        <div className="mt-14 sm:mt-18">
          <div className="text-center mb-8">
            <h2 className="text-xs uppercase tracking-widest font-bold text-stone-500">
              How FieldFix Works
            </h2>
            <div className="w-10 h-0.5 bg-[#E07A5F] mx-auto mt-1.5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl p-6 border border-[#EAE3D2] shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-3xl font-extrabold text-[#0F4C5C]/20 group-hover:text-[#0F4C5C]/40 transition-colors">
                  01
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0F4C5C] mb-2">
                1. Find Workers
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Filter verified technicians by skill—Plumbing, Electrical, Masonry, Carpentry—with physical shop addresses across Kothrud, Baner, Shivajinagar, and more.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl p-6 border border-[#EAE3D2] shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-3xl font-extrabold text-[#C85A3A]/25 group-hover:text-[#C85A3A]/50 transition-colors">
                  02
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/15 text-[#C85A3A] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0F4C5C] mb-2">
                2. Book Directly
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Open a pre-filled WhatsApp chat with the worker to confirm availability, while automatically registering a tracked booking in the community directory.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl p-6 border border-[#EAE3D2] shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-3xl font-extrabold text-[#0F4C5C]/20 group-hover:text-[#0F4C5C]/40 transition-colors">
                  03
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0F4C5C] mb-2">
                3. Repair Wiki & DIY Guides
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Learn quick 10–15 min DIY fixes for leaking taps, slow drains, loose hinges, and electrical sockets, alongside traditional resilient building methods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
