import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
