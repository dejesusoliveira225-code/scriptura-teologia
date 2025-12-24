import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");

  try {
    const cred = await signInWithEmailAndPassword(auth, emailInput.value, senhaInput.value);

    const uid = cred.user.uid;
    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
      alert("Usuário sem função registrada!");
      return;
    }


const role = snap.data().role;

if (role === "admin") {
  location.href = "admin.html";
} else if (role === "professor") {
  location.href = "dashboard-professor.html";
} else if (role === "aluno") {
  location.href = "dashboard-aluno.html";
} else {
  alert("Papel de usuário desconhecido.");
}

  } catch (err) {
    alert("Login inválido");
  }
});