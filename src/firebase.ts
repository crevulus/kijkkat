import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "kijkkat-meow.firebaseapp.com",
  projectId: "kijkkat-meow",
  storageBucket: "kijkkat-meow.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSENGER_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID
      : "",
};

export const firebaseApp = initializeApp(firebaseConfig);
getAnalytics(firebaseApp);
