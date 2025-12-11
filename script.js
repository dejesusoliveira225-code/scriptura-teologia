const script_do_google = 'https://script.google.com/macros/s/AKfycbwbbzjEmxLScBpq7k8eQQIVmx28p-Uh-CxwZJ5lsIeIByusfQ_5q2Kkoaa8LdvRJOw2/exec'
const dados_do_formulario = document.forms['formulario-contato'];

dados_do_formulario.addEventlistener('submit', function (e) {
    e.preventDefault();

    fetch(script_do_google, { method: 'POST', body: new FormData(dados_do_formulario) })
    .then(Response => {
        // se os dados forem gravados corretamente, será enviada uma menssagem de sucesso
        alert('Matricula enviados com sucesso!', Response);
        dados_do_formulario.reset();
    })
    .catch(error =>
        //se houver erro no envio, a mensagem abaixo sera enviada
        console.error('Erro no envio de sua Matricula', error));

});