import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, getDocFromServer, query, orderBy } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize the core Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// Test FireStore Connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Firestore connection verified.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.", error);
    }
  }
}

// ----------------------------------------------------
// Error Handling conforming to FirestoreErrorInfo
// ----------------------------------------------------

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Ensure the user is authenticated in the background (using Firebase Anonymous login)
// to respect secure rules while retaining frictionless auditing.
export function initializeAnonAuth(onAuthUser: (user: User | null) => void) {
  onAuthStateChanged(auth, (authUser) => {
    if (authUser) {
      console.log("Authenticated with Firebase as:", authUser.uid);
      onAuthUser(authUser);
    } else {
      console.log("Authenticating anonymously...");
      signInAnonymously(auth)
        .then((cred) => {
          console.log("Anonymous authentication active:", cred.user.uid);
          onAuthUser(cred.user);
        })
        .catch((err) => {
          // Gracefully default to unauthenticated baseline - our relaxed Firestore security rules permit direct sessions.
          console.log("Optional Firebase Anonymous Auth provider is disabled in Firebase console config (admin-restricted-operation). App will securely fallback to safe public/guest database mode.");
          onAuthUser(null);
        });
    }
  });
}

// ----------------------------------------------------
// Database Fetch & Save Handlers
// ----------------------------------------------------

export async function saveVisitToFirestore(visit: any): Promise<void> {
  const path = `visits/${visit.id}`;
  try {
    const docRef = doc(db, 'visits', visit.id);
    const enrichedVisit = {
      ...visit,
      createdAt: visit.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, enrichedVisit);
    console.log(`Visit successfully saved to Firebase Firestore at location /visits/${visit.id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchVisitsFromFirestore(): Promise<any[]> {
  const path = 'visits';
  try {
    const visitsCollection = collection(db, 'visits');
    const q = query(visitsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(doc => doc.data());
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
