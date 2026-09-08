let tarefas = [];
let proximoId = 1;
let filtroAtual = "todas";

const form = document.querySelector("#form-tarefa");
const inputTexto = document.querySelector("#input-tarefa");
const inputData = document.querySelector("#input-data");

const listaPendentes = document.querySelector('.lista-tarefas[data-status="pendente"]');
const listaConcluidas = document.querySelector('.lista-tarefas[data-status="concluida"]');

const colunaPendentes = document.querySelector("#col-pendentes");
const colunaConcluidas = document.querySelector("#col-concluidas");

const contadorSpan = document.querySelector("#contador");
const botoesFiltros = document.querySelector("#botoes-filtros");

function adicionarTarefa(texto, data) {
    const textoLimpo = texto.trim();

    if (textoLimpo === "") {
        alert("Digite o texto da tarefa antes de adicionar.");
        return;
    }

    const novaTarefa = {
        id: proximoId,
        texto: textoLimpo,
        concluida: false,
        data: data || null
    };

    proximoId++;
    tarefas.push(novaTarefa);
    renderizarLista();
}

function removerTarefa(id) {
    tarefas = tarefas.filter((tarefa) => tarefa.id !== id);
    renderizarLista();
}

function concluirTarefa(id) {
    const tarefa = tarefas.find((tarefa) => tarefa.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        renderizarLista();
    }
}

function filtrarTarefas(filtro) {
    filtroAtual = filtro;

    colunaPendentes.classList.toggle("escondida", filtro === "concluidas");
    colunaConcluidas.classList.toggle("escondida", filtro === "pendentes");

    botoesFiltros.querySelectorAll("button").forEach((botao) => {
        botao.classList.toggle("ativo", botao.dataset.filtro === filtro);
    });
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement("li");
    li.className = "tarefa" + (tarefa.concluida ? " concluida" : "");
    li.dataset.id = tarefa.id;

    const cabecalho = document.createElement("div");
    cabecalho.className = "tarefa-cabecalho";

    const spanTexto = document.createElement("span");
    spanTexto.className = "tarefa-texto";
    spanTexto.textContent = tarefa.texto;
    spanTexto.dataset.acao = "concluir";

    const acoes = document.createElement("div");
    acoes.className = "tarefa-acoes";

    const btnConcluir = document.createElement("button");
    btnConcluir.textContent = tarefa.concluida ? "↺" : "✔️";
    btnConcluir.title = tarefa.concluida ? "Marcar como pendente" : "Marcar como concluída";
    btnConcluir.dataset.acao = "concluir";

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "🗑️";
    btnRemover.title = "Remover tarefa";
    btnRemover.dataset.acao = "remover";

    acoes.appendChild(btnConcluir);
    acoes.appendChild(btnRemover);

    cabecalho.appendChild(spanTexto);
    cabecalho.appendChild(acoes);

    li.appendChild(cabecalho);

    if (tarefa.data) {
        const spanData = document.createElement("p");
        spanData.className = "tarefa-data";
        spanData.textContent = "Vencimento: " + tarefa.data;
        li.appendChild(spanData);
    }

    return li;
}

function renderizarLista() {
    listaPendentes.innerHTML = "";
    listaConcluidas.innerHTML = "";

    tarefas.forEach((tarefa) => {

        const elemento = criarElementoTarefa(tarefa);
        if (tarefa.concluida) {
            listaConcluidas.appendChild(elemento);
        } else {
            listaPendentes.appendChild(elemento);
        }
    });

    if (listaPendentes.children.length === 0) {
        listaPendentes.innerHTML = `
            <li class="lista-vazia">
                <span class="icone-vazio">⏱️</span>
                Nenhuma tarefa pendente.
                <span class="subtexto">Crie sua primeira tarefa acima!</span>
            </li>
        `;
    }

    if (listaConcluidas.children.length === 0) {
        listaConcluidas.innerHTML = `
            <li class="lista-vazia">
                <span class="icone-vazio">✔️</span>
                Nenhuma tarefa concluída ainda.
                <span class="subtexto">Mantenha o foco!</span>
            </li>
        `;
    }

    const totalPendentes = tarefas.filter((tarefa) => !tarefa.concluida).length;
    contadorSpan.textContent = totalPendentes;

    filtrarTarefas(filtroAtual);
}

form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    adicionarTarefa(inputTexto.value, inputData.value);
    form.reset();
});

const quadro = document.querySelector(".quadro-kanban");
quadro.addEventListener("click", (evento) => {
    const alvo = evento.target;
    const acao = alvo.dataset.acao;

    if (!acao) return;

    const li = alvo.closest(".tarefa");
    if (!li) return;

    const id = Number(li.dataset.id);

    if (acao === "concluir") {
        concluirTarefa(id);
    } else if (acao === "remover") {
        removerTarefa(id);
    }
});

botoesFiltros.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-filtro]");
    if (!botao) return;
    filtrarTarefas(botao.dataset.filtro);
});

renderizarLista();