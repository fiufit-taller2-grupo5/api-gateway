import * as dotenv from 'dotenv';
import firebase from 'firebase-admin';
import serviceAccount from './credentials.json';
dotenv.config();

const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount as firebase.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

export default firebaseApp;