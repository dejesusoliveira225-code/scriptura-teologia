import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("formCadastro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const role = document.getElementById("role").value; // Captura 'admin', 'professor' ou 'aluno'

  try {
    // 1. Cria o usuário no Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    // 2. Salva os dados adicionais no Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      nome: nome,
      email: email,
      role: role,
      createdAt: new Date().toISOString()
    });

    alert("Usuário " + role + " cadastrado com sucesso!");
    window.location.href = "admin.html";

  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar: " + err.message);
  }
});