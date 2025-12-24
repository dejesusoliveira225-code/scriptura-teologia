// admin-dashboard.js (Vincule este arquivo ao seu admin.html)
import { proteger, sair } from "./auth-guard.js";

// Garante que apenas usuários com role 'admin' visualizem esta página
proteger("admin");

document.getElementById("btnSair").addEventListener("click", () => {
  sair();
});