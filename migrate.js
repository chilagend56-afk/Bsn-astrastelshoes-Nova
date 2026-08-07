import { initializeApp as initApp1 } from "firebase/app";
import { getFirestore as getDB1, collection as col1, getDocs as getDocs1 } from "firebase/firestore";

const oldConfig = {
  apiKey: "AIzaSyD6xvtf7GRiCz0CazRTf9WNmHfWYbMDvlI",
  authDomain: "gen-lang-client-0469091192.firebaseapp.com",
  projectId: "gen-lang-client-0469091192",
  storageBucket: "gen-lang-client-0469091192.firebasestorage.app",
  messagingSenderId: "935651895215",
  appId: "1:935651895215:web:5b9bc814c7eb4a7508f15a"
};

const app1 = initApp1(oldConfig, "old");
const db1 = getDB1(app1, "ai-studio-youngdangote-efb78bfb-65ca-4b2c-934d-94b9b3c0ea2d");

async function run() {
  try {
    const snap = await getDocs1(col1(db1, "products"));
    console.log("Success! Read " + snap.size + " docs.");
  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
