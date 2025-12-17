import { auth } from "./firebase.js";

export function proteger(tipo) {
  auth.onAuthStateChanged(user => {
    if (!user) {
      location.href = "login.html";
    }
  });
}

export function sair() {
  auth.signOut();
  location.href = "login.html";
}
