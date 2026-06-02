// Firestore 콜드 연결 + guestbook 읽기 지연 측정 진단
import { initializeApp, deleteApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const config = {
  apiKey: "AIzaSyDtIb4PavgrghQTSrca9SjV6quiXDDcTF8",
  authDomain: "sesame-ramyun-yoohoo-v1.firebaseapp.com",
  projectId: "sesame-ramyun-yoohoo-v1",
  storageBucket: "sesame-ramyun-yoohoo-v1.firebasestorage.app",
  messagingSenderId: "855063820045",
  appId: "1:855063820045:web:6fd7b23e806654bd676244",
};

async function measure(label, makeDb) {
  const app = initializeApp(config, label);
  const db = makeDb(app);
  const t0 = Date.now();
  try {
    const snap = await getDocs(query(collection(db, "guestbook"), orderBy("createdAt", "desc")));
    const t1 = Date.now();
    console.log(`[${label}] guestbook ${snap.size} docs in ${t1 - t0}ms (cold connect + query)`);
    // 2번째 쿼리(웜)
    const t2 = Date.now();
    await getDocs(query(collection(db, "guestbook"), orderBy("createdAt", "desc")));
    console.log(`[${label}] warm query: ${Date.now() - t2}ms`);
  } catch (e) {
    console.log(`[${label}] ERROR: ${e.code || e.message}`);
  }
  await deleteApp(app);
}

(async () => {
  // 기본 전송(WebChannel/streaming)
  await measure("default", (app) => getFirestore(app));
  // long-polling 자동감지 활성화
  await measure("autoDetectLongPolling", (app) =>
    initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
  );
  // long-polling 강제
  await measure("forceLongPolling", (app) =>
    initializeFirestore(app, { experimentalForceLongPolling: true })
  );
  process.exit(0);
})();
