// Optional Firebase sync. Firebase is only downloaded when VITE_FIREBASE_* env vars exist
// (see .env.example). Every visitor is signed in anonymously on first load — no account form —
// so each player automatically gets their own save at users/{uid}. Google sign-in is optional
// and only needed to continue the same progress on another device.
import { useSyncExternalStore } from 'react';
import { CLOUD_ENABLED, clearPlayer, levelOf, merge, normalize, setPlayer, type Progress } from './progress';

export type CloudStatus = 'off' | 'connecting' | 'synced' | 'offline';
type CloudState = { status: CloudStatus; isAnonymous: boolean; name: string | null; error: string | null };

let cloud: CloudState = { status: CLOUD_ENABLED ? 'connecting' : 'off', isAnonymous: true, name: null, error: null };
const listeners = new Set<() => void>();
const set = (patch: Partial<CloudState>) => {
  cloud = { ...cloud, ...patch };
  listeners.forEach((l) => l());
};
export const useCloud = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => cloud);

const env = import.meta.env;
let signInImpl: (() => Promise<void>) | null = null;
let signOutImpl: (() => Promise<void>) | null = null;

export async function signInWithGoogle() {
  set({ error: null });
  try {
    await signInImpl?.();
  } catch {
    set({ error: "Couldn't sign in. Check your connection and try again." });
  }
}

export async function signOutPlayer() {
  set({ error: null });
  await signOutImpl?.();
}

const toDoc = (p: Progress) => ({
  xp: p.xp,
  level: levelOf(p.xp),
  unlockedCards: p.unlockedCards,
  defeatedCreatures: p.defeatedCreatures,
  memoryProgress: p.memoryProgress,
  battlesWon: p.battlesWon,
  soundOn: p.soundOn,
  updatedAt: p.updatedAt,
});

export async function startCloud() {
  if (!CLOUD_ENABLED) return;
  try {
    const [{ initializeApp }, fa, fs] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);
    const app = initializeApp({
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      appId: env.VITE_FIREBASE_APP_ID,
    });
    const auth = fa.getAuth(app);
    const db = fs.getFirestore(app);
    if (env.VITE_FIREBASE_EMULATORS === 'true') {
      // Local testing only: `firebase emulators:start --only auth,firestore`
      fa.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      fs.connectFirestoreEmulator(db, '127.0.0.1', 8080);
    }

    // Saves are debounced; `flush` writes the pending one right away (before a sign-out).
    // Each save reads the cloud copy first and merges, so a device that was offline, or a second
    // device open on the same account, adds to the save instead of overwriting it.
    let pending: { uid: string; data: Progress } | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const flush = async () => {
      clearTimeout(timer);
      const job = pending;
      pending = null;
      if (!job) return;
      try {
        const ref = fs.doc(db, 'users', job.uid);
        const snap = await fs.getDoc(ref); // throws while offline, so we never write blind
        const data = snap.exists() ? merge(job.data, normalize(snap.data() as Partial<Progress>)) : job.data;
        await fs.setDoc(ref, toDoc(data));
        set({ status: 'synced' });
      } catch {
        set({ status: 'offline' });
        if (!pending && auth.currentUser?.uid === job.uid) {
          pending = job; // keep it and try again shortly
          timer = setTimeout(flush, 15000);
        }
      }
    };
    const saverFor = (uid: string) => (p: Progress) => {
      pending = { uid, data: p };
      clearTimeout(timer);
      timer = setTimeout(flush, 1200);
    };

    const nameOf = (u: import('firebase/auth').User) =>
      u.displayName || u.providerData.find((d) => d.displayName)?.displayName || u.email || 'Google account';

    fa.onAuthStateChanged(auth, async (user) => {
      if (!user) {
        fa.signInAnonymously(auth).catch(() => set({ status: 'offline' }));
        return;
      }
      set({ isAnonymous: user.isAnonymous, name: user.isAnonymous ? null : nameOf(user) });
      let remote: Partial<Progress> | null = null;
      try {
        const snap = await fs.getDoc(fs.doc(db, 'users', user.uid));
        remote = snap.exists() ? (snap.data() as Partial<Progress>) : null;
        set({ status: 'synced' });
      } catch {
        set({ status: 'offline' }); // play on with this device's copy; it syncs on the next save
      }
      if (auth.currentUser?.uid !== user.uid) return; // a different player signed in meanwhile
      setPlayer(user.uid, remote, saverFor(user.uid));
    });

    signInImpl = async () => {
      const provider = new fa.GoogleAuthProvider();
      const current = auth.currentUser;
      try {
        if (current?.isAnonymous) {
          // Keeps the same uid, so the guest's progress simply becomes the account's.
          const { user } = await fa.linkWithPopup(current, provider);
          set({ isAnonymous: false, name: nameOf(user) });
        } else {
          await fa.signInWithPopup(auth, provider);
        }
      } catch (e) {
        const code = (e as { code?: string }).code;
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
        const cred = fa.GoogleAuthProvider.credentialFromError(e as never);
        if (code === 'auth/credential-already-in-use' && cred) {
          // That Google account already has a save: switch to it (setPlayer adds the guest's progress).
          await flush();
          await fa.signInWithCredential(auth, cred);
          return;
        }
        throw e;
      }
    };

    signOutImpl = async () => {
      // Save what we can, but never let a slow or offline connection block signing out.
      await Promise.race([flush(), new Promise((r) => setTimeout(r, 3000))]);
      clearTimeout(timer);
      pending = null;
      clearPlayer();
      await fa.signOut(auth); // onAuthStateChanged then starts a fresh guest
    };
  } catch {
    set({ status: 'offline' });
  }
}
