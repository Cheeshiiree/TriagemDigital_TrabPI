import tkinter as tk
from tkinter import ttk

def salvar_dados():
    """Função para salvar os dados (substitua com a lógica real)."""
    nome = nome_entry.get()
    cpf = cpf_entry.get()
    data_nascimento = data_nascimento_entry.get()
    sexo = sexo_combobox.get()
    telefone = telefone_entry.get()
    motivo = motivo_text.get("1.0", tk.END).strip()

    print("Dados do Paciente:")
    print(f"  Nome: {nome}")
    print(f"  CPF: {cpf}")
    print(f"  Data de Nascimento: {data_nascimento}")
    print(f"  Sexo: {sexo}")
    print(f"  Telefone: {telefone}")
    print(f"  Motivo da Consulta: {motivo}")
    print("  Sintomas Selecionados:")
    for sintoma, intensidade in sintomas_selecionados.items():
        print(f"    {sintoma}: {intensidade}")
    informacoes_adicionais = informacoes_text.get("1.0", tk.END).strip()
    print(f"  Informações Adicionais: {informacoes_adicionais}")

    root.destroy()  # Fecha a janela após salvar

def abrir_sintomas():
    """Abre a janela para selecionar e editar sintomas."""
    def atualizar_sintomas():
        """Atualiza a lista de sintomas selecionados."""
        sintomas_selecionados.clear()
        for sintoma, var in sintomas_vars.items():
            if var.get():
                intensidade = intensidade_vars[sintoma].get()
                sintomas_selecionados[sintoma] = intensidade
        sintomas_window.destroy()

    sintomas_window = tk.Toplevel(root)
    sintomas_window.title("Selecionar Sintomas")

    for i, sintoma in enumerate(sintomas):
        var = sintomas_vars[sintoma]
        cb = tk.Checkbutton(sintomas_window, text=sintoma, variable=var)
        cb.grid(row=i, column=0, sticky=tk.W)

        escala = tk.Scale(sintomas_window, from_=1, to=10, orient=tk.HORIZONTAL, variable=intensidade_vars[sintoma])
        escala.grid(row=i, column=1)
        escala.configure(state=tk.NORMAL if var.get() else tk.DISABLED)

        def toggle_escala(var=var, escala=escala):
            escala.configure(state=tk.NORMAL if var.get() else tk.DISABLED)

        var.trace_add("write", lambda *args, var=var, escala=escala: toggle_escala(var, escala))

    aceitar_button = tk.Button(sintomas_window, text="Aceitar", command=atualizar_sintomas)
    aceitar_button.grid(row=len(sintomas), column=0, columnspan=2, pady=10)

root = tk.Tk()
root.title("Triagem de Pacientes")

# Frame para Dados do Paciente
dados_frame = tk.LabelFrame(root, text="Dados do Paciente")
dados_frame.pack(padx=10, pady=5, fill=tk.X)

tk.Label(dados_frame, text="Nome Completo:").grid(row=0, column=0, sticky=tk.W)
nome_entry = tk.Entry(dados_frame, width=50)
nome_entry.grid(row=0, column=1, sticky=tk.W, padx=5, pady=2)

tk.Label(dados_frame, text="CPF:").grid(row=1, column=0, sticky=tk.W)
cpf_entry = tk.Entry(dados_frame, width=20)
cpf_entry.grid(row=1, column=1, sticky=tk.W, padx=5, pady=2)

tk.Label(dados_frame, text="Data de Nascimento:").grid(row=2, column=0, sticky=tk.W)
data_nascimento_entry = tk.Entry(dados_frame, width=15)
data_nascimento_entry.grid(row=2, column=1, sticky=tk.W, padx=5, pady=2)

tk.Label(dados_frame, text="Sexo:").grid(row=3, column=0, sticky=tk.W)
sexo_combobox = ttk.Combobox(dados_frame, values=["Masculino", "Feminino", "Outro"])
sexo_combobox.grid(row=3, column=1, sticky=tk.W, padx=5, pady=2)
sexo_combobox.set("Masculino")  # Define um valor padrão

tk.Label(dados_frame, text="Telefone:").grid(row=4, column=0, sticky=tk.W)
telefone_entry = tk.Entry(dados_frame, width=20)
telefone_entry.grid(row=4, column=1, sticky=tk.W, padx=5, pady=2)

# Frame para Motivo da Consulta
motivo_frame = tk.LabelFrame(root, text="Motivo da Consulta")
motivo_frame.pack(padx=10, pady=5, fill=tk.X)

motivo_text = tk.Text(motivo_frame, height=3, width=60)
motivo_text.pack(padx=5, pady=2)

sintomas = [
    "Dor de Cabeça", "Dor Abdominal", "Falta de Ar", "Febre", "Tosse", 
    "Dor nas Costas", "Cansaço", "Náusea", "Vômito", "Diarreia", 
    "Prisão de Ventre", "Tontura", "Dor no Peito", "Palpitações", "Ansiedade", 
    "Depressão", "Irritação na Pele", "Coceira", "Manchas na Pele", "Inchaço", 
    "Dor Muscular", "Dor nas Articulações", "Espasmos Musculares", "Formigamento", 
    "Dormência", "Perda de Apetite", "Ganho de Peso", "Perda de Peso", "Insônia", 
    "Sonolência Excessiva", "Dificuldade para Engolir", "Rouquidão", "Dor de Garganta", 
    "Sangramento Nasal", "Congestão Nasal", "Coriza", "Olhos Vermelhos", "Visão Embaçada", 
    "Dor nos Olhos", "Zumbido no Ouvido", "Perda Auditiva", "Dor de Ouvido", "Dor de Dente", 
    "Sangramento Gengival", "Mau Hálito", "Boca Seca", "Aftas", "Azia", 
    "Refluxo", "Arrotos", "Flatulência", "Dor ao Urinar", "Urina Escura", 
    "Urina com Sangue", "Micção Frequente", "Micção Dolorosa", "Menstruação Irregular", 
    "Cólica Menstrual", "Secreção Vaginal", "Dor Pélvica", "Disfunção Erétil", "Queda de Cabelo", 
    "Unhas Quebradiças", "Suor Excessivo", "Calafrios", "Sensação de Calor", "Tremores", 
    "Desmaios", "Confusão Mental", "Perda de Memória", "Dificuldade de Concentração", "Alterações de Humor", 
    "Agressividade", "Medo Excessivo", "Fobia", "Pânico", "Dificuldade para Respirar ao Dormir", 
    "Ronco", "Apneia do Sono", "Dor ao Mastigar", "Dificuldade para Falar", "Dificuldade para Movimentar", 
    "Fraqueza", "Rigidez Muscular", "Espasmos Faciais", "Dor no Pescoço", "Dor Lombar", 
    "Dor no Quadril", "Dor no Joelho", "Dor no Tornozelo", "Dor no Pé", "Dor na Mão", 
    "Dor no Pulso", "Dor no Cotovelo", "Dor no Ombro", "Sensação de Desmaio", "Batimentos Cardíacos Irregulares"
]  # Sintomas de exemplo

sintomas_vars = {sintoma: tk.BooleanVar() for sintoma in sintomas}
intensidade_vars = {sintoma: tk.IntVar(value=1) for sintoma in sintomas}
sintomas_selecionados = {}

# Frame para Sintomas
sintomas_frame = tk.LabelFrame(root, text="Sintomas")
sintomas_frame.pack(padx=10, pady=5, fill=tk.BOTH, expand=True)

# Canvas para rolagem
canvas = tk.Canvas(sintomas_frame)
scrollbar = tk.Scrollbar(sintomas_frame, orient=tk.VERTICAL, command=canvas.yview)
scrollable_frame = tk.Frame(canvas)

scrollable_frame.bind(
    "<Configure>",
    lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
)

canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
canvas.configure(yscrollcommand=scrollbar.set)

canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

# Adicionando sintomas em múltiplas colunas e linhas
for i, sintoma in enumerate(sintomas):
    var = sintomas_vars[sintoma]
    cb = tk.Checkbutton(scrollable_frame, text=sintoma, variable=var)
    cb.grid(row=i // 3, column=i % 3, sticky=tk.W, padx=5, pady=2)

editar_sintomas_button = tk.Button(sintomas_frame, text="Registrar sintomas", command=abrir_sintomas)
editar_sintomas_button.pack(pady=5)

# Frame para Informações Adicionais
informacoes_frame = tk.LabelFrame(root, text="Informações Adicionais")
informacoes_frame.pack(padx=10, pady=5, fill=tk.X)

informacoes_text = tk.Text(informacoes_frame, height=4, width=60)
informacoes_text.pack(padx=5, pady=2)

# Frame para Botões de Ação
acao_frame = tk.Frame(root)
acao_frame.pack(padx=10, pady=10, fill=tk.X)

salvar_button = tk.Button(acao_frame, text="Salvar", command=salvar_dados)
salvar_button.pack(side=tk.LEFT, padx=5)

cancelar_button = tk.Button(acao_frame, text="Cancelar", command=root.destroy)
cancelar_button.pack(side=tk.RIGHT, padx=5)

root.mainloop()
