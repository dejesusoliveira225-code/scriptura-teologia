import { auth, db } from "./firebase.js";
import { proteger, sair } from "./auth-guard.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

proteger("aluno");

let notasAluno = [];
let nomeAluno = "";
let paginaAtual = 1;
const porPagina = 5;

const lista = document.getElementById("lista");
const paginacao = document.getElementById("paginacao");
const graficoCanvas = document.getElementById("grafico").getContext("2d");
let grafico = null;
const listaVideos = document.getElementById("listaVideos");

auth.onAuthStateChanged(async user => {
  const snapUser = await getDoc(doc(db, "users", user.uid));
  nomeAluno = snapUser.data().nome;

  const q = query(collection(db, "notas"), where("aluno", "==", nomeAluno));
  const snap = await getDocs(q);

  notasAluno = [];
  snap.forEach(d => notasAluno.push(d.data()));

  notasAluno.sort((a, b) => a.disciplina.localeCompare(b.disciplina));

  desenharPagina();
  gerarGrafico();
  carregarVideos();
});

function desenharPagina(){
  lista.innerHTML = "";
  paginacao.innerHTML = "";

  const inicio = (paginaAtual - 1) * porPagina;
  const fim = inicio + porPagina;
  const page = notasAluno.slice(inicio, fim);

  page.forEach(n => {
    lista.innerHTML += `<li>${n.disciplina}: ${n.nota} — ${n.comentario || "Sem comentário"}</li>`;
  });

  let total = Math.ceil(notasAluno.length / porPagina);

  if(total > 1){
    if(paginaAtual > 1)
      paginacao.innerHTML += `<button onclick="mudarPag(${paginaAtual-1})">Anterior</button>`;
    if(paginaAtual < total)
      paginacao.innerHTML += `<button onclick="mudarPag(${paginaAtual+1})">Próxima</button>`;
  }
}

window.mudarPag = (p) => {
  paginaAtual = p;
  desenharPagina();
  gerarGrafico();
};

function gerarGrafico(){
  if(grafico) grafico.destroy();

  grafico = new Chart(graficoCanvas, {
    type: "bar",
    data: {
      labels: notasAluno.map(n => n.disciplina),
      datasets: [{
        label: "Notas",
        data: notasAluno.map(n => n.nota)
      }]
    }
  });
}

async function carregarVideos(){
  listaVideos.innerHTML = "";

  const snap = await getDocs(collection(db, "videoaulas"));

  snap.forEach(v => {
    const aula = v.data();
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${aula.titulo}</strong><br>
      ${aula.descricao}<br>
      <iframe width="300" height="200"
        src="${aula.url.replace("watch?v=", "embed/")}"
        frameborder="0" allowfullscreen></iframe>
    `;

    listaVideos.appendChild(li);
  });
}

document.getElementById("btnPDF").onclick = () => {
  const { jsPDF } = window.jspdf;
  const docPDF = new jsPDF();

  docPDF.setFontSize(16);
  docPDF.text(`Boletim - ${nomeAluno}`, 10, 10);

  let y = 20;

  notasAluno.forEach(n => {
    docPDF.text(`${n.disciplina}: ${n.nota}`, 10, y);
    docPDF.text(`Comentário: ${n.comentario || "Sem"}`, 10, y+6);
    y += 12;
  });

  const img = graficoCanvas.canvas.toDataURL();
  docPDF.addImage(img, "PNG", 10, y, 180, 80);

  docPDF.save(`boletim-${nomeAluno}.pdf`);
};

window.logout = sair;
