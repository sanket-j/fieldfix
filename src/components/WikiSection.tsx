import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Droplet, 
  Building, 
  CheckCircle, 
  Hammer, 
  Lightbulb, 
  Info,
  Sparkles,
  Clock,
  Wrench,
  Zap,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { WIKI_ARTICLES, WikiArticle } from '../data/wikiData';

export const WikiSection: React.FC = () => {
  // Track which articles have their deep dive expanded
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({
    'repair-leaking-tap': true, // Open by default for immediate value
  });

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleExpand = (id: string) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    WIKI_ARTICLES.forEach(a => { allExpanded[a.id] = true; });
    setExpandedArticles(allExpanded);
  };

  const collapseAll = () => {
    setExpandedArticles({});
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return WIKI_ARTICLES.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.tagline.toLowerCase().includes(q) ||
        article.materials.some(m => m.toLowerCase().includes(q)) ||
        article.bulletPoints.some(b => b.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    'All',
    'Plumbing DIY',
    'Electrical DIY',
    'Carpentry & Doors',
    'Masonry & Walls',
    'Water Conservation',
    'Resilient Construction'
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Plumbing DIY':
      case 'Water Conservation':
        return <Droplet className="w-3.5 h-3.5 text-teal-600" />;
      case 'Electrical DIY':
        return <Zap className="w-3.5 h-3.5 text-amber-600" />;
      case 'Carpentry & Doors':
        return <Hammer className="w-3.5 h-3.5 text-amber-800" />;
      case 'Masonry & Walls':
      case 'Resilient Construction':
        return <Building className="w-3.5 h-3.5 text-[#C85A3A]" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-[#0F4C5C]" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Plumbing DIY':
      case 'Water Conservation':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Electrical DIY':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'Carpentry & Doors':
        return 'bg-stone-100 text-stone-800 border-stone-200';
      case 'Masonry & Walls':
      case 'Resilient Construction':
        return 'bg-[#FDF2ED] text-[#C85A3A] border-[#E07A5F]/40';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <section id="wiki-section" className="py-12 sm:py-16 bg-[#FBF9F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/15 border border-[#E07A5F]/30 text-[#C85A3A] text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open-Source Repair & Technique Wiki</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0F4C5C] tracking-tight">
            Self-Repair Techniques & Field Guide
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            Step-by-step, 10–15 minute DIY guides to fix leaking taps, unblock drains, silence squeaks, and replace switches safely on your own—alongside traditional resilient building wisdom.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-[#EAE3D2] shadow-xs">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Droplet className="w-4 h-4 text-teal-600" />
              <span>Plumbing DIY</span>
            </div>
            <p className="text-xl font-black text-[#0F4C5C]">5 Guides</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Taps, drains, flush tanks & jets</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EAE3D2] shadow-xs">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Electrical DIY</span>
            </div>
            <p className="text-xl font-black text-[#0F4C5C]">3 Guides</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Switches, 3-pin plugs & fans</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EAE3D2] shadow-xs">
            <div className="flex items-center gap-2 text-stone-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Hammer className="w-4 h-4 text-[#C85A3A]" />
              <span>Doors & Walls</span>
            </div>
            <p className="text-xl font-black text-[#0F4C5C]">4 Guides</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Hinges, latches, cracks & grout</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EAE3D2] shadow-xs">
            <div className="flex items-center gap-2 text-[#0F4C5C] font-bold text-xs uppercase tracking-wider mb-1">
              <Building className="w-4 h-4 text-[#0F4C5C]" />
              <span>Resilience</span>
            </div>
            <p className="text-xl font-black text-[#0F4C5C]">2 Guides</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Rainwater & seismic masonry</p>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EAE3D2] shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search wiki by keyword (e.g., 'tap', 'washer', 'switch', 'drain', 'hinge')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E2D8C3] rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Expand / Collapse All buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={expandAll}
                className="px-3 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-stone-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0F4C5C] text-white shadow-xs'
                    : 'bg-[#F5F2EB] text-stone-700 hover:bg-[#ECE6DA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
          <span>Showing {filteredArticles.length} DIY and engineering wiki guides</span>
          {selectedCategory !== 'All' && (
            <span className="font-semibold text-[#0F4C5C]">
              Filtered by: {selectedCategory}
            </span>
          )}
        </div>

        {/* Article Cards List */}
        <div className="space-y-6">
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EAE3D2] p-12 text-center max-w-md mx-auto">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h4 className="font-serif text-base font-bold text-stone-800">No Wiki Articles Found</h4>
              <p className="text-xs text-stone-500 mt-1 mb-4">No repair guide matched "{searchQuery}".</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl bg-[#0F4C5C] text-white text-xs font-semibold"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredArticles.map((article, index) => {
              const isExpanded = !!expandedArticles[article.id];

              return (
                <article
                  key={article.id}
                  id={article.id}
                  className="bg-white rounded-3xl border border-[#EAE3D2] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Article Header Card */}
                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeClass(article.category)}`}>
                          {getCategoryIcon(article.category)}
                          <span>{article.category}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{article.estimatedTime}</span>
                        </span>
                      </div>

                      <span className="text-xs text-stone-600 font-mono">
                        DIY Guide #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C] mb-1.5 hover:text-[#C85A3A] transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm font-semibold text-[#C85A3A] mb-3">
                      {article.tagline}
                    </p>

                    {/* Summary */}
                    <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EFE8D8] text-xs sm:text-sm text-stone-700 leading-relaxed mb-5">
                      <p>{article.summary}</p>
                    </div>

                    {/* Required Items Pills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      {/* Tools */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-[#0F4C5C]" />
                          Tools You Need
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {article.toolsNeeded.map((tool, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Materials */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#C85A3A]" />
                          Low-Cost Materials
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {article.materials.map((mat, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-[#FAF4ED] text-[#8C3A22] text-xs font-medium border border-[#ECD9C9]"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expand / Collapse Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <button
                        onClick={() => toggleExpand(article.id)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F4C5C] text-white hover:bg-[#134E5E] active:scale-95 transition-all text-xs font-bold shadow-xs"
                      >
                        <span>{isExpanded ? 'Hide Step-by-Step Guide' : 'Read Full Step-by-Step Steps'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#E07A5F]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#E07A5F]" />
                        )}
                      </button>

                      <span className="text-[11px] text-stone-600 hidden sm:inline">
                        {article.deepDive.stepByStep.length} practical steps &bull; {article.bulletPoints.length} core rules
                      </span>
                    </div>
                  </div>

                  {/* Expandable "Read More" Section with Step-by-Step Steps */}
                  {isExpanded && (
                    <div className="border-t border-[#EAE3D2] bg-gradient-to-b from-[#FBF9F5]/70 to-white p-6 sm:p-8 animate-in slide-in-from-top-4 duration-300">
                      <div className="space-y-6">
                        {/* Step-by-Step Implementation */}
                        <div>
                          <h4 className="font-serif text-lg font-bold text-[#0F4C5C] mb-3 flex items-center gap-2">
                            <Hammer className="w-5 h-5 text-[#C85A3A]" />
                            Step-by-Step Procedure ({article.estimatedTime})
                          </h4>
                          <div className="space-y-2.5">
                            {article.deepDive.stepByStep.map((step, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-start gap-3.5 text-xs sm:text-sm text-stone-700 bg-white p-3.5 rounded-2xl border border-[#EAE3D2] shadow-2xs"
                              >
                                <span className="w-6 h-6 rounded-full bg-[#0F4C5C] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="flex-1 leading-relaxed">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Rules - Bullet Points */}
                        <div>
                          <h4 className="font-serif text-base font-bold text-[#0F4C5C] mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            Key Rules & Working Principles
                          </h4>
                          <ul className="space-y-2">
                            {article.bulletPoints.map((point, pIdx) => {
                              const [lead, ...rest] = point.split(':');
                              return (
                                <li
                                  key={pIdx}
                                  className="flex items-start gap-3 text-xs sm:text-sm text-stone-700 bg-stone-50/70 p-3 rounded-xl border border-stone-200"
                                >
                                  <span className="w-2 h-2 rounded-full bg-[#E07A5F] mt-2 shrink-0" />
                                  <div>
                                    <strong className="text-[#0F4C5C] font-semibold">{lead}:</strong>
                                    <span className="text-stone-600">{rest.join(':')}</span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Background & Physics Mechanism */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#0F4C5C]/5 p-4 rounded-2xl border border-[#0F4C5C]/15">
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C5C] mb-1.5 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                              Background & Construction Context
                            </h5>
                            <p className="text-xs text-stone-700 leading-relaxed">
                              {article.deepDive.origin}
                            </p>
                          </div>

                          <div className="bg-[#E07A5F]/10 p-4 rounded-2xl border border-[#E07A5F]/20">
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#C85A3A] mb-1.5 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-[#C85A3A]" />
                              Physical Mechanism / How It Works
                            </h5>
                            <p className="text-xs text-stone-700 leading-relaxed">
                              {article.deepDive.coreMechanism}
                            </p>
                          </div>
                        </div>

                        {/* Practical Field Tips */}
                        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-amber-700" />
                            Pro Tips & Common Mistakes to Avoid
                          </h5>
                          <ul className="list-disc list-inside space-y-1 text-xs text-amber-950">
                            {article.deepDive.practicalTips.map((tip, tIdx) => (
                              <li key={tIdx} className="leading-relaxed">{tip}</li>
                            ))}
                          </ul>
                        </div>

                        {/* When to call a professional */}
                        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-xs font-bold text-rose-900 mb-0.5">
                              When to Call a Verified FieldFix Craftsperson
                            </h5>
                            <p className="text-xs text-rose-800 leading-relaxed">
                              {article.deepDive.whenToCallPro}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
