import React, { useState } from 'react';
import { 
  X, 
  User, 
  Wrench, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db, UserProfile, UserRole, saveUserProfile, getUserProfile } from '../firebase';
import { 
  isAdminEmail, 
  verifyAdminCredentials, 
  authenticateAdmin 
} from '../adminAuth';
import { 
  checkAccountExists, 
  recordAccountRegistration, 
  hashPassword, 
  verifyAccountPassword 
} from '../accountRegistry';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
  onOpenAdmin?: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenAdmin,
  defaultRole = 'customer',
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignUpSuggestion, setShowSignUpSuggestion] = useState(false);

  // Role selection prompt for Google sign in if user has no profile
  const [needsRoleSelectionForGoogle, setNeedsRoleSelectionForGoogle] = useState<{
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null>(null);

  if (!isOpen) return null;

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setError(null);
    setShowSignUpSuggestion(false);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;

      // Check if user profile already exists
      const existingProfile = await getUserProfile(user.uid);
      if (existingProfile) {
        if (user.email) {
          await recordAccountRegistration(user.email, existingProfile.role, undefined, existingProfile);
        }
        onSuccess(existingProfile);
        onClose();
        return;
      }

      // Check if user is known admin
      if (user.email === 'sanketjadhav2503@gmail.com' || user.email === 'admin@fieldfix.org') {
        const adminProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Administrator',
          role: 'admin',
          createdAt: Date.now(),
        };
        await saveUserProfile(adminProfile);
        await recordAccountRegistration(user.email, 'admin', undefined, adminProfile);
        onSuccess(adminProfile);
        onClose();
        return;
      }

      // If new user via Google, ask for role if not already chosen
      setNeedsRoleSelectionForGoogle({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in window was closed.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups or use email sign in.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishGoogleWithRole = async (chosenRole: UserRole) => {
    if (!needsRoleSelectionForGoogle) return;
    setIsLoading(true);
    try {
      const newProfile: UserProfile = {
        uid: needsRoleSelectionForGoogle.uid,
        email: needsRoleSelectionForGoogle.email,
        displayName: needsRoleSelectionForGoogle.displayName || (chosenRole === 'worker' ? 'Technician' : 'Customer'),
        role: chosenRole,
        createdAt: Date.now(),
      };
      await saveUserProfile(newProfile);
      if (needsRoleSelectionForGoogle.email) {
        await recordAccountRegistration(needsRoleSelectionForGoogle.email, chosenRole, undefined, newProfile);
      }
      onSuccess(newProfile);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save account profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowSignUpSuggestion(false);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // ================================================================
        // --- 1. SIGN UP FLOW ---
        // ================================================================
        if (!name.trim()) {
          setError('Please enter your name.');
          setIsLoading(false);
          return;
        }

        if (cleanPassword.length < 6) {
          setError('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }

        // Check if an account already exists for this email
        const alreadyExists = await checkAccountExists(cleanEmail);
        if (alreadyExists) {
          setError('An account with this email already exists. Please switch to Sign In.');
          setShowSignUpSuggestion(false);
          setIsLoading(false);
          return;
        }

        const passHash = await hashPassword(cleanPassword);
        let uid = `user-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`;

        // Attempt Firebase Auth user creation if provider is available
        try {
          const cred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          uid = cred.user.uid;
          if (name.trim()) {
            await updateProfile(cred.user, { displayName: name.trim() });
          }
        } catch (authErr: any) {
          if (authErr.code === 'auth/email-already-in-use') {
            setError('This email is already registered on FieldFix. Please switch to Sign In.');
            setIsLoading(false);
            return;
          }
          if (authErr.code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
            setIsLoading(false);
            return;
          }
          // If auth/operation-not-allowed or restricted provider in Firebase console,
          // smoothly fall back to our secure web account system with full password verification
        }

        const profile: UserProfile = {
          uid,
          email: cleanEmail,
          displayName: name.trim(),
          role: selectedRole,
          createdAt: Date.now(),
        };

        // Persist profile and secure credentials record
        await saveUserProfile(profile);
        await recordAccountRegistration(cleanEmail, selectedRole, passHash, profile);

        onSuccess(profile);
        onClose();
      } else {
        // ================================================================
        // --- 2. SIGN IN FLOW ---
        // ================================================================
        
        // Special case: Administrator accounts
        if (isAdminEmail(cleanEmail)) {
          if (verifyAdminCredentials(cleanEmail, cleanPassword)) {
            const adminProfile = await authenticateAdmin(cleanEmail, cleanPassword);
            await recordAccountRegistration(cleanEmail, 'admin');
            onSuccess(adminProfile);
            onClose();
            return;
          } else {
            setError('Incorrect password or email. Please verify your password and try again.');
            setShowSignUpSuggestion(false);
            setIsLoading(false);
            return;
          }
        }

        // Requirement: Verify if user already has an account on the web or previously logged in
        const accountExists = await checkAccountExists(cleanEmail);

        if (!accountExists) {
          // If the email is NOT signed up previously, display no account found and suggest to sign up!
          setError('No account found for this email address. Please sign up to create your account.');
          setShowSignUpSuggestion(true);
          setIsLoading(false);
          return;
        }

        // The user already has an account on the web!
        // Requirement: "then only check his password is same for his or her email before if not display as incorrect password or email"
        const verifyRes = await verifyAccountPassword(cleanEmail, cleanPassword);

        if (verifyRes.matched) {
          // Password verified against stored account password!
          const record = verifyRes.record;
          let profile = record?.uid ? await getUserProfile(record.uid) : null;

          if (!profile) {
            profile = {
              uid: record?.uid || `web-user-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
              email: cleanEmail,
              displayName: record?.displayName || cleanEmail.split('@')[0],
              role: record?.role || selectedRole,
              createdAt: record?.registeredAt || Date.now(),
            };
            await saveUserProfile(profile);
          }

          await recordAccountRegistration(cleanEmail, profile.role, record?.passHash, profile);
          onSuccess(profile);
          onClose();
          return;
        }

        // If a password hash is stored for this email and it did NOT match, reject immediately
        if (verifyRes.record && verifyRes.record.passHash) {
          setError('Incorrect password or email. Please verify your password and try again.');
          setShowSignUpSuggestion(false);
          setIsLoading(false);
          return;
        }

        // If no web password hash was stored, try Firebase Auth
        try {
          const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          const passHash = await hashPassword(cleanPassword);
          let profile = await getUserProfile(cred.user.uid);

          if (!profile) {
            profile = {
              uid: cred.user.uid,
              email: cleanEmail,
              displayName: cred.user.displayName || cleanEmail.split('@')[0],
              role: selectedRole,
              createdAt: Date.now(),
            };
            await saveUserProfile(profile);
          }

          await recordAccountRegistration(cleanEmail, profile.role, passHash, profile);
          onSuccess(profile);
          onClose();
        } catch (authErr: any) {
          if (
            authErr.code === 'auth/wrong-password' || 
            authErr.code === 'auth/invalid-credential' || 
            authErr.code === 'auth/invalid-login-credentials'
          ) {
            setError('Incorrect password or email. Please verify your password and try again.');
            setShowSignUpSuggestion(false);
          } else if (authErr.code === 'auth/user-not-found') {
            setError('No account found for this email address. Please sign up to create your account.');
            setShowSignUpSuggestion(true);
          } else if (authErr.code === 'auth/too-many-requests') {
            setError('Too many failed attempts. Access is temporarily restricted. Please try again in a few moments.');
            setShowSignUpSuggestion(false);
          } else if (authErr.code === 'auth/operation-not-allowed') {
            setError('Incorrect password or email. Please verify your password and try again.');
            setShowSignUpSuggestion(false);
          } else {
            setError('Incorrect password or email. Please verify your password and try again.');
            setShowSignUpSuggestion(false);
          }
        }
      }
    } catch (err: any) {
      console.warn('Authentication processing error:', err);
      setError(err?.message || 'Authentication failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-[#EAE3D2] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#0F4C5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#E07A5F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">
                {needsRoleSelectionForGoogle 
                  ? 'Complete Your Account' 
                  : isSignUp ? 'Create FieldFix Account' : 'Sign In to FieldFix'}
              </h3>
              <p className="text-xs text-teal-100">
                {needsRoleSelectionForGoogle 
                  ? 'Choose how you want to use the platform' 
                  : isSignUp ? 'Join as a Customer or local Repair Worker' : 'Access your dashboard & account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {needsRoleSelectionForGoogle ? (
            /* Role prompt for Google Auth */
            <div className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Welcome, <strong>{needsRoleSelectionForGoogle.displayName || needsRoleSelectionForGoogle.email}</strong>! Please select how you want to use FieldFix:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleFinishGoogleWithRole('customer')}
                  disabled={isLoading}
                  className="p-4 rounded-2xl border-2 border-stone-200 hover:border-[#0F4C5C] text-left transition-all hover:bg-stone-50"
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F4C5C] flex items-center justify-center mb-2">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="font-serif font-bold text-sm text-[#0F4C5C]">I'm a Customer</div>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Browse verified repair workers and request jobs directly
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleFinishGoogleWithRole('worker')}
                  disabled={isLoading}
                  className="p-4 rounded-2xl border-2 border-stone-200 hover:border-[#C85A3A] text-left transition-all hover:bg-[#FDF2ED]"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C85A3A] flex items-center justify-center mb-2">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="font-serif font-bold text-sm text-[#C85A3A]">I'm a Worker</div>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    List your shop, receive booking requests, and accept jobs
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Role Picker (Visible when signing up) */}
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Select Account Type:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('customer')}
                      className={`p-3 rounded-xl border-2 text-left transition-all flex items-start gap-2.5 ${
                        selectedRole === 'customer'
                          ? 'border-[#0F4C5C] bg-[#0F4C5C]/5 text-[#0F4C5C]'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <User className={`w-5 h-5 shrink-0 mt-0.5 ${selectedRole === 'customer' ? 'text-[#0F4C5C]' : 'text-stone-400'}`} />
                      <div>
                        <div className="font-serif font-bold text-xs">Customer</div>
                        <div className="text-[10px] text-stone-500 leading-tight mt-0.5">Find & book local repair workers</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('worker')}
                      className={`p-3 rounded-xl border-2 text-left transition-all flex items-start gap-2.5 ${
                        selectedRole === 'worker'
                          ? 'border-[#C85A3A] bg-[#C85A3A]/5 text-[#C85A3A]'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <Wrench className={`w-5 h-5 shrink-0 mt-0.5 ${selectedRole === 'worker' ? 'text-[#C85A3A]' : 'text-stone-400'}`} />
                      <div>
                        <div className="font-serif font-bold text-xs">Worker</div>
                        <div className="text-[10px] text-stone-500 leading-tight mt-0.5">List services & manage bookings</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message with Sign Up Suggestion */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col gap-2.5 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1 leading-relaxed font-medium">{error}</div>
                  </div>
                  {showSignUpSuggestion && (
                    <div className="pl-6 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(true);
                          setError(null);
                          setShowSignUpSuggestion(false);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-[#0F4C5C] hover:bg-[#134E5E] text-white text-[11px] font-bold shadow-xs transition-all active:scale-95"
                      >
                        <span>Sign Up with {email || 'this email'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#E07A5F]" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 active:scale-[0.99] text-stone-800 text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-3 text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                  Or use email
                </span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedRole === 'worker' ? 'e.g. Ramesh Shinde' : 'e.g. Rahul Patil'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) {
                        setError(null);
                        setShowSignUpSuggestion(false);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) {
                        setError(null);
                        setShowSignUpSuggestion(false);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-[#0F4C5C] hover:bg-[#134E5E] active:scale-[0.99] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Processing...' : isSignUp ? `Register as ${selectedRole === 'worker' ? 'Worker' : 'Customer'}` : 'Sign In'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E07A5F]" />
                </button>
              </form>

              {/* Toggle Sign Up / Sign In */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setShowSignUpSuggestion(false);
                  }}
                  className="text-xs text-stone-600 hover:text-[#0F4C5C] font-semibold underline"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"}
                </button>
              </div>

              {/* Admin Portal Gateway Link */}
              {onOpenAdmin && (
                <div className="pt-3 border-t border-stone-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#0F4C5C] font-semibold transition-colors py-1 px-2.5 rounded-lg hover:bg-stone-50"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Administrator Access Portal</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
