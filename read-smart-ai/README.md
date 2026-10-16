# Read Smart AI

A reading app for Indian learners: tap any English word to see its meaning in English and Hindi, save it to a notebook, and practise with flashcards and a quiz.

- `mobile/`: React Native app built with Expo (runs in Expo Go)
- `server/`: Node.js + Express API that calls Google Gemini and parses uploaded books

## 1. Get a Gemini API key

Create a free key at https://aistudio.google.com/apikey.

## 2. Start the server

```bash
cd server
npm install
cp .env.example .env        # Windows: copy .env.example .env
# open .env and paste your key into GEMINI_API_KEY
npm run dev
```

Check it works: open http://localhost:4000/health in your browser. You should see `{"ok":true}`.

## 3. Start the mobile app

Find your computer's Wi-Fi IP address:
- Windows: run `ipconfig` and look for "IPv4 Address"
- Mac: run `ipconfig getifaddr en0`

```bash
cd mobile
npm install
cp .env.example .env        # Windows: copy .env.example .env
# open .env and set EXPO_PUBLIC_API_URL=http://<your-IP>:4000
npx expo start
```

Scan the QR code with the Expo Go app on your phone. The phone and the computer must be on the same Wi-Fi.

If `npx expo start` warns about package versions, run `npx expo install --fix`.

## How it fits together

1. You tap a word in the reader (`mobile/src/app/reader/[bookId].tsx`).
2. `useMeaning` checks the on-device cache first, then calls `POST /api/meaning` on the server.
3. The server asks Gemini for a JSON answer (`server/src/services/gemini.service.ts`) and returns it.
4. "Save to Notebook" stores the word on the phone, so it survives app restarts.
5. Uploading a book sends the file to `POST /api/books/parse`, which returns pages of text.

## Folder map

```
read-smart-ai/
├── mobile/
│   ├── src/
│   │   ├── app/                  screens (Expo Router: each file is a route)
│   │   │   ├── _layout.tsx       root stack, status bar, daily streak
│   │   │   ├── (tabs)/           Home, Read, Vocab tabs
│   │   │   └── reader/[bookId].tsx
│   │   ├── components/           common/, reader/, vocab/, home/
│   │   ├── services/             api.ts, meaning.ts, books.ts (talk to your server)
│   │   ├── store/                notebook, library, meaning cache, settings (saved on device)
│   │   ├── hooks/                useMeaning, useTheme
│   │   ├── theme/                colours and fonts
│   │   ├── data/                 sample books
│   │   ├── utils/                word tokenizer, quiz builder
│   │   └── types/                shared TypeScript types
│   ├── assets/                   icons and splash
│   ├── .env.example              EXPO_PUBLIC_API_URL
│   └── app.json, package.json, tsconfig.json
│
└── server/
    ├── src/
    │   ├── index.ts              app setup, port 4000
    │   ├── routes/               meaning.routes.ts, books.routes.ts
    │   ├── services/             gemini.service.ts, parser.service.ts
    │   ├── prompts/              meaning.prompt.ts
    │   ├── middleware/           rateLimit.ts, errorHandler.ts
    │   └── utils/                chunkPages.ts
    ├── .env.example              GEMINI_API_KEY, GEMINI_MODEL, PORT
    └── package.json, tsconfig.json
```

## Changing the Gemini model

Set `GEMINI_MODEL` in `server/.env`. The default is `gemini-2.5-flash`, which is fast and cheap for word lookups. If Google has retired it, pick a current Flash model from https://ai.google.dev/gemini-api/docs/models.

## Keep your key safe

The Gemini key lives only in `server/.env`. Never put it in `mobile/.env`: anything starting with `EXPO_PUBLIC_` is bundled inside the app where anyone can read it. Both `.env` files are git-ignored.
