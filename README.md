=================== SETUP ===================

- create a firebase project and a firestore database

- in the project make a web app

- make a .env.local file

- put all the config variable in the .env.local file

format:
NEXT_PUBLIC_FIREBASE_{variable name in all caps}
example: 
NEXT_PUBLIC_FIREBASE_API_KEY = apiKey variable

=================== RUN ===================

run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.