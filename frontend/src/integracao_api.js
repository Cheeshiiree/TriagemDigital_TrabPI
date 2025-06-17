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
