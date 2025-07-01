async function buscarPacientePorCPF() {
    console.log("-> Buscando paciente por CPF...");
    const cpf = document.getElementById("cpf").value.trim();
    if (!cpf) return;

    document.querySelectorAll('input[name="sintomas"]:checked').forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event("change"));
    });

    try {
        const res = await fetch(`http://127.0.0.1:5000/paciente/${cpf}`);

        if (!res.ok) {
            if (res.status === 404) {
                document.getElementById("nome").value = "";
                document.getElementById("nascimento").value = "";
                document.getElementById("cep").value = "";
                document.getElementById("telefone").value = "";
                document.querySelector('input[name="genero"][value="feminino"]').checked = true;
            }
            console.log("-> Paciente não encontrado ou erro na API.");
            return;
        }

        const data = await res.json();
        console.log("-> Dados do paciente recebidos:", data);

        document.getElementById("nome").value = data.nome || "";
        document.getElementById("nascimento").value = data.nascimento || "";
        document.getElementById("cep").value = data.cep || "";
        document.getElementById("telefone").value = data.telefone || "";

        const generoMap = {
            feminino: "feminino",
            masculino: "masculino",
            outro: "outro",
            "prefiro não informar": "nao_informar",
        };
        const generoValue = generoMap[data.sexo.toLowerCase()];
        if (generoValue) {
            document.querySelector(`input[name="genero"][value="${generoValue}"]`).checked = true;
        }
    } catch (err) {
        console.error("-> Erro na requisição de busca de paciente: " + err);
    }
}

const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector(".botao");
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Classificando...";
    submitButton.disabled = true;

    const nome = document.getElementById("nome").value;
    const sexoMap = {
        feminino: "feminino",
        masculino: "masculino",
        outro: "outro",
        nao_informar: "prefiro não informar",
    };
    const sexoSelecionado = document.querySelector('input[name="genero"]:checked').value;
    const sexo = sexoMap[sexoSelecionado];
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const nascimento = document.getElementById("nascimento").value;
    const cep = document.getElementById("cep").value;

    const paciente = { nome, sexo, cpf, telefone, nascimento, cep };

    const sintomasSelecionados = document.querySelectorAll('input[name="sintomas"]:checked');
    const sintomasParaEnviar = [];
    sintomasSelecionados.forEach((checkbox) => {
        const sintomaNome = checkbox.value;
        const slider = document.getElementById(`gravidade-${sintomaNome.replace(/\s+/g, "-")}`);
        sintomasParaEnviar.push({
            nome: sintomaNome,
            gravidade: parseInt(slider.value, 10),
        });
    });

    const dadosCompletosParaApi = {
        ...paciente,
        sintomas: sintomasParaEnviar,
    };

    try {
        const res = await fetch("http://127.0.0.1:5000/paciente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosCompletosParaApi),
        });

        const data = await res.json();

        if (res.ok) {
            const { prioridade } = data;
            const url = `./result/resultado.html?prioridade=${encodeURIComponent(prioridade.prioridade)}&tempo=${encodeURIComponent(prioridade.tempo_espera)}`;
            window.location.href = url;
        } else {
            alert(data.erro || "Erro ao cadastrar paciente.");
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    } catch (err) {
        console.error("-> Erro na submissão do formulário:", err);
        alert("Erro de conexão com o servidor.");
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});
