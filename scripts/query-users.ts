import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6xvtf7GRiCz0CazRTf9WNmHfWYbMDvlI",
  authDomain: "gen-lang-client-0469091192.firebaseapp.com",
  projectId: "gen-lang-client-0469091192",
  storageBucket: "gen-lang-client-0469091192.firebasestorage.app",
  messagingSenderId: "935651895215",
  appId: "1:935651895215:web:5b9bc814c7eb4a7508f15a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-novastore-1d5e1639-56b6-472b-9e92-9bdc5548c695");

async function run() {
  try {
    const q = query(collection(db, "users"), where("email", "==", "bchase5677@gmail.com"));
    const snap = await getDocs(q);
    if (snap.empty) {
      console.log("No user document found for bchase5677@gmail.com in Firestore");
    } else {
      snap.forEach(doc => {
        console.log(`Found Firestore user document: ID=${doc.id}, Data=`, doc.data());
      });
    }

    // Also list all users in Firestore to see what's there
    console.log("Listing some existing users in Firestore...");
    const allSnap = await getDocs(collection(db, "users"));
    allSnap.forEach(doc => {
      console.log(`User ID=${doc.id}, Email=${doc.data().email}, Role=${doc.data().role}`);
    });

  } catch (error) {
    console.error("Firestore query failed:", error);
  }
  process.exit(0);
}

run();
