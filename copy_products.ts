import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6xvtf7GRiCz0CazRTf9WNmHfWYbMDvlI",
  projectId: "gen-lang-client-0469091192",
};

const app = initializeApp(firebaseConfig);
const oldDb = getFirestore(app, "ai-studio-novastore-1d5e1639-56b6-472b-9e92-9bdc5548c695");
const newDb = getFirestore(app, "ai-studio-youngdangote-efb78bfb-65ca-4b2c-934d-94b9b3c0ea2d");

async function run() {
  console.log("Fetching products from old db...");
  const products = await getDocs(collection(oldDb, "products"));
  console.log(`Found ${products.docs.length} products. Copying to new db...`);
  
  for (const p of products.docs) {
    await setDoc(doc(newDb, "products", p.id), p.data());
  }
  
  console.log("Setting up settings in new db...");
  await setDoc(doc(newDb, "settings", "system_config"), {
    siteName: 'Young Dangote Tech Hub',
    tagline: 'Tech Hub',
    contactEmail: 'ydangote1@gmail.com',
    whatsappNumber: '08146516003',
    deliveryCost: 1500,
    logoUrl: '',
    currency: '₦',
    taxRate: 7.5,
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    aboutUsText: ''
  });
  
  console.log("Done");
  process.exit(0);
}
run().catch(console.error);
