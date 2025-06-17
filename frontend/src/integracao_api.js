const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const sexoMap = {
        feminino: "Feminino",
        masculino: "Masculino",
        outro: "Outro",
        nao_informar: "Prefiro não informar",
    };

    const sexoSelecionado = document.querySelector('input[name="genero"]:checked').value;
    const sexo = sexoMap[sexoSelecionado];
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const nascimento = document.getElementById("nascimento").value;
    const cep = document.getElementById("cep").value;

    const paciente = { nome, sexo, cpf, telefone, nascimento, cep };

    try {
        const res = await fetch("http://127.0.0.1:5000/paciente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paciente),
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.mensagem || "Paciente cadastrado com sucesso!");
        } else {
            alert(data.erro || "Erro ao cadastrar paciente.");
        }
    } catch (err) {
        console.error("Erro:", err);
        alert("Erro na conexão com o servidor.");
    }
});

async function buscarPacientePorCPF() {
    const cpf = document.getElementById("cpf").value.trim();

    if (!cpf) return;

    try {
        const res = await fetch(`http://127.0.0.1:5000/paciente/${cpf}`);

        if (!res.ok) {
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
        console.log("err: " + err);
    }
}
