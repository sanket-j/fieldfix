import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth, db, UserProfile } from './firebase';
import { isAdminEmail, verifyAdminCredentials } from './adminAuth';

const LOCAL_STORAGE_EMAILS_KEY = 'fieldfix_registered_accounts';
const LOCAL_STORAGE_VAULT_KEY = 'fieldfix_accounts_vault';

export interface StoredAccountRecord {
  email: string;
  role: 'customer' | 'worker' | 'admin';
  displayName?: string;
  passHash?: string;
  uid?: string;
  registeredAt: number;
  lastLoginAt?: number;
}

// Compute SHA-256 hash for password verification
export async function hashPassword(password: string): Promise<string> {
  const clean = password.trim();
  if (!clean) return '';
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(clean);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('SubtleCrypto error, falling back to basic hash:', e);
  }
  // Fallback hash
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'fb_' + Math.abs(hash).toString(16);
}

// Get list of local registered emails
export function getLocalRegisteredEmails(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EMAILS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save an email to local registered emails list
export function saveLocalRegisteredEmail(email: string) {
  try {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    const current = getLocalRegisteredEmails();
    if (!current.includes(clean)) {
      current.push(clean);
      localStorage.setItem(LOCAL_STORAGE_EMAILS_KEY, JSON.stringify(current));
    }
  } catch {}
}

// Get accounts vault from local storage
export function getLocalAccountsVault(): Record<string, StoredAccountRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VAULT_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Save account record to local storage vault
export function saveLocalAccountRecord(record: StoredAccountRecord) {
  try {
    const vault = getLocalAccountsVault();
    vault[record.email] = {
      ...(vault[record.email] || {}),
      ...record
    };
    localStorage.setItem(LOCAL_STORAGE_VAULT_KEY, JSON.stringify(vault));
    saveLocalRegisteredEmail(record.email);
  } catch {}
}

// Record account registration or update
export async function recordAccountRegistration(
  email: string, 
  role: 'customer' | 'worker' | 'admin' = 'customer',
  passHash?: string,
  profile?: UserProfile
): Promise<void> {
  const clean = email.trim().toLowerCase();
  if (!clean) return;

  const record: StoredAccountRecord = {
    email: clean,
    role: role || 'customer',
    displayName: profile?.displayName || clean.split('@')[0],
    passHash: passHash || undefined,
    uid: profile?.uid || `web-user-${clean.replace(/[^a-z0-9]/g, '-')}`,
    registeredAt: profile?.createdAt || Date.now(),
    lastLoginAt: Date.now()
  };

  // 1. Save in browser local storage
  saveLocalAccountRecord(record);

  // 2. Persist in Firestore registered_emails collection
  try {
    await setDoc(doc(db, 'registered_emails', clean), {
      email: clean,
      role: record.role,
      displayName: record.displayName,
      uid: record.uid,
      passHash: record.passHash || '',
      registeredAt: record.registeredAt,
      lastLoginAt: record.lastLoginAt
    }, { merge: true });
  } catch (err) {
    console.warn('Could not record registered email in Firestore:', err);
  }
}

// Check if an account exists for this email
export async function checkAccountExists(email: string): Promise<boolean> {
  const clean = email.trim().toLowerCase();
  if (!clean) return false;

  // 1. Admin emails are always recognized
  if (isAdminEmail(clean)) {
    return true;
  }

  // 2. Check local accounts vault
  const vault = getLocalAccountsVault();
  if (vault[clean]) {
    return true;
  }

  // 3. Check localStorage registered emails
  const localList = getLocalRegisteredEmails();
  if (localList.includes(clean)) {
    return true;
  }

  // 4. Check Firestore registered_emails
  try {
    const snap = await getDoc(doc(db, 'registered_emails', clean));
    if (snap.exists()) {
      const data = snap.data() as StoredAccountRecord;
      saveLocalAccountRecord({
        ...data,
        email: clean
      });
      return true;
    }
  } catch (err) {
    console.warn('Firestore registered_emails check failed:', err);
  }

  // 5. Check Firebase Auth
  try {
    const methods = await fetchSignInMethodsForEmail(auth, clean);
    if (methods && methods.length > 0) {
      saveLocalRegisteredEmail(clean);
      return true;
    }
  } catch (err) {
    console.warn('fetchSignInMethodsForEmail check failed:', err);
  }

  return false;
}

// Retrieve stored account details for an email
export async function getAccountRecord(email: string): Promise<StoredAccountRecord | null> {
  const clean = email.trim().toLowerCase();
  if (!clean) return null;

  // Check local vault first
  const vault = getLocalAccountsVault();
  if (vault[clean]) {
    return vault[clean];
  }

  // Query Firestore registered_emails
  try {
    const snap = await getDoc(doc(db, 'registered_emails', clean));
    if (snap.exists()) {
      const record = snap.data() as StoredAccountRecord;
      saveLocalAccountRecord(record);
      return record;
    }
  } catch (e) {
    console.warn('Could not fetch account record from Firestore:', e);
  }

  return null;
}

// Verify if the password matches the account's password
export async function verifyAccountPassword(
  email: string, 
  passwordAttempt: string
): Promise<{ matched: boolean; record?: StoredAccountRecord }> {
  const clean = email.trim().toLowerCase();
  const cleanPass = passwordAttempt.trim();

  // 1. Admin verification
  if (isAdminEmail(clean)) {
    const matched = verifyAdminCredentials(clean, cleanPass);
    return { matched };
  }

  // 2. Web user account verification
  const record = await getAccountRecord(clean);
  if (!record || !record.passHash) {
    // If no password hash was stored, we cannot verify via web hash
    return { matched: false };
  }

  const attemptHash = await hashPassword(cleanPass);
  const matched = record.passHash === attemptHash;
  return { matched, record };
}
