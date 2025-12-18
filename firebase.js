import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfsxPd_zrBwNf1qKmy6AzcIGjYC0A80Kk",
  authDomain: "notas-alunos-fedb3.firebaseapp.com",
  projectId: "notas-alunos-fedb3",
  storageBucket: "notas-alunos-fedb3.appspot.com",
  messagingSenderId: "636084260578",
  appId: "1:636084260578:web:452c8fa35aa2286520d8bb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
