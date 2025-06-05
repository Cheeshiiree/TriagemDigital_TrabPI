// document.addEventListener('DOMContentLoaded', () => {
//     const sintomasCategoriasDiv = document.getElementById('sintomas-categorias');
//     const enviarDadosBtn = document.getElementById('enviarDados');
//     const limparFormBtn = document.getElementById('limparForm');

//     // Campos do paciente para autocompletar
//     const nomeInput = document.getElementById('nome');
//     const cpfInput = document.getElementById('cpf');
//     const dataNascimentoInput = document.getElementById('dataNascimento');
//     const sexoSelect = document.getElementById('sexo');
//     const telefoneInput = document.getElementById('telefone');

//     // Nova seleção de doença/CID
//     const doencaSelect = document.getElementById('doencaSelect');


//     // --- BASE DE DADOS DE HISTÓRICO MÉDICO FICTÍCIO ---
//     const historicoMedicos = {
//         "123.456.789-00": {
//             paciente: {
//                 nome: "Ana Clara Oliveira",
//                 dataNascimento: "1990-03-15",
//                 sexo: "Feminino",
//                 telefone: "(21) 98765-1234"
//             },
//             historico: {
//                 alergias: ["Penicilina", "Aspirina"],
//                 condicoesCronicas: ["Asma (diagnóstico: 2005)", "Rinite Alérgica"],
//                 cirurgiasPrevias: ["Apendicectomia (2010)"],
//                 medicamentosEmUso: ["Salbutamol (SOS)", "Antihistamínico"]
//             }
//         },
//         "987.654.321-01": {
//             paciente: {
//                 nome: "Carlos Eduardo Costa",
//                 dataNascimento: "1978-11-22",
//                 sexo: "Masculino",
//                 telefone: "(31) 99876-5432"
//             },
//             historico: {
//                 alergias: [],
//                 condicoesCronicas: ["Hipertensão (diagnóstico: 2015)", "Diabetes Tipo 2 (diagnóstico: 2018)"],
//                 cirurgiasPrevias: ["Colecistectomia (2020)"],
//                 medicamentosEmUso: ["Losartana", "Metformina"]
//             }
//         }
//     };

//     // --- BASE DE DADOS DE DOENÇAS/CID E SINTOMAS ASSOCIADOS ---
//     const cidParaSintomas = {
//         "J11 - Gripe (Influenza)": {
//             sintomas: ["Tosse", "Febre", "Dor de Garganta", "Dor Muscular", "Cansaço", "Dor de Cabeça"],
//             gravidadePadrao: 5 // Gravidade padrão para estes sintomas se autopreenchidos
//         },
//         "K29 - Gastrite": {
//             sintomas: ["Dor Abdominal", "Náusea", "Vômito", "Azia"],
//             gravidadePadrao: 6
//         },
//         "R51 - Cefaleia (Dor de Cabeça)": {
//             sintomas: ["Dor de Cabeça", "Tontura"],
//             gravidadePadrao: 7
//         },
//         "I10 - Hipertensão Essencial": { // Exemplo de condição crônica que pode ter sintomas agudos
//             sintomas: ["Dor de Cabeça", "Tontura", "Palpitações"],
//             gravidadePadrao: 4
//         }
//         // Adicione mais CIDs e seus sintomas associados aqui
//     };


//     // Mapeamento de sintomas por categoria
//     const sintomasPorCategoria = {
//         "Sintomas Gerais": [
//             "Dor de Cabeça", "Febre", "Cansaço", "Tontura", "Perda de Apetite",
//             "Insônia", "Fadiga", "Mal-estar Geral"
//         ],
//         "Dor": [
//             "Dor Abdominal", "Dor no Peito", "Dor nas Articulações", "Dor de Garganta",
//             "Dor nas Costas", "Dor de Dente", "Dor Muscular"
//         ],
//         "Gastrointestinal": [
//             "Náusea", "Vômito", "Diarreia", "Prisão de Ventre", "Azia",
//             "Inchaço Abdominal", "Perda de Peso Inexplicada"
//         ],
//         "Respiratório": [
//             "Tosse", "Falta de Ar", "Congestão Nasal", "Espirros", "Chiado no Peito",
//             "Dor ao Respirar"
//         ],
//         "Pele": [
//             "Irritação na Pele", "Manchas na Pele", "Coceira", "Vermelhidão",
//             "Feridas", "Edema (Inchaço)"
//         ],
//         "Neurológico": [
//             "Dormência", "Formigamento", "Espasmos Musculares", "Convulsões",
//             "Dificuldade de Fala", "Perda de Consciência"
//         ],
//         "Psicológico": [
//             "Depressão", "Ansiedade", "Ataque de Pânico", "Mudanças de Humor",
//             "Pensamentos Suicidas"
//         ],
//         "Outros": [
//             "Palpitações", "Cortes", "Fraturas", "Hemorragia", "Febre Alta",
//             "Lesões"
//         ]
//     };

//     function criarSecoesDeSintomas() {
//         for (const categoria in sintomasPorCategoria) {
//             const details = document.createElement('details');
//             if (categoria === "Sintomas Gerais") {
//                 details.setAttribute('open', '');
//             }

//             const summary = document.createElement('summary');
//             summary.textContent = categoria;
//             details.appendChild(summary);

//             const sintomaGrid = document.createElement('div');
//             sintomaGrid.classList.add('sintoma-grid');
//             details.appendChild(sintomaGrid);

//             sintomasPorCategoria[categoria].forEach(sintomaNome => {
//                 const wrapper = document.createElement('div');
//                 wrapper.classList.add('sintoma-item-wrapper');

//                 const checkboxContainer = document.createElement('div');
//                 checkboxContainer.classList.add('sintoma-checkbox-container');

//                 const checkbox = document.createElement('input');
//                 checkbox.type = 'checkbox';
//                 checkbox.id = `sintoma-${sintomaNome.replace(/\s+/g, '-')}`;
//                 checkbox.value = sintomaNome;

//                 const label = document.createElement('label');
//                 label.htmlFor = checkbox.id;
//                 label.textContent = sintomaNome;

//                 checkboxContainer.appendChild(checkbox);
//                 checkboxContainer.appendChild(label);
//                 wrapper.appendChild(checkboxContainer);

//                 const sliderContainer = document.createElement('div');
//                 sliderContainer.classList.add('gravidade-slider-container');

//                 const sliderLabel = document.createElement('label');
//                 sliderLabel.textContent = "Gravidade (1-10):";

//                 const slider = document.createElement('input');
//                 slider.type = 'range';
//                 slider.min = '1';
//                 slider.max = '10';
//                 slider.value = '5';
//                 slider.id = `gravidade-${sintomaNome.replace(/\s+/g, '-')}`;

//                 const gravidadeValueSpan = document.createElement('span');
//                 gravidadeValueSpan.classList.add('gravidade-value');
//                 gravidadeValueSpan.textContent = slider.value;

//                 slider.addEventListener('input', () => {
//                     gravidadeValueSpan.textContent = slider.value;
//                 });

//                 sliderContainer.appendChild(sliderLabel);
//                 sliderContainer.appendChild(slider);
//                 sliderContainer.appendChild(gravidadeValueSpan);
//                 wrapper.appendChild(sliderContainer);

//                 sintomaGrid.appendChild(wrapper);

//                 checkbox.addEventListener('change', () => {
//                     if (checkbox.checked) {
//                         sliderContainer.style.display = 'flex';
//                     } else {
//                         sliderContainer.style.display = 'none';
//                         slider.value = '5';
//                         gravidadeValueSpan.textContent = '5';
//                     }
//                 });
//             });

//             sintomasCategoriasDiv.appendChild(details);
//         }
//     }

//     let pacienteHistorico = null; // Variável para armazenar o histórico do paciente encontrado

//     function autocompletarPaciente() {
//         const cpfFormatado = cpfInput.value.replace(/\D/g, ''); // Remove não-dígitos
//         if (cpfFormatado.length === 11) {
//             if (historicoMedicos[cpfInput.value]) {
//                 pacienteHistorico = historicoMedicos[cpfInput.value];
//                 const pacienteDados = pacienteHistorico.paciente;

//                 nomeInput.value = pacienteDados.nome;
//                 dataNascimentoInput.value = pacienteDados.dataNascimento;
//                 sexoSelect.value = pacienteDados.sexo;
//                 telefoneInput.value = pacienteDados.telefone;

//                 alert(`Paciente ${pacienteDados.nome} encontrado no histórico!`);
//             } else {
//                 pacienteHistorico = null;
//             }
//         } else {
//             pacienteHistorico = null;
//         }
//     }

//     // --- FUNÇÃO PARA PREENCHER O SELECT DE DOENÇAS ---
//     function preencherSelectDoencas() {
//         for (const cid in cidParaSintomas) {
//             const option = document.createElement('option');
//             option.value = cid;
//             option.textContent = cid;
//             doencaSelect.appendChild(option);
//         }
//     }

//     // --- FUNÇÃO PARA AUTOSELECIONAR SINTOMAS COM BASE NA DOENÇA/CID ---
//     function autoselecionarSintomasPorDoenca() {
//         // Primeiro, desmarca todos os sintomas e reseta seus sliders
//         document.querySelectorAll('.sintoma-item-wrapper input[type="checkbox"]').forEach(checkbox => {
//             checkbox.checked = false;
//             const sliderContainer = checkbox.closest('.sintoma-item-wrapper').querySelector('.gravidade-slider-container');
//             const slider = sliderContainer.querySelector('input[type="range"]');
//             const gravidadeValueSpan = sliderContainer.querySelector('.gravidade-value');

//             sliderContainer.style.display = 'none';
//             slider.value = '5'; // Valor padrão
//             gravidadeValueSpan.textContent = '5';
//         });

//         const selectedCid = doencaSelect.value;
//         if (selectedCid && cidParaSintomas[selectedCid]) {
//             const sintomasAuto = cidParaSintomas[selectedCid].sintomas;
//             const gravidadePadrao = cidParaSintomas[selectedCid].gravidadePadrao || 5; // Usa 5 se não definida

//             sintomasAuto.forEach(sintomaNome => {
//                 const checkboxId = `sintoma-${sintomaNome.replace(/\s+/g, '-')}`;
//                 const checkbox = document.getElementById(checkboxId);
//                 if (checkbox) {
//                     checkbox.checked = true; // Marca o checkbox
//                     const sliderContainer = checkbox.closest('.sintoma-item-wrapper').querySelector('.gravidade-slider-container');
//                     const slider = sliderContainer.querySelector('input[type="range"]');
//                     const gravidadeValueSpan = sliderContainer.querySelector('.gravidade-value');

//                     slider.value = gravidadePadrao; // Define a gravidade padrão
//                     gravidadeValueSpan.textContent = gravidadePadrao;
//                     sliderContainer.style.display = 'flex'; // Exibe o slider
//                 }
//             });
//         }
//     }


//     // --- LISTENERS ---
//     cpfInput.addEventListener('blur', autocompletarPaciente);
//     doencaSelect.addEventListener('change', autoselecionarSintomasPorDoenca);

//     enviarDadosBtn.addEventListener('click', () => {
//         const paciente = {
//             nome: nomeInput.value,
//             cpf: cpfInput.value,
//             dataNascimento: dataNascimentoInput.value,
//             sexo: sexoSelect.value,
//             telefone: telefoneInput.value,
//             motivoConsulta: document.getElementById('motivo').value,
//             informacoesAdicionais: document.getElementById('informacoesAdicionais').value,
//             sintomas: []
//         };

//         // Adiciona o histórico médico se o paciente foi encontrado
//         if (pacienteHistorico) {
//             paciente.historicoMedico = pacienteHistorico.historico;
//         }

//         // Adiciona a doença/CID selecionada, se houver
//         if (doencaSelect.value) {
//             paciente.diagnosticoInicialCID = doencaSelect.value;
//         }

//         document.querySelectorAll('.sintoma-item-wrapper input[type="checkbox"]:checked').forEach(checkbox => {
//             const sintomaNome = checkbox.value;
//             const slider = document.getElementById(`gravidade-${sintomaNome.replace(/\s+/g, '-')}`);
//             paciente.sintomas.push({
//                 nome: sintomaNome,
//                 gravidade: parseInt(slider.value)
//             });
//         });

//         if (!paciente.nome || !paciente.cpf || !paciente.dataNascimento || !paciente.sexo || paciente.sintomas.length === 0) {
//             alert('Por favor, preencha os dados essenciais do paciente e selecione pelo menos um sintoma.');
//             return;
//         }

//         const fichaTriagemJSON = JSON.stringify(paciente, null, 2);
//         console.log('Ficha de Triagem (JSON):', fichaTriagemJSON);

//         // ... (Lógica de envio para o backend) ...

//         alert('Dados enviados para a triagem! (Verifique o console do navegador para a ficha JSON gerada)');
//         limparFormulario();
//     });

//     limparFormBtn.addEventListener('click', limparFormulario);

//     function limparFormulario() {
//         nomeInput.value = '';
//         cpfInput.value = '';
//         dataNascimentoInput.value = '';
//         sexoSelect.value = '';
//         telefoneInput.value = '';
//         document.getElementById('motivo').value = '';
//         document.getElementById('informacoesAdicionais').value = '';

//         pacienteHistorico = null; // Zera o histórico encontrado
//         doencaSelect.value = ''; // Reseta a seleção de doença/CID

//         document.querySelectorAll('.sintoma-item-wrapper input[type="checkbox"]').forEach(checkbox => {
//             checkbox.checked = false;
//             const sliderContainer = checkbox.closest('.sintoma-item-wrapper').querySelector('.gravidade-slider-container');
//             const slider = sliderContainer.querySelector('input[type="range"]');
//             const gravidadeValueSpan = sliderContainer.querySelector('.gravidade-value');

//             sliderContainer.style.display = 'none';
//             slider.value = '5';
//             gravidadeValueSpan.textContent = '5';
//         });

//         document.querySelectorAll('details').forEach((detail, index) => {
//             if (index !== 0) {
//                 detail.removeAttribute('open');
//             }
//         });
//     }

//     // Inicializa a criação das seções de sintomas e o preenchimento do select de doenças
//     criarSecoesDeSintomas();
//     preencherSelectDoencas();
// });


// /**
//  * O paciente pode falar assim, olha, eu verifiquei e deu 38 graus em casa. Eu coloco febre, a ferida em sua residência de 38 graus.
// E vou perguntando pra ele o que que ele vai trazendo pra gente, né? Porque ele pode falar assim, ó. Tô com dor de cabeça, mas tô com dor de ouvido.
// Tô com dor de garganta. Então, eu afasto o diagnóstico de gripe e vou pensar numa amidalite, vou pensar numa otite. O nosso atendimento, ele seguia pelo que o paciente traça pra gente.
// Posteriormente, a gente vai trabalhar com medidas antropométricas, que é o peso, a altura, a pressão alta. A febre que ele referiu, eu vou verificar aqui no nosso atendimento. Isso, aí eu vou pegar o seu peso, né?
// Vou pesar você na balança, vou ver sua altura, vou verificar a pressão, temperatura, frequência respiratória, saturação e frequência cardíaca. Esses outros elementos aqui, ó, não tem necessidade. Não são tão assim de atendimento imediato, tá?
// Glicemia. Se você me fala que você é diabética, eu vou me atentar pra sua glicemia. E aí, a glicemia, o ideal é fazer em jejum.


// Deixa eu pensar aqui, ó. Porque, por exemplo, o que que acontece? Ali a gente vai ter a classificação o mais rápido possível.
// Então, é o básico das informações. Então, tem que ser um instrumento rápido, né? Poderia ser, por exemplo, assim, ó, só que vai dar trabalho isso?
// É, você colocar, por exemplo, assim, ó, quais são as principais demandas daqui do postinho? Sempre vem gestante, sempre vem fumante, sempre vem hipertenso, diabético e tal. Então, quando a gente lançasse o código, já aparecesse pra gente os sinais e sintomas, a gente desse só o tique pra poder clicar nos sinais.
// Então, ó, esse tá com gripe, tá com febre, tá com isso, tá com aquilo. E já colocar a cor, ele já meio que estabilizar a cor, né, mediante ao que apareceu e mandar. Porque, por exemplo, se fosse uma COVID.
// Tem o COVID que ele é assintomático, ele tá só com nariz correnta, sem paladar, nem sem olfato. Mas tem um COVID que chega dessaturando. Então, eu não posso ter a mesma classificação de risco para os dois pacientes pelo diagnóstico.
// Então, eu acho que o instrumento tem que ser bem criterioso nesse sentido, de separar a gravidade. Isso que eu acho que é importante. Aí evita da gente fazer a digitação da consulta, né.
// Isso, eu acho que o mais é opções de clicar e tchau, ao invés da gente ter que ficar digitando. Só que, ao mesmo tempo, tem que ter um campo pra gente colocar quando o paciente é agressivo com a gente, quando ele não aceita a triagem que acontece, essas questões. Porque o fluxo enxerga que o paciente chega, é triado e vai pro atendimento.
// Só que tem paciente que não quer esperar, tem paciente que tá em surto, tem paciente que é agressivo. Então, o PEC acaba sendo um instrumento de proteção também para o profissional, pra gente não sofrer agressões, pra gente se respaldar legalmente. Então, isso também é muito importante de vocês se atentarem quando elaborar um instrumento.
// Um instrumento que seja eficaz e respalde o trabalho do profissional.
//  */

document.addEventListener('DOMContentLoaded', () => {
    const sintomasCategoriasDiv = document.getElementById('sintomas-categorias');
    const enviarDadosBtn = document.getElementById('enviarDados');
    const limparFormBtn = document.getElementById('limparForm');

    // Campos do paciente para autocompletar
    const nomeInput = document.getElementById('nome');
    const cpfInput = document.getElementById('cpf');
    const dataNascimentoInput = document.getElementById('dataNascimento');
    const sexoSelect = document.getElementById('sexo');
    const telefoneInput = document.getElementById('telefone');

    // Nova seleção de doença/CID
    const doencaSelect = document.getElementById('doencaSelect');


    // --- BASE DE DADOS DE HISTÓRICO MÉDICO FICTÍCIO ---
    const historicoMedicos = {
        "123.456.789-00": {
            paciente: {
                nome: "Ana Clara Oliveira",
                dataNascimento: "1990-03-15",
                sexo: "Feminino",
                telefone: "(21) 98765-1234"
            },
            historico: {
                alergias: ["Penicilina", "Aspirina"],
                condicoesCronicas: ["Asma (diagnóstico: 2005)", "Rinite Alérgica"],
                cirurgiasPrevias: ["Apendicectomia (2010)"],
                medicamentosEmUso: ["Salbutamol (SOS)", "Antihistamínico"]
            }
        },
        "987.654.321-01": {
            paciente: {
                nome: "Carlos Eduardo Costa",
                dataNascimento: "1978-11-22",
                sexo: "Masculino",
                telefone: "(31) 99876-5432"
            },
            historico: {
                alergias: [],
                condicoesCronicas: ["Hipertensão (diagnóstico: 2015)", "Diabetes Tipo 2 (diagnóstico: 2018)"],
                cirurgiasPrevias: ["Colecistectomia (2020)"],
                medicamentosEmUso: ["Losartana", "Metformina"]
            }
        }
    };

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

    let pacienteHistorico = null; // Variável para armazenar o histórico do paciente encontrado

    function autocompletarPaciente() {
        const cpfFormatado = cpfInput.value.replace(/\D/g, ''); // Remove não-dígitos
        if (cpfFormatado.length === 11) {
            if (historicoMedicos[cpfInput.value]) {
                pacienteHistorico = historicoMedicos[cpfInput.value];
                const pacienteDados = pacienteHistorico.paciente;

                nomeInput.value = pacienteDados.nome;
                dataNascimentoInput.value = pacienteDados.dataNascimento;
                sexoSelect.value = pacienteDados.sexo;
                telefoneInput.value = pacienteDados.telefone;

                alert(`Paciente ${pacienteDados.nome} encontrado no histórico!`);
            } else {
                pacienteHistorico = null;
            }
        } else {
            pacienteHistorico = null;
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
        // Primeiro, desmarca todos os sintomas e reseta seus sliders
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
    // Simula a lógica de classificação do Manchester Triage System
    function classificarGravidadePaciente(fichaPaciente) {
        let corTriagem = "Azul"; // Padrão inicial: Não Urgente
        let setorEncaminhamento = "Clínica Geral - Ambulatório";
        let tempoEspera = "120 minutos"; // Padrão

        // Acessa os sintomas do paciente a partir da ficha
        const sintomas = fichaPaciente.sintomas;
        const idade = fichaPaciente.paciente.dataNascimento ? (new Date().getFullYear() - new Date(fichaPaciente.paciente.dataNascimento).getFullYear()) : null;
        const motivoConsulta = fichaPaciente.motivoConsulta.toLowerCase();

        // Helper para verificar se um sintoma está presente com gravidade mínima
        const temSintoma = (nomeSintoma, gravidadeMinima = 1) => {
            return sintomas.some(s => s.nome === nomeSintoma && s.gravidade >= gravidadeMinima);
        };

        // Regras de Prioridade (seguindo a lógica do Manchester Triage: do mais grave para o menos)
        // Cores do Manchester Triage System e seus tempos de espera máximos:
        // 1. Vermelho (Imediato): 0 minutos [cite: 38]
        // 2. Laranja (Muito Urgente): 10 minutos [cite: 38]
        // 3. Amarelo (Urgente): 30 minutos [cite: 38]
        // 4. Verde (Normal): 90 minutos [cite: 38]
        // 5. Azul (Não Urgente): 120 minutos [cite: 38]

        // --- REGRAS VERMELHAS (IMEDIATO) ---
        if (temSintoma("Dor no Peito", 9) && temSintoma("Falta de Ar", 9) ||
            motivoConsulta.includes("perda de consciência") ||
            motivoConsulta.includes("parada cardíaca") ||
            (fichaPaciente.historicoMedico && fichaPaciente.historicoMedico.condicoesCronicas.includes("Asma") && temSintoma("Falta de Ar", 9))) { // Exemplo com histórico
            corTriagem = "Vermelho";
            setorEncaminhamento = "Emergência - Reanimação/Cardiologia";
            tempoEspera = "0 minutos";
            return { cor: corTriagem, setor: setorEncaminhamento, tempoEspera: tempoEspera };
        }

        // --- REGRAS LARANJAS (MUITO URGENTE) ---
        if (temSintoma("Dor Abdominal", 9) && temSintoma("Vômito", 8) ||
            temSintoma("Dor no Peito", 7) || // Dor no peito menos grave
            temSintoma("Hemorragia", 8) ||
            (idade !== null && idade < 1 && temSintoma("Febre", 8))) { // Bebê com febre alta
            corTriagem = "Laranja";
            setorEncaminhamento = "Emergência - Clínica Geral / Cirurgia";
            tempoEspera = "10 minutos"; 
            return { cor: corTriagem, setor: setorEncaminhamento, tempoEspera: tempoEspera };
        }

        // --- REGRAS AMARELAS (URGENTE) ---
        if (temSintoma("Febre", 7) ||
            temSintoma("Dor de Cabeça", 8) ||
            temSintoma("Fraturas", 6) ||
            temSintoma("Dor Abdominal", 7)) {
            corTriagem = "Amarelo";
            setorEncaminhamento = "Observação / Traumatologia";
            tempoEspera = "30 minutos";
            return { cor: corTriagem, setor: setorEncaminhamento, tempoEspera: tempoEspera };
        }

        // --- REGRAS VERDES (NORMAL) ---
        if (temSintoma("Tosse", 6) ||
            temSintoma("Cansaço", 6) ||
            temSintoma("Diarreia", 5)) {
            corTriagem = "Verde";
            setorEncaminhamento = "Clínica Geral - Atendimento Básico";
            tempoEspera = "90 minutos"; 
            return { cor: corTriagem, setor: setorEncaminhamento, tempoEsencaminhamentopera };
        }

        // --- REGRAS AZUIS (NÃO URGENTE) ---
        // Se chegou até aqui e não foi classificado em outra cor
        corTriagem = "Azul";
        setorEncaminhamento = "Clínica Geral - Ambulatório";
        tempoEspera = "120 minutos"; 

        return { cor: corTriagem, setor: setorEncaminhamento, tempoEspera: tempoEspera };
    }


    // --- LISTENERS ---
    cpfInput.addEventListener('blur', autocompletarPaciente);
    doencaSelect.addEventListener('change', autoselecionarSintomasPorDoenca);

    enviarDadosBtn.addEventListener('click', () => {
        const paciente = {
            nome: nomeInput.value,
            cpf: cpfInput.value,
            dataNascimento: dataNascimentoInput.value,
            sexo: sexoSelect.value,
            telefone: telefoneInput.value,
            motivoConsulta: document.getElementById('motivo').value,
            informacoesAdicionais: document.getElementById('informacoesAdicionais').value,
            sintomas: []
        };

        // Adiciona o histórico médico se o paciente foi encontrado
        if (pacienteHistorico) {
            paciente.historicoMedico = pacienteHistorico.historico;
        }

        // Adiciona a doença/CID selecionada, se houver
        if (doencaSelect.value) {
            paciente.diagnosticoInicialCID = doencaSelect.value;
        }

        document.querySelectorAll('.sintoma-item-wrapper input[type="checkbox"]:checked').forEach(checkbox => {
            const sintomaNome = checkbox.value;
            const slider = document.getElementById(`gravidade-${sintomaNome.replace(/\s+/g, '-')}`);
            paciente.sintomas.push({
                nome: sintomaNome,
                gravidade: parseInt(slider.value)
            });
        });

        if (!paciente.nome || !paciente.cpf || !paciente.dataNascimento || !paciente.sexo || paciente.sintomas.length === 0) {
            alert('Por favor, preencha os dados essenciais do paciente e selecione pelo menos um sintoma.');
            return;
        }

        // --- CHAMADA DO SISTEMA ESPECIALISTA ---
        const resultadoTriagem = classificarGravidadePaciente(paciente);

        const fichaTriagemJSON = JSON.stringify({ ...paciente, triagem: resultadoTriagem }, null, 2); // Inclui o resultado da triagem no JSON
        console.log('Ficha de Triagem (JSON):', fichaTriagemJSON);

        alert(`Classificação da Triagem: Cor ${resultadoTriagem.cor} (Prioridade: ${resultadoTriagem.tempoEspera})\nSetor de Encaminhamento: ${resultadoTriagem.setor}`);

        limparFormulario();
    });

    limparFormBtn.addEventListener('click', limparFormulario);

    function limparFormulario() {
        nomeInput.value = '';
        cpfInput.value = '';
        dataNascimentoInput.value = '';
        sexoSelect.value = '';
        telefoneInput.value = '';
        document.getElementById('motivo').value = '';
        document.getElementById('informacoesAdicionais').value = '';

        pacienteHistorico = null; // Zera o histórico encontrado
        doencaSelect.value = ''; // Reseta a seleção de doença/CID

        document.querySelectorAll('.sintoma-item-wrapper input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            const sliderContainer = checkbox.closest('.sintoma-item-wrapper').querySelector('.gravidade-slider-container');
            const slider = sliderContainer.querySelector('input[type="range"]');
            const gravidadeValueSpan = sliderContainer.querySelector('.gravidade-value');

            sliderContainer.style.display = 'none';
            slider.value = '5';
            gravidadeValueSpan.textContent = '5';
        });

        document.querySelectorAll('details').forEach((detail, index) => {
            if (index !== 0) {
                detail.removeAttribute('open');
            }
        });
    }

    // Inicializa a criação das seções de sintomas e o preenchimento do select de doenças
    criarSecoesDeSintomas();
    preencherSelectDoencas();
});