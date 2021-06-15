// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/analytics";
import "firebase/performance";

// require('dotenv').config();


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArRHFXmzZQ0XEaqYozeotIH286G0QCAxU",
  authDomain: "react-firebase-site-template.firebaseapp.com",
  databaseURL: "https://react-firebase-site-template-default-rtdb.firebaseio.com",
  projectId: "react-firebase-site-template",
  storageBucket: "react-firebase-site-template.appspot.com",
  messagingSenderId: "62247076443",
  appId: "1:62247076443:web:9ded6d00800f7a68adf57e",
  measurementId: "G-5876511K6S"
};
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID
// };

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.emailAuthProvider = app.auth.EmailAuthProvider;
    this.auth = app.auth();
    this.db = app.database();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.analytics = app.analytics();
    this.performance = app.performance();
  }
  // *** Auth API - Create Account ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  // *** Auth API - EmailAuthProvider ***
  EmailAuthProviderCredential = (email, password) =>
    this.emailAuthProvider.credential(email, password);

  // *** Auth API - Sign In ***
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  // *** AUTH API - Sign In With Google ***
  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  // *** Auth API - UpdateUser
  updateProfile = ({ displayName, phoneNumber }) =>
    this.auth.currentUser.updateProfile({
      displayName: displayName,
      phoneNumber: phoneNumber,
    });

  // *** AUTH API - currentUser
  currentUser = () => this.auth.currentUser;

  // *** Auth API - Sign In ***
  doSignOut = () => this.auth.signOut();

  // *** Auth API - Password Reset ***
  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  // *** Auth API - Password Update ***
  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(async (authUser) => {
      const timeout = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
      if (authUser) {
        
        const userRef = this.user(authUser.uid);
        await timeout(1000);
        console.log('i waited')
        const userGet = await userRef.get();
        const dbUser = await userGet.val();
        if (dbUser === null) {
          fallback();
        } else {
          if (!Object.prototype.hasOwnProperty.call(dbUser, "roles")) {
            dbUser.roles = {};
          }
          authUser = {
            uid: authUser.uid,
            email: authUser.email,
            metadata: authUser.metadata,
            displayName: authUser.displayName,
            providerData: authUser.providerData[0],
            ...dbUser,
          };
          next(authUser);
        }
      } else {
        fallback();
      }
    });

  // *** User API - UID Ref ***
  user = (uid) => this.db.ref(`users/${uid}`);

  // *** User API - all Users ***
  users = () => this.db.ref("users");

}

export default Firebase;
