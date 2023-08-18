import admin from 'firebase-admin';



export function createFirebaseAdminApp() {
  // if already created, return the same instance
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // initialize admin app
  return admin.initializeApp({
    credential: admin.credential.cert({
      "type": "service_account",
      "project_id": "budget-app-41b22",
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": process.env.PRIVATE_KEY,
      "client_email": "firebase-adminsdk-c5ubz@budget-app-41b22.iam.gserviceaccount.com",
      "client_id": "101535047832738988017",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-c5ubz%40budget-app-41b22.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com"
    }),
  });
}