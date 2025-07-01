const mapeamentoPrioridade = {
    Emergência: {
        corClasse: "cor-vermelho",
        iconeClasse: "fa-heart-pulse",
    },
    "Muito Urgente": {
        corClasse: "cor-laranja",
        iconeClasse: "fa-triangle-exclamation",
    },
    Urgente: {
        corClasse: "cor-amarelo",
        iconeClasse: "fa-circle-exclamation",
    },
    "Pouco Urgente": {
        corClasse: "cor-verde",
        iconeClasse: "fa-circle-info",
    },
    "Não Urgente": {
        corClasse: "cor-azul",
        iconeClasse: "fa-circle-check",
    },
};

function exibirResultado(prioridade, tempoEspera) {
    const container = document.getElementById("container-resultado");
    const config = mapeamentoPrioridade[prioridade];

    if (!config) {
        container.innerHTML = `<p>Erro: Classificação "${prioridade}" não reconhecida.</p>`;
        return;
    }

    const cardHTML = `
        <div class="card-resultado">
            <div class="card-header ${config.corClasse}">
                <i class="fa-solid ${config.iconeClasse}"></i>
                <h2>${prioridade}</h2>
            </div>
            <div class="card-body">
                <p>Nível de Prioridade:</p>
                <h3>${prioridade}</h3>
                <p><strong>Tempo de espera estimado:</strong></p>
                <p id="card-tempo-espera">${tempoEspera}</p>
            </div>
        </div>
    `;

    container.innerHTML = cardHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);

    const prioridade = urlParams.get("prioridade");
    const tempoEspera = urlParams.get("tempo");

    if (prioridade && tempoEspera) {
        exibirResultado(prioridade, tempoEspera);
    } else {
        document.getElementById("container-resultado").innerHTML = "<p>Nenhum dado de triagem foi encontrado.</p>";
    }
});
