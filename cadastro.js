// cadastro.js
import { auth, db } from "./firebase.js";

import { createUserWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, setDoc } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("formCadastro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const role = document.getElementById("role").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    await setDoc(doc(db, "users", cred.user.uid), {
      nome,
      email,
      role
    });

    alert("Usuário cadastrado com sucesso!");
    window.location.href = "login.html";

  } catch (err) {
    alert("Erro: " + err.message);
  }
});
