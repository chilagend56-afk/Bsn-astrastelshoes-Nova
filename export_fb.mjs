import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import fs from 'fs';

const fbConfig = {
  apiKey: "AIzaSyD6xvtf7GRiCz0CazRTf9WNmHfWYbMDvlI",
  authDomain: "gen-lang-client-0469091192.firebaseapp.com",
  projectId: "gen-lang-client-0469091192",
  storageBucket: "gen-lang-client-0469091192.firebasestorage.app",
  messagingSenderId: "935651895215",
  appId: "1:935651895215:web:5b9bc814c7eb4a7508f15a"
};

const app = initializeApp(fbConfig);
const db = getFirestore(app, "ai-studio-youngdangote-efb78bfb-65ca-4b2c-934d-94b9b3c0ea2d");

async function run() {
  const data = {};
  
  // Products
  const prodSnap = await getDocs(collection(db, 'products'));
  data.products = prodSnap.docs.map(d => ({id: d.id, ...d.data()}));
  
  // Users
  const userSnap = await getDocs(collection(db, 'users'));
  data.users = userSnap.docs.map(d => ({id: d.id, ...d.data()}));
  
  // Orders
  const orderSnap = await getDocs(collection(db, 'orders'));
  data.orders = orderSnap.docs.map(d => ({id: d.id, ...d.data()}));
  
  // Settings
  const settingsSnap = await getDoc(doc(db, 'settings', 'system_config'));
  if (settingsSnap.exists()) {
    data.settings = settingsSnap.data();
  }
  
  fs.writeFileSync('fb_data.json', JSON.stringify(data, null, 2));
  console.log('Exported data');
  process.exit(0);
}
run();
