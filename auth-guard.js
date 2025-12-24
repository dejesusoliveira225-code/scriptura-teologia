import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Protege página por perfil
 * @param {string} roleEsperado
 */
export function proteger(roleEsperado) {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      alert("Usuário sem perfil definido!");
      await signOut(auth);
      window.location.href = "login.html";
      return;
    }

    const role = snap.data().role;

    if (role !== roleEsperado) {
      alert("Acesso não autorizado!");
      window.location.href = "login.html";
    }
  });
}

/**
 * Logout padrão
 */
export async function sair() {
  await signOut(auth);
  window.location.href = "login.html";
}