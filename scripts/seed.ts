import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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
const auth = getAuth(app);

async function setup() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "admin@novastore.com", "Admin@123");
    await setDoc(doc(db, "users", userCredential.user.uid), {
      role: "superadmin",
      name: "Super Admin",
      email: "admin@novastore.com",
      createdAt: new Date().toISOString()
    });
    console.log("Super Admin created successfully!");
    
    // Create categories
    const categories = [
      "Smartphones", "iPhones", "Samsung", "Tecno", "Infinix", "Xiaomi", "Google Pixel",
      "Laptops", "Tablets", "Smart Watches", "AirPods", "Accessories", "Gaming", "Power Banks", "Chargers", "Others"
    ];
    for (const cat of categories) {
      await setDoc(doc(db, "categories", cat.toLowerCase().replace(/ /g, '-')), {
        name: cat,
        icon: "Package"
      });
    }
    console.log("Categories created!");
  } catch (error) {
    console.error("Error setting up:", error);
  }
  process.exit(0);
}

setup();
