import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize firebase-admin
admin.initializeApp({
  projectId: "gen-lang-client-0469091192"
});

const auth = getAuth();

// Instantiate Firestore with custom databaseId
const firestoreDb = getFirestore();

async function run() {
  const email = 'bchase5677@gmail.com';
  const password = 'Himaryam1';
  try {
    let uid = '';
    try {
      const user = await auth.getUserByEmail(email);
      uid = user.uid;
      console.log('User found with UID:', uid);
      await auth.updateUser(uid, {
        password: password,
      });
      console.log('Successfully updated password!');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'messaging/user-not-found') {
        const user = await auth.createUser({
          email: email,
          password: password,
        });
        uid = user.uid;
        console.log('Successfully created user with UID:', uid);
      } else {
        throw err;
      }
    }

    // Now write to Firestore
    await firestoreDb.doc(`users/${uid}`).set({
      role: 'superadmin',
      name: 'Super Admin',
      email: email,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log('Successfully written superadmin role to Firestore!');
  } catch (error) {
    console.error('Operation failed:', error);
  }
  process.exit(0);
}

run();
