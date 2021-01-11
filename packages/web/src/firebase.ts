import firebase from 'firebase/app';
import 'firebase/auth';

// 初期化は一度だけ
if (!firebase.apps.length) {
  const firebaseConfig = {
    /* firebase config */
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
  };
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
