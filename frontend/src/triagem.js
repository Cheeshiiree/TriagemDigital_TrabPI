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

    async function fetchCids() {
        try {
            const response = await fetch(`${API_URL}/cids`);
            const cids = await response.json();
            preencherSelectDoencas(cids);
        } catch (error) {
            console.error('Erro ao buscar CIDs:', error);
        }
    }

    async function fetchSintomas() {
        try {
            const response = await fetch(`${API_URL}/sintomas`);
            const sintomas = await response.json();
            criarSecoesDeSintomas(sintomas);
        } catch (error) {
            console.error('Erro ao buscar sintomas:', error);
        }
    }

    function criarSecoesDeSintomas(sintomas) {
        const sintomasPorCategoria = {};
        sintomas.forEach(sintoma => {
            if (!sintomasPorCategoria[sintoma.categoria]) {
                sintomasPorCategoria[sintoma.categoria] = [];
            }
            sintomasPorCategoria[sintoma.categoria].push(sintoma.nome);
        });

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

    function preencherSelectDoencas(cids) {
        allCids = cids; // Armazena os CIDs para uso posterior
        doencaSelect.innerHTML = '<option value="">Selecione uma Doença/CID</option>'; // Limpa e adiciona opção padrão
        cids.forEach(cid => {
            const option = document.createElement('option');
            option.value = cid.codigo;
            option.textContent = `${cid.codigo} - ${cid.descricao}`;
            doencaSelect.appendChild(option);
        });
    }

    fetchCids();
    fetchSintomas();

    let allCids = []; // Variável para armazenar os CIDs carregados

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

        const selectedCidCode = doencaSelect.value;
        const selectedCid = allCids.find(cid => cid.codigo === selectedCidCode);

        if (selectedCid && selectedCid.sintomas_associados) {
            const sintomasAuto = selectedCid.sintomas_associados;
            const gravidadePadrao = selectedCid.gravidade_padrao || 5;

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


    checkboxEmergencia.addEventListener('change', () => {
        console.log('Checkbox Emergência alterado. Checked:', checkboxEmergencia.checked);
        if (checkboxEmergencia.checked) {
            if (checkboxEmergencia.checked) {
            console.log('Checkbox Emergência alterado. Checked:', checkboxEmergencia.checked);
            formTriagem.classList.remove('hidden');
            dadosPacienteExistente.classList.add('hidden');
            formNovoPaciente.classList.add('hidden');
            formEmergenciaSemCadastro.classList.remove('hidden');
            cpfBuscaInput.value = ''; // Limpa o CPF de busca
            cpfBuscaInput.disabled = true; // Desabilita a busca por CPF
            btnBuscar.disabled = true;

            // Disable fields in formNovoPaciente and enable in formEmergenciaSemCadastro
            formNovoPaciente.querySelectorAll('input, select, textarea').forEach(field => field.disabled = true);
            formEmergenciaSemCadastro.querySelectorAll('input, select, textarea').forEach(field => field.disabled = false);

        } else {
            formEmergenciaSemCadastro.classList.add('hidden');
            cpfBuscaInput.disabled = false;
            btnBuscar.disabled = false;
            formTriagem.classList.add('hidden'); // Oculta o formulário principal se desmarcar

            // Enable fields in formNovoPaciente and disable in formEmergenciaSemCadastro
            formNovoPaciente.querySelectorAll('input, select, textarea').forEach(field => field.disabled = false);
            formEmergenciaSemCadastro.querySelectorAll('input, select, textarea').forEach(field => field.disabled = true);
        }
        }
    });

    btnBuscar.addEventListener('click', async () => {
        console.log('Botão Buscar CPF clicado.');
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

                // Disable fields in new patient and emergency forms
                formNovoPaciente.querySelectorAll('input, select, textarea').forEach(field => field.disabled = true);
                formEmergenciaSemCadastro.querySelectorAll('input, select, textarea').forEach(field => field.disabled = true);

            } else if (response.status === 404) {
                alert('Paciente não encontrado. Preencha o formulário de cadastro ou marque emergência.');
                dadosPacienteExistente.classList.add('hidden');
                formNovoPaciente.classList.remove('hidden');
                formEmergenciaSemCadastro.classList.add('hidden');

                // Enable fields in new patient form and disable in emergency form
                formNovoPaciente.querySelectorAll('input, select, textarea').forEach(field => field.disabled = false);
                formEmergenciaSemCadastro.querySelectorAll('input, select, textarea').forEach(field => field.disabled = true);

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
                cpf: document.getElementById('cpf-emergencia') ? document.getElementById('cpf-emergencia').value : 'N/A', // CPF opcional
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

        // Ensure all patient input fields are enabled for a fresh start
        formNovoPaciente.querySelectorAll('input, select, textarea').forEach(field => field.disabled = false);
        formEmergenciaSemCadastro.querySelectorAll('input, select, textarea').forEach(field => field.disabled = false);
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
