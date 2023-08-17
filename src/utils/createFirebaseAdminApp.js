import admin from 'firebase-admin';
// import serviceAccount from "./serviceAccountKey.json";

export function createFirebaseAdminApp() {

  // if already created, return the same instance
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // initialize admin app
  return admin.initializeApp({
    credential: admin.credential.cert(env("SERVICE")),
  });
}