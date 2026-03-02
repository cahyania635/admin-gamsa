import { initializeApp, getApps, cert, type ServiceAccount, type App } from 'firebase-admin/app';
import { getDatabase, type Database } from 'firebase-admin/database';

let app: App | undefined;
let db: Database | undefined;

function getFirebaseApp(): App {
  if (app) return app;

  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY is not set. Please check your .env.local file.'
    );
  }

  const serviceAccount: ServiceAccount = JSON.parse(key);

  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } else {
    app = getApps()[0];
  }

  return app;
}

export function getDB(): Database {
  if (db) return db;
  db = getDatabase(getFirebaseApp());
  return db;
}
