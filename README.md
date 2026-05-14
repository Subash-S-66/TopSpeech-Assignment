# TopSpeech Health - Daily Lesson Experience (PWA)

A lightweight Duolingo-inspired daily lesson prototype for speech therapy (focused on rhotacism / R-sound practice), built as a responsive PWA.

The goal of this prototype is simple: open the app, complete a short daily lesson, get immediate feedback, feel progress, and come back tomorrow.

## What this project includes

- Two daily learning tracks in one PWA:
  - **LevelUp**: adaptive aptitude/coding-style MCQ lesson flow
  - **TopSpeech**: rhotacism-focused speech therapy lesson flow
- A complete daily lesson flow:
  - start screens
  - in-lesson card progression
  - feedback states (correct / incorrect)
  - completion screen with XP + streak motivation
- 4-6 card sessions with multiple exercise styles:
  - listen-and-repeat prompt
  - minimal-pair word choice
  - mirror-cue posture guidance
  - sentence-level R-target selection
- LevelUp includes daily MCQ challenge behavior with adaptive difficulty and progress tracking.
- Smooth transitions and progress animation during lessons
- PWA support (manifest + service worker)
- Mobile-first responsive UI (works across phone and desktop browser sizes)

## UX approach (Duolingo-inspired, but adapted for health)

What I kept:
- clear step-by-step progression
- strong completion reward loop
- lightweight daily commitment model

What I changed for speech therapy:
- softer, clinically warm language (less gamey pressure)
- supportive feedback tone for wrong answers
- mirror/posture cue style cards for articulation confidence
- completion messaging focused on consistency over perfection

## One product innovation added

I added a "mirror-cue" exercise type: instead of only asking for right/wrong answers, it trains physical speaking posture (jaw, airflow, tongue cue selection). This is useful in speech therapy because users need confidence in how to produce sounds, not just what answer is correct. It introduces a body-awareness loop that classic quiz-first apps usually miss.

## Tech stack

- React + Vite
- React Router
- Framer Motion
- Tailwind CSS
- PWA: manifest + service worker

## Gemini usage

The app supports Gemini-generated lesson/question content with ordered model fallback.

Current model order:
1. `gemini-2.5-flash-lite`
2. `gemini-2.5-flash`
3. `gemini-flash-latest`
4. `gemini-1.5-flash`

Behavior:
- models are tried one-by-one in the above order
- unavailable models fall through to the next
- if all fail, the app uses local static fallback cards so the lesson is never blocked

## Environment setup

Create a `.env` file in project root:

```env
VITE_GEMINI_API_KEY=YOUR_KEY_HERE
```

Do not commit real API keys to public repositories.

## Run locally

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

This project includes `vercel.json` configured for Vite + SPA routing.

- build command: `npm run build`
- output directory: `dist`
- rewrite all routes to `index.html` for client-side routing

After import to Vercel, set `VITE_GEMINI_API_KEY` in Project Settings -> Environment Variables.

---

If you are reviewing this as an assignment: this prototype is intentionally focused on interaction quality, emotional tone, and daily habit loop design rather than backend integration.
