// Quick Firebase check script
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDKhyJl15r0jIT2pb3cLcjoCbGdIPoH2Ok",
  authDomain: "spark-antigravity.firebaseapp.com",
  projectId: "spark-antigravity",
  storageBucket: "spark-antigravity.firebasestorage.app",
  messagingSenderId: "997177904978",
  appId: "1:997177904978:web:8d3e8daef1273f5d97348b",
};

const CURRENT_USER_ID = "C2Gn2dhaYtgDta1rlRQJ5ItqVh83";

async function checkFirebase() {
  try {
    console.log('🔥 Connecting to Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log(`📂 Checking path: users/${CURRENT_USER_ID}/personalItems`);
    const itemsRef = collection(db, `users/${CURRENT_USER_ID}/personalItems`);
    const snapshot = await getDocs(itemsRef);

    console.log(`✅ Found ${snapshot.docs.length} items:`);
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - [${data.type}] ${data.title || data.content?.slice(0, 30) || 'No title'}`);
    });

    if (snapshot.docs.length === 0) {
      console.log('\n⚠️  No items found. Possible reasons:');
      console.log('  1. The collection path might be different in your n8n workflow');
      console.log('  2. No data has been created yet');
      console.log('  3. Firebase rules might be blocking reads');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Firebase Error:', error.message);
    process.exit(1);
  }
}

checkFirebase();
