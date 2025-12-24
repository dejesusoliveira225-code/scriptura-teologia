import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async user => {
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));

  if (!snap.exists()) return;

  const role = snap.data().role;

  if (role === "admin") {
    window.location.href = "admin.html";
  }
  else if (role === "professor") {
    window.location.href = "dashboard-professor.html";
  }
  else if (role === "aluno") {
    window.location.href = "dashboard-aluno.html";
  }
});