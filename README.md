# cognitive-biases-game
This game is a card attack game containing cognitive biases. It's inspired by Kahneman's "Thinking: Fast and Slow" 

**Mind Hunters** — battle creatures born from distorted thinking by naming the bias behind each situation. Win Bias Cards, fill your collection, and train recall in the Memory Chamber.

## Run it

```bash
npm install
npm run dev
```

`npm run build` type-checks and builds to `dist/` (Vercel: framework preset "Vite", no extra settings).

## Add content

All game content is data — no component changes needed:

| File | What it holds |
| --- | --- |
| `src/data/biases.ts` | The Bias Cards: name, category, tagline, definition, example |
| `src/data/battleScenarios.ts` | Situations: prompt, correct bias, 4 believable distractors, a hint |
| `src/data/creatures.ts` | Creatures and which biases they embody (drawn in `src/components/CreatureArt.tsx`) |

A new bias needs an entry in `biases.ts` and at least one scenario. An icon in `src/components/BiasIcon.tsx` is optional (it falls back to the category glyph).

## Players, progress & Firebase

**Players don't need an account.** Every visitor is signed in anonymously on first load, so each
person (each browser/device) automatically gets their own save at `users/{uid}` in Firestore.
Google sign-in is optional: it links the guest's progress to their Google account so they can
continue on another device. Signing out gives the next person on that device a clean slate.

Progress is also cached in `localStorage` per player, so the game works offline and loads
instantly. Without Firebase configured, progress is saved in the browser only.

Setting up Firebase:

1. Firebase console → create a project → add a **Web app**; copy its config.
2. **Authentication** → Sign-in method → enable **Anonymous** (and **Google** for cross-device sign-in).
   Add your Vercel domain under Authentication → Settings → Authorized domains.
3. **Firestore Database** → create database → paste `firestore.rules` into the Rules tab → Publish.
   The rules let each player read and write only their own document.
4. Copy `.env.example` to `.env` and fill in the four `VITE_FIREBASE_*` values. On Vercel, add the
   same four as Environment Variables and redeploy.

Local multi-player testing: run `firebase emulators:start --only auth,firestore` and set
`VITE_FIREBASE_EMULATORS=true` in `.env.local`.

## Controls

Tap a card to read it, tap again to counter. On a computer: keys 1–5 pick a card, pressing it
again (or Enter) counters.
