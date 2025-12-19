import { db } from "./firebase.js";
import { proteger, sair } from "./auth-guard.js";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

proteger("professor");

/* =========================
    VÍDEO AULAS
========================= */

const listaVideos = document.getElementById("listaVideos");

async function carregarVideos() {
  listaVideos.innerHTML = "";

  const snap = await getDocs(collection(db, "videoaulas"));

  snap.forEach(v => {
    const aula = v.data();

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${aula.titulo}</strong><br>
      ${aula.descricao}<br>
      <a href="${aula.url}" target="_blank">Assistir</a><br>
      <button onclick="excluirVideo('${v.id}')">Excluir</button>
    `;
    listaVideos.appendChild(li);
  });
}

document.getElementById("formVideo")?.addEventListener("submit", async e => {
  e.preventDefault();

  const titulo = document.getElementById("tituloVideo").value;
  const descricao = document.getElementById("descVideo").value;
  const url = document.getElementById("urlVideo").value;

  if (!url.includes("youtube") && !url.includes("youtu.be")) {
    alert("Insira um link válido do YouTube!");
    return;
  }

  await addDoc(collection(db, "videoaulas"), {
    titulo,
    descricao,
    url
  });

  alert("Vídeo publicado!");
  carregarVideos();
});

window.excluirVideo = async (id) => {
  if (confirm("Remover vídeo?")) {
    await deleteDoc(doc(db, "videoaulas", id));
    carregarVideos();
  }
};


/* =========================
      LANÇAMENTO DE NOTAS
========================= */

const listaNotas = document.getElementById("listaNotas");
const alunosList = document.getElementById("alunosList");
const listaAlunos = document.getElementById("listaAlunos");
const paginacao = document.getElementById("paginacao");

let alunosCadastrados = [];
let todasNotas = [];
let paginaAtual = 1;
const porPagina = 5;

async function carregarAlunos() {
  const snap = await getDocs(collection(db, "users"));

  alunosList.innerHTML = "";
  listaAlunos.innerHTML = "";
  alunosCadastrados = [];

  snap.forEach(d => {
    const data = d.data();
    if (data.role === "aluno") {
      alunosCadastrados.push(data.nome);

      alunosList.innerHTML += `<option value="${data.nome}">`;

      const li = document.createElement("li");
      li.textContent = data.nome;
      li.onclick = () => document.getElementById("aluno").value = data.nome;
      listaAlunos.appendChild(li);
    }
  });
}

async function carregarNotas() {
  listaNotas.innerHTML = "";
  todasNotas = [];

  const snap = await getDocs(collection(db, "notas"));
  snap.forEach(n => todasNotas.push({ id: n.id, ...n.data() }));

  todasNotas.sort((a, b) => a.disciplina.localeCompare(b.disciplina));

  desenharPagina();
}

function desenharPagina() {
  listaNotas.innerHTML = "";
  paginacao.innerHTML = "";

  const inicio = (paginaAtual - 1) * porPagina;
  const fim = inicio + porPagina;

  const pagina = todasNotas.slice(inicio, fim);

  pagina.forEach(n => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${n.aluno}</strong> - ${n.disciplina}: ${n.nota}
      <br>Comentário: ${n.comentario || "Nenhum comentário"}
      <br>
      <button onclick="editarNota('${n.id}', '${n.aluno}', '${n.disciplina}', '${n.nota}', \`${n.comentario || ""}\`)">Editar</button>
      <button onclick="excluirNota('${n.id}')">Excluir</button>
    `;
    listaNotas.appendChild(li);
  });

  const totalPaginas = Math.ceil(todasNotas.length / porPagina);

  if (totalPaginas > 1) {
    if (paginaAtual > 1) {
      paginacao.innerHTML += `<button onclick="mudarPag(${paginaAtual - 1})">Anterior</button>`;
    }
    if (paginaAtual < totalPaginas) {
      paginacao.innerHTML += `<button onclick="mudarPag(${paginaAtual + 1})">Próxima</button>`;
    }
  }
}

window.mudarPag = (p) => {
  paginaAtual = p;
  desenharPagina();
};

document.getElementById("notaForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  const aluno = document.getElementById("aluno").value;
  const disciplina = document.getElementById("disciplina").value;
  const nota = parseFloat(document.getElementById("nota").value);
  const comentario = document.getElementById("comentario").value;

  if (!alunosCadastrados.includes(aluno)) {
    alert("ALUNO INEXISTENTE!");
    return;
  }

  await addDoc(collection(db, "notas"), {
    aluno,
    disciplina,
    nota,
    comentario
  });

  alert("Lançada!");
  carregarNotas();
});

window.excluirNota = async (id) => {
  if (confirm("Excluir?")) {
    await deleteDoc(doc(db, "notas", id));
    carregarNotas();
  }
};

window.editarNota = async (id, alunoAtual, disciplinaAtual, notaAtual, comentarioAtual) => {
  const novoAluno = prompt("Aluno:", alunoAtual);
  if (!alunosCadastrados.includes(novoAluno)) return alert("Aluno inválido!");

  const novaDisciplina = prompt("Disciplina:", disciplinaAtual);
  const novaNota = prompt("Nota:", notaAtual);
  const novoComentario = prompt("Comentário:", comentarioAtual);

  await updateDoc(doc(db, "notas", id), {
    aluno: novoAluno,
    disciplina: novaDisciplina,
    nota: parseFloat(novaNota),
    comentario: novoComentario
  });

  carregarNotas();
};


/* =========================
     BOTÃO SAIR
========================= */

window.logout = sair;


/* =========================
  CARREGAMENTOS INICIAIS
========================= */

carregarVideos();
carregarAlunos();
carregarNotas();
