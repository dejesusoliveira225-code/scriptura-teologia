document.getElementById("formulario-contato").addEventListener("submit", function(e) {
    e.preventDefault();

    const url = "URL_DO_WEB_APP_AQUI"; // coloque sua URL aqui

    const formData = new FormData(this);

    fetch(url, {
        method: "POST",
        body: formData
    })
    .then(r => r.json())
    .then(res => {
        if(res.status === "OK") {
            alert("Formulário enviado com sucesso!");
            document.getElementById("formulario-contato").reset();
        } else {
            alert("Erro ao enviar!");
        }
    })
    .catch(err => {
        alert("Falha na conexão.");
        console.error(err);
    });
});