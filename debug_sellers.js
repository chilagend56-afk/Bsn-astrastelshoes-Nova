import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
  const snap = await getDocs(collection(db, 'sellers'));
  snap.forEach(doc => {
    console.log(doc.id, "=>", JSON.stringify(doc.data()));
  });
  process.exit(0);
}
run();
