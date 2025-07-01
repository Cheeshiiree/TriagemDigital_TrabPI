document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btn-buscar-cpf');
    const formTriagem = document.getElementById('form-triagem');
    const dadosPacienteExistente = document.getElementById('dados-paciente-existente');
    const formNovoPaciente = document.getElementById('form-novo-paciente');
    const formEmergenciaSemCadastro = document.getElementById('form-emergencia-sem-cadastro');
    const checkboxEmergencia = document.getElementById('emergencia-sem-cadastro');
    const cpfBuscaInput = document.getElementById('cpf-busca');
    const sintomasCategoriasDiv = document.getElementById('sintomasCategorias');
    const doencaSelect = document.getElementById('doencaSelect');

    const API_URL = 'http://127.0.0.1:5000';

    // --- BASE DE DADOS DE DOENÇAS/CID E SINTOMAS ASSOCIADOS ---
    const cidParaSintomas = {
        "J11 - Gripe (Influenza)": {
            sintomas: ["Tosse", "Febre", "Dor de Garganta", "Dor Muscular", "Cansaço", "Dor de Cabeça"],
            gravidadePadrao: 5
        },
        "K29 - Gastrite": {
            sintomas: ["Dor Abdominal", "Náusea", "Vômito", "Azia"],
            gravidadePadrao: 6
        },
        "R51 - Cefaleia (Dor de Cabeça)": {
            sintomas: ["Dor de Cabeça", "Tontura"],
            gravidadePadrao: 7
        },
        "I10 - Hipertensão Essencial": {
            sintomas: ["Dor de Cabeça", "Tontura", "Palpitações"],
            gravidadePadrao: 4
        },
        "A09 - Diarreia e gastroenterite de origem infecciosa presumível": {
            sintomas: ["Diarreia", "Dor Abdominal", "Náusea", "Vômito", "Febre"],
            gravidadePadrao: 6
        },
        "J02.9 - Faringite aguda não especificada": {
            sintomas: ["Dor de Garganta", "Dificuldade para Engolir", "Febre", "Tosse"],
            gravidadePadrao: 4
        },
        "M79.1 - Mialgia": {
            sintomas: ["Dor Muscular", "Cansaço", "Mal-estar Geral"],
            gravidadePadrao: 3
        },
        "N39.0 - Infecção do trato urinário, de localização não especificada": {
            sintomas: ["Dor ao Urinar", "Aumento da Frequência Urinária", "Febre", "Dor Abdominal"],
            gravidadePadrao: 5
        },
        "L20 - Dermatite atópica": {
            sintomas: ["Coceira", "Irritação na Pele", "Manchas na Pele", "Pele Seca"],
            gravidadePadrao: 2
        },
        "G43 - Enxaqueca": {
            sintomas: ["Dor de Cabeça Intensa", "Náusea", "Vômito", "Sensibilidade à Luz", "Sensibilidade ao Som"],
            gravidadePadrao: 8
        }
    };

    // Mapeamento de sintomas por categoria
    const sintomasPorCategoria = {
        "Sintomas Gerais": [
            "Dor de Cabeça", "Febre", "Cansaço", "Tontura", "Perda de Apetite",
            "Insônia", "Fadiga", "Mal-estar Geral"
        ],
        "Dor": [
            "Dor Abdominal", "Dor no Peito", "Dor nas Articulações", "Dor de Garganta",
            "Dor nas Costas", "Dor de Dente", "Dor Muscular"
        ],
        "Gastrointestinal": [
            "Náusea", "Vômito", "Diarreia", "Prisão de Ventre", "Azia",
            "Inchaço Abdominal", "Perda de Peso Inexplicada"
        ],
        "Respiratório": [
            "Tosse", "Falta de Ar", "Congestão Nasal", "Espirros", "Chiado no Peito",
            "Dor ao Respirar"
        ],
        "Pele e Anexos": [
            "Irritação na Pele", "Manchas na Pele", "Coceira", "Vermelhidão",
            "Feridas", "Edema (Inchaço)"
        ],
        "Neurológico": [
            "Dormência", "Formigamento", "Espasmos Musculares", "Convulsões",
            "Dificuldade de Fala", "Perda de Consciência"
        ],
        "Psicológico": [
            "Depressão", "Ansiedade", "Ataque de Pânico", "Mudanças de Humor",
            "Pensamentos Suicidas"
        ],
        "Outros": [
            "Palpitações", "Cortes", "Fraturas", "Hemorragia", "Febre Alta",
            "Lesões"
        ]
    };

    function criarSecoesDeSintomas() {
        for (const categoria in sintomasPorCategoria) {
            const details = document.createElement('details');
            if (categoria === "Sintomas Gerais") {
                details.setAttribute('open', '');
            }

            const summary = document.createElement('summary');
            summary.textContent = categoria;
            details.appendChild(summary);

            const sintomaGrid = document.createElement('div');
            sintomaGrid.classList.add('sintoma-grid');
            details.appendChild(sintomaGrid);

            sintomasPorCategoria[categoria].forEach(sintomaNome => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('sintoma-item-wrapper');

                const checkboxContainer = document.createElement('div');
                checkboxContainer.classList.add('sintoma-checkbox-container');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `sintoma-${sintomaNome.replace(/\s+/g, '-')}`;
                checkbox.value = sintomaNome;

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = sintomaNome;

                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                wrapper.appendChild(checkboxContainer);

                const sliderContainer = document.createElement('div');
                sliderContainer.classList.add('gravidade-slider-container');

                const sliderLabel = document.createElement('label');
                sliderLabel.textContent = "Gravidade (1-10):";

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '1';
                slider.max = '10';
                slider.value = '5';
                slider.id = `gravidade-${sintomaNome.replace(/\s+/g, '-')}`;

                const gravidadeValueSpan = document.createElement('span');
                gravidadeValueSpan.classList.add('gravidade-value');
                gravidadeValueSpan.textContent = slider.value;

                slider.addEventListener('input', () => {
                    gravidadeValueSpan.textContent = slider.value;
                });

                sliderContainer.appendChild(sliderLabel);
                sliderContainer.appendChild(slider);
                sliderContainer.appendChild(gravidadeValueSpan);
                wrapper.appendChild(sliderContainer);

                sintomaGrid.appendChild(wrapper);

                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        sliderContainer.style.display = 'flex';
                    } else {
                        sliderContainer.style.display = 'none';
                        slider.value = '5';
                        gravidadeValueSpan.textContent = '5';
                    }
                });
            });

            sintomasCategoriasDiv.appendChild(details);
        }
    }

    function preencherSelectDoencas() {
        for (const cid in cidParaSintomas) {
            const option = document.createElement('option');
            option.value = cid;
            option.textContent = cid;
            doencaSelect.appendChild(option);
        }
    }

    function autoselecionarSintomasPorDoenca() {
        document.querySelectorAll('.sintoma-item-wrapper input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            const sliderContainer = checkbox.closest('.sintoma-item-wrapper').querySelector('.gravidade-slider-container');
            const slider = sliderContainer.querySelector('input[type="range"]');
            const gravidadeValueSpan = sliderContainer.querySelector('.gravidade-value');

            sliderContainer.style.display = 'none';
            slider.value = '5';
            gravidadeValueSpan.textContent = '5';
        });

        const selectedCid = doencaSelect.value;
        if (selectedCid && cidParaSintomas[selectedCid]) {
            const sintomasAuto = cidParaSintomas[selectedCid].sintomas;
            const gravidadePadrao = cidParaSintomas[selectedCid].gravidadePadrao || 5;

            sintomasAuto.forEach(sintomaNome => {
                const checkboxId = `sintoma-${sintomaNome.replace(/\s+/g, '-')}`;
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = true;
                    const sliderContainer = checkbox.closest('.sintoma-item-wrapper').querySelector('.gravidade-slider-container');
                    const slider = sliderContainer.querySelector('input[type="range"]');
                    const gravidadeValueSpan = sliderContainer.querySelector('.gravidade-value');

                    slider.value = gravidadePadrao;
                    gravidadeValueSpan.textContent = gravidadePadrao;
                    sliderContainer.style.display = 'flex';
                }
            });
        }
    }

    // --- FUNÇÃO DO SISTEMA ESPECIALISTA (EXEMPLO SIMPLIFICADO) ---
    function classificarGravidadePaciente(fichaPaciente) {
        let corTriagem = "Azul"; // Padrão inicial: Não Urgente
        let setorEncaminhamento = "Clínica Geral - Ambulatório";
        let tempoEspera = "120 minutos"; // Padrão

        const sintomas = fichaPaciente.sintomas;
        const idade = fichaPaciente.dataNascimento ? (new Date().getFullYear() - new Date(fichaPaciente.dataNascimento).getFullYear()) : null;
        const motivoConsulta = fichaPaciente.motivoConsulta.toLowerCase();

        const temSintoma = (nomeSintoma, gravidadeMinima = 1) => {
            return sintomas.some(s => s.nome === nomeSintoma && s.gravidade >= gravidadeMinima);
        };

        // Regras de Prioridade (seguindo a lógica do Manchester Triage: do mais grave para o menos)
        // Cores do Manchester Triage System e seus tempos de espera máximos:
        // 1. Vermelho (Imediato): 0 minutos
        // 2. Laranja (Muito Urgente): 10 minutos
        // 3. Amarelo (Urgente): 30 minutos
        // 4. Verde (Normal): 90 minutos
        // 5. Azul (Não Urgente): 120 minutos

        // --- REGRAS VERMELHAS (IMEDIATO) ---
        if ((temSintoma("Dor no Peito", 9) && temSintoma("Falta de Ar", 9)) ||
            motivoConsulta.includes("perda de consciência") ||
            motivoConsulta.includes("parada cardíaca")) {
            corTriagem = "Vermelho";
            setorEncaminhamento = "Emergência - Reanimação/Cardiologia";
            tempoEspera = "0 minutos";
            return { cor: corTriagem, setor: setorEncaminhamento, tempoEspera: tempoEspera, prioridade: "Emergência" };
        }

        // --- REGRAS LARANJAS (MUITO URGENTE) ---
        if ((temSintoma("Dor Abdominal", 9) && temSintoma("Vômito", 8)) ||
            temSintoma("Dor no Peito", 7) ||
            temSintoma("Hemorragia", 8) ||
            (idade !== null && idade < 1 && temSintoma("Febre", 8))) {
            corTriagem = "Laranja";
            setorEncaminhamento = "Emergência - Clínica Geral / Cirurgia";
            tempoEspera = "10 minutos";
            return { cor: corTriagem, setor: setorEncaminhamento, tempoEspera: tempoEspera, prioridade: "Muito Urgente" };
        }

        // --- REGRAS AMARELAS (URGENTE) ---
        if (temSintoma("Febre", 7) ||
            temSintoma("Dor de Cabeça", 8) ||
            temSintoma("Fraturas", 6) ||
            temSintoma("Dor Abdominal", 7)) {
            corTriagem = "Amarelo";
            setorEncaminhamento = "Observação / Traumatologia";
            tempoEspera = "30 minutos";
            return { cor: corTriagem, setor: setorEncaminhamento, tempoEspera: tempoEspera, prioridade: "Urgente" };
        }

        // --- REGRAS VERDES (NORMAL) ---
        if (temSintoma("Tosse", 6) ||
            temSintoma("Cansaço", 6) ||
            temSintoma("Diarreia", 5)) {
            corTriagem = "Verde";
            setorEncaminhamento = "Clínica Geral - Atendimento Básico";
            tempoEspera = "90 minutos";
            return { cor: corTriagem, setor: setorEncaminhamento, tempoEspera: tempoEspera, prioridade: "Pouco Urgente" };
        }

        // --- REGRAS AZUIS (NÃO URGENTE) ---
        corTriagem = "Azul";
        setorEncaminhamento = "Clínica Geral - Ambulatório";
        tempoEspera = "120 minutos";
        return { cor: corTriagem, setor: setorEncaminhamento, tempoEspera: tempoEspera, prioridade: "Não Urgente" };
    }


    checkboxEmergencia.addEventListener('change', () => {
        if (checkboxEmergencia.checked) {
            formTriagem.classList.remove('hidden');
            dadosPacienteExistente.classList.add('hidden');
            formNovoPaciente.classList.add('hidden');
            formEmergenciaSemCadastro.classList.remove('hidden');
            cpfBuscaInput.value = ''; // Limpa o CPF de busca
            cpfBuscaInput.disabled = true; // Desabilita a busca por CPF
            btnBuscar.disabled = true;
        } else {
            formEmergenciaSemCadastro.classList.add('hidden');
            cpfBuscaInput.disabled = false;
            btnBuscar.disabled = false;
            formTriagem.classList.add('hidden'); // Oculta o formulário principal se desmarcar
        }
    });

    btnBuscar.addEventListener('click', async () => {
        const cpf = cpfBuscaInput.value;
        if (!cpf) {
            alert('Por favor, digite um CPF.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/paciente/${cpf}`);
            formTriagem.classList.remove('hidden');

            if (response.ok) {
                const paciente = await response.json();
                document.getElementById('nome-paciente').textContent = paciente.nome;
                document.getElementById('nascimento-paciente').textContent = new Date(paciente.nascimento).toLocaleDateString('pt-BR');
                document.getElementById('sexo-paciente').textContent = paciente.sexo;
                dadosPacienteExistente.classList.remove('hidden');
                formNovoPaciente.classList.add('hidden');
                formEmergenciaSemCadastro.classList.add('hidden');
            } else if (response.status === 404) {
                alert('Paciente não encontrado. Preencha o formulário de cadastro ou marque emergência.');
                dadosPacienteExistente.classList.add('hidden');
                formNovoPaciente.classList.remove('hidden');
                formEmergenciaSemCadastro.classList.add('hidden');
            } else {
                throw new Error('Erro ao buscar paciente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível conectar à API. Verifique se o backend está rodando.');
        }
    });

    // Lógica para submeter o formulário
    formTriagem.addEventListener('submit', async (event) => {
        event.preventDefault();

        let pacienteData = {};
        const dataHoraTriagem = new Date().toISOString(); // Captura a data e hora atual

        if (checkboxEmergencia.checked) {
            // Dados do formulário de emergência
            pacienteData = {
                cpf: document.getElementById('cpf-emergencia').value || 'N/A', // CPF opcional
                nome: document.getElementById('nome-emergencia').value,
                nascimento: document.getElementById('nascimento-emergencia').value,
                sexo: document.querySelector('input[name="sexo-emergencia"]:checked').value,
                peso: document.getElementById('peso-emergencia').value,
                altura: document.getElementById('altura-emergencia').value
            };
        } else if (!formNovoPaciente.classList.contains('hidden')) {
            // Novo paciente (cadastro completo)
            pacienteData = {
                cpf: cpfBuscaInput.value,
                nome: document.getElementById('nome').value,
                nascimento: document.getElementById('nascimento').value,
                sexo: document.querySelector('input[name="sexo"]:checked').value,
                cep: document.getElementById('cep').value,
                telefone: document.getElementById('telefone').value
            };
        } else {
            // Paciente existente
            pacienteData = {
                cpf: cpfBuscaInput.value,
                nome: document.getElementById('nome-paciente').textContent,
                nascimento: new Date(document.getElementById('nascimento-paciente').textContent).toISOString().split('T')[0],
                sexo: document.getElementById('sexo-paciente').textContent
            };
        }

        const sintomasSelecionados = [];
        document.querySelectorAll('.sintoma-item-wrapper input[type="checkbox"]:checked').forEach(checkbox => {
            const sintomaNome = checkbox.value;
            const slider = document.getElementById(`gravidade-${sintomaNome.replace(/\s+/g, '-')}`);
            sintomasSelecionados.push({
                nome: sintomaNome,
                gravidade: parseInt(slider.value)
            });
        });

        const motivoConsulta = document.getElementById('motivo').value;
        const observacoes = document.getElementById('observacoes').value;
        const temperatura = document.getElementById('temperatura').value;
        const pressao = document.getElementById('pressao').value;
        const glicemia = document.getElementById('glicemia').value;
        const spo2 = document.getElementById('spo2').value;
        const peso = document.getElementById('peso').value;
        const altura = document.getElementById('altura').value;
        const alergias = document.getElementById('alergias').value;
        const medicamentosUso = document.getElementById('medicamentos_uso').value;
        const diagnosticoInicialCID = doencaSelect.value;

        const fichaTriagem = {
            paciente: pacienteData,
            motivoConsulta: motivoConsulta,
            sintomas: sintomasSelecionados,
            observacoes: observacoes,
            sinaisVitais: {
                temperatura: temperatura,
                pressao: pressao,
                glicemia: glicemia,
                spo2: spo2,
                peso: peso,
                altura: altura
            },
            informacoesAdicionais: {
                alergias: alergias,
                medicamentosUso: medicamentosUso
            },
            diagnosticoInicialCID: diagnosticoInicialCID,
            dataHoraTriagem: dataHoraTriagem // Adiciona a data e hora da triagem
        };

        // Classificar gravidade
        const resultadoTriagem = classificarGravidadePaciente(fichaTriagem.paciente, fichaTriagem.sintomas, fichaTriagem.motivoConsulta);
        fichaTriagem.triagem = resultadoTriagem;

        try {
            const response = await fetch(`${API_URL}/triagem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fichaTriagem)
            });

            if (response.ok) {
                alert('Ficha de triagem registrada com sucesso!');
                formTriagem.reset();
                dadosPacienteExistente.classList.add('hidden');
                formNovoPaciente.classList.add('hidden');
                formEmergenciaSemCadastro.classList.add('hidden');
                cpfBuscaInput.value = '';
                cpfBuscaInput.disabled = false;
                btnBuscar.disabled = false;
                checkboxEmergencia.checked = false;
                // Resetar sintomas e sliders
                document.querySelectorAll('.sintoma-item-wrapper input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                    const sliderContainer = checkbox.closest('.sintoma-item-wrapper').querySelector('.gravidade-slider-container');
                    const slider = sliderContainer.querySelector('input[type="range"]');
                    const gravidadeValueSpan = sliderContainer.querySelector('.gravidade-value');
                    sliderContainer.style.display = 'none';
                    slider.value = '5';
                    gravidadeValueSpan.textContent = '5';
                });
                doencaSelect.value = '';
            } else {
                const errorData = await response.json();
                alert(`Erro ao registrar triagem: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro ao enviar ficha de triagem:', error);
            alert('Erro ao conectar com o servidor para registrar a triagem.');
        }
    });

    document.getElementById('btn-limpar-form').addEventListener('click', () => {
        formTriagem.reset();
        dadosPacienteExistente.classList.add('hidden');
        formNovoPaciente.classList.add('hidden');
        formEmergenciaSemCadastro.classList.add('hidden');
        cpfBuscaInput.value = '';
        cpfBuscaInput.disabled = false;
        btnBuscar.disabled = false;
        checkboxEmergencia.checked = false;
        // Resetar sintomas e sliders
        document.querySelectorAll('.sintoma-item-wrapper input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            const sliderContainer = checkbox.closest('.sintoma-item-wrapper').querySelector('.gravidade-slider-container');
            const slider = sliderContainer.querySelector('input[type="range"]');
            const gravidadeValueSpan = sliderContainer.querySelector('.gravidade-value');
            sliderContainer.style.display = 'none';
            slider.value = '5';
            gravidadeValueSpan.textContent = '5';
        });
        doencaSelect.value = '';
    });

    // Lógica da Navbar
    const nomeEnfermeiro = localStorage.getItem('enfermeiro_logado');
    if (nomeEnfermeiro) {
        document.getElementById('nome-enfermeiro').textContent = `Olá, ${nomeEnfermeiro}`;
    } else {
        window.location.href = 'login.html';
    }

    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('enfermeiro_logado');
        window.location.href = 'login.html';
    });

    // Inicializa a criação das seções de sintomas e o preenchimento do select de doenças
    criarSecoesDeSintomas();
    preencherSelectDoencas();

});
