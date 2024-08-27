
# Ponder

This is my project for my CU2 in Forward College

An app that monitor the condition of a livestock pond. Using ThingsBoard IoT gateway to upload the data from sensor and send it to the app

Made by using:
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)     
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)
## Clone

```bash
git clone https://github.com/ThatFit3/ponder.git
```
## Setup

- create a firebase project and a firestore database

- in the project make a web app

- make a .env.local file

- put all the config variable in the .env.local file

> [!NOTE]
> format:
    NEXT_PUBLIC_FIREBASE_{variable name in all caps}
> [!NOTE]
> example: 
    NEXT_PUBLIC_FIREBASE_API_KEY = apiKey variable

## Run

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