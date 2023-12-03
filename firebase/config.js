import admin from 'firebase-admin';
import dotenv from 'dotenv';
import {getAuth} from 'firebase-admin/auth'
import {getDatabase} from 'firebase-admin/database'
dotenv.config();

const adminIntialize = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY
      ? process.env.PRIVATE_KEY.replace(/\\n/gm, '\n')
      : undefined,
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: process.env.DATABASE_URL,
});

const auth = getAuth(adminIntialize);
const db = getDatabase(adminIntialize);

export default { auth, db, adminIntialize }