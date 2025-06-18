const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
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
            alert(data.mensagem || "Paciente e sintomas cadastrados com sucesso!");
            form.reset();
        } else {
            alert(data.erro || data.mensagem || "Erro ao cadastrar.");
        }
    } catch (err) {
        console.error("Erro na requisição:", err);
        alert("Erro de conexão com o servidor. Verifique o console.");
    }
});

async function buscarPacientePorCPF() {
    const cpf = document.getElementById("cpf").value.trim();
    if (!cpf) return;

    document.querySelectorAll('input[name="sintomas"]').forEach((checkbox) => {
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
                document.querySelector('input[name="genero"]:checked').checked = false;
            }
            console.log("Paciente não encontrado ou erro na API.");
            return;
        }

        const data = await res.json();

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
        console.log("Erro ao buscar paciente: " + err);
    }
}
