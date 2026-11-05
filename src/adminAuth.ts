import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, saveUserProfile, UserProfile } from './firebase';

// Preregistered administrator credentials
// CRITICAL: NEVER render or expose these credentials in any UI elements or web templates
const PREREGISTERED_ADMINS: Record<string, string> = {
  'admin@fieldfix.org': 'Admin#FieldFix2026!',
  'sanketjadhav2503@gmail.com': 'Admin#FieldFix2026!',
};

export function isAdminEmail(email: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  return cleanEmail in PREREGISTERED_ADMINS;
}

export function verifyAdminCredentials(email: string, pass: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();
  const expectedPass = PREREGISTERED_ADMINS[cleanEmail];
  return !!expectedPass && expectedPass === cleanPass;
}

export async function authenticateAdmin(email: string, pass: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!verifyAdminCredentials(cleanEmail, cleanPass)) {
    throw new Error('Invalid administrator credentials. Access restricted.');
  }

  let uid = cleanEmail === 'sanketjadhav2503@gmail.com' ? 'admin-sanket-jadhav' : 'admin-fieldfix-master';

  // Attempt Firebase Auth sign in / user registration
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    uid = cred.user.uid;
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
        uid = newCred.user.uid;
      } catch {
        // Continue with stable admin UID if provider is restricted in Firebase console
      }
    }
  }

  const profile: UserProfile = {
    uid,
    email: cleanEmail,
    displayName: cleanEmail === 'sanketjadhav2503@gmail.com' ? 'Sanket Jadhav' : 'System Administrator',
    role: 'admin',
    createdAt: Date.now(),
  };

  try {
    await saveUserProfile(profile);
  } catch (e) {
    console.warn('Could not sync admin profile to Firestore directly:', e);
  }

  localStorage.setItem('fieldfix_active_user', JSON.stringify(profile));
  return profile;
}
