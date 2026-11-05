import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../firebase';
import { authenticateAdmin } from '../adminAuth';

interface AdminLoginProps {
  currentUser: UserProfile | null;
  onAdminAuthenticated: (profile: UserProfile) => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  currentUser,
  onAdminAuthenticated,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const profile = await authenticateAdmin(email, password);
      onAdminAuthenticated(profile);
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Access restricted.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-lg mx-auto px-4 sm:px-6 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-[#EAE3D2] shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F4C5C] text-white p-8 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 text-[#E07A5F] shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Administrator Access Portal
          </h2>
          <p className="text-xs text-teal-100 mt-1 max-w-sm mx-auto">
            Restricted administrative terminal for platform operators and directory moderation.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Active session warning if logged in as customer or worker */}
          {currentUser && currentUser.role !== 'admin' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <KeyRound className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Elevated Privileges Required</span>
              </div>
              <p className="text-stone-600">
                You are currently signed in as <strong className="text-stone-900">{currentUser.displayName || currentUser.email}</strong> ({currentUser.role}). Please enter administrator credentials below to switch to the admin console.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#0F4C5C] hover:bg-[#134E5E] active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Authorization...' : 'Sign In to Admin Console'}</span>
              <ArrowRight className="w-4 h-4 text-[#E07A5F]" />
            </button>
          </form>

          {/* Return link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#0F4C5C] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Directory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
