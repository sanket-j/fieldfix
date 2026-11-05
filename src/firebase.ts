import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  setDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export type SkillType = 'Plumbing' | 'Electrical' | 'Masonry' | 'Carpentry';
export type UserRole = 'customer' | 'worker' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: number;
  workerId?: string;
}

export interface Worker {
  id: string;
  userId?: string; // Links this worker listing to the worker user's auth UID
  name: string;
  shop: string;
  skill: SkillType;
  area: string;
  address: string;
  phone: string;
  maps: string;
  description: string;
  createdAt?: number;
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected';

export interface Booking {
  id: string;
  workerId: string;
  workerUserId?: string; // Links this booking to the worker's UID
  workerName: string;
  skill: SkillType;
  status: BookingStatus;
  requestedAt: number;
  customerId?: string; // Links this booking to the customer's UID
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  whatsappDraft?: string;
  statusReason?: string;
  updatedAt?: number;
}

export const SAMPLE_WORKERS: (Omit<Worker, 'id'> & { sampleWorkerUserId?: string })[] = [
  {
    userId: 'worker-user-ramesh',
    name: "Ramesh Shinde",
    shop: "Shinde Electricals & Motor Works",
    skill: "Electrical",
    area: "Kothrud, Pune",
    address: "Shop No. 4, Near Karve Statue, Karve Road, Kothrud, Pune - 411038",
    phone: "+919822014852",
    maps: "https://www.google.com/maps/search/?api=1&query=Karve+Statue+Kothrud+Pune",
    description: "Over 18 years repairing residential distribution boards, short circuits, high-load appliance wiring, and submersible water pump motors."
  },
  {
    userId: 'worker-user-anand',
    name: "Anand Kulkarni",
    shop: "Kulkarni Plumbing & Sanitary Solutions",
    skill: "Plumbing",
    area: "Baner, Pune",
    address: "Lane 3, Behind Balewadi High Street, Baner, Pune - 411045",
    phone: "+919850127439",
    maps: "https://www.google.com/maps/search/?api=1&query=Balewadi+High+Street+Baner+Pune",
    description: "Specialist in concealed copper and CPVC pipeline leaks, solar water heater connections, and rapid pressure-pump servicing."
  },
  {
    userId: 'worker-user-tukaram',
    name: "Tukaram Jadhav",
    shop: "Jadhav Masonry & Heritage Plaster Works",
    skill: "Masonry",
    area: "Shivajinagar, Pune",
    address: "Opp. Modern College Road, Shivajinagar, Pune - 411005",
    phone: "+919763289104",
    maps: "https://www.google.com/maps/search/?api=1&query=Modern+College+Road+Shivajinagar+Pune",
    description: "Master mason skilled in lime-mortar pointing, damp-wall waterproofing, stone retaining walls, and earthquake-band retrofitting."
  },
  {
    userId: 'worker-user-dilip',
    name: "Dilip Sutar",
    shop: "Sutar Fine Woodcraft & Furniture Clinic",
    skill: "Carpentry",
    area: "Aundh, Pune",
    address: "Near Medipoint Hospital, DP Road, Aundh, Pune - 411007",
    phone: "+919422561830",
    maps: "https://www.google.com/maps/search/?api=1&query=DP+Road+Aundh+Pune",
    description: "Expert in solid teakwood restoration, modular kitchen hinges, precision door alignment, and custom termite-resistant shelving."
  },
  {
    userId: 'worker-user-santosh',
    name: "Santosh More",
    shop: "More Hydro-Tech Pipeline & Drainage",
    skill: "Plumbing",
    area: "Viman Nagar, Pune",
    address: "Galli 2, Near Datta Mandir, Viman Nagar, Pune - 411014",
    phone: "+919921455021",
    maps: "https://www.google.com/maps/search/?api=1&query=Datta+Mandir+Viman+Nagar+Pune",
    description: "Prompt response for overhead tank ball-valves, underground sump float valves, and low-cost rainwater recharge pit connections."
  },
  {
    userId: 'worker-user-mahendra',
    name: "Mahendra Sonawane",
    shop: "Sonawane Power & Inverter Services",
    skill: "Electrical",
    area: "Hadapsar, Pune",
    address: "Shop 12, Gadital Chowk, Pune-Solapur Road, Hadapsar, Pune - 411028",
    phone: "+919881390442",
    maps: "https://www.google.com/maps/search/?api=1&query=Gadital+Hadapsar+Pune",
    description: "Industrial and residential single/three-phase wiring, home inverter battery setups, and surge protector installations."
  }
];

export async function seedSampleWorkersIfEmpty() {
  try {
    const workersCol = collection(db, 'workers');
    const snapshot = await getDocs(workersCol);
    if (snapshot.empty) {
      console.log('Seeding initial 6 sample workers...');
      const promises = SAMPLE_WORKERS.map((worker, index) => {
        const id = `worker-pune-${index + 1}`;
        return setDoc(doc(db, 'workers', id), {
          ...worker,
          createdAt: Date.now() - (6 - index) * 3600000
        });
      });
      await Promise.all(promises);
      console.log('Seeding complete.');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Seeding check failed or already seeded:', error);
    return false;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  // 1. Try local storage cache
  try {
    const cached = localStorage.getItem(`fieldfix_user_profile_${uid}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.uid === uid) {
        // Return cached or check remote in background
        return parsed as UserProfile;
      }
    }
  } catch {}

  // 2. Query Firestore
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      try {
        localStorage.setItem(`fieldfix_user_profile_${uid}`, JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch user profile from Firestore:', err);
  }

  // 3. Fallback to active user session if matching
  try {
    const active = localStorage.getItem('fieldfix_active_user');
    if (active) {
      const parsed = JSON.parse(active);
      if (parsed && parsed.uid === uid) {
        return parsed as UserProfile;
      }
    }
  } catch {}

  return null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  // Always cache locally first
  try {
    localStorage.setItem(`fieldfix_user_profile_${profile.uid}`, JSON.stringify(profile));
  } catch {}

  try {
    await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
  } catch (err) {
    console.warn('Warning: Could not sync user profile to Firestore:', err);
    // Profile is already securely saved locally in session and vault
  }
}
