const elements = {
  btnAdicionarTarefa: document.querySelector(".app__button--add-task"),
  formAdicionarTarefa: document.querySelector(".app__form-add-task"),
  textarea: document.querySelector(".app__form-textarea"),
  ulTarefas: document.querySelector(".app__section-task-list"),
  btnRemoverConcluidas: document.querySelector("#btn-remover-concluidas"),
  btnRemoverTodas: document.querySelector("#btn-remover-todas"),
  paragrafoDescricaoTarefa: document.querySelector(
    ".app__section-active-task-description"
  ),
};

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
  const li = document.createElement("li");
  li.className = "app__section-task-list-item";

  const svg = document.createElement("svg");
  svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path></svg>
        `;

  const paragrafo = document.createElement("p");
  paragrafo.textContent = tarefa.descricao;
  paragrafo.className = "app__section-task-list-item-description";

  const botao = document.createElement("button");
  botao.className = "app_button-editor";
  botao.onclick = () => {
    const novaDescricao = prompt("Qual é o novo nome da tarefa?");
    if (novaDescricao) {
      paragrafo.textContent = novaDescricao;
      tarefa.descricao = novaDescricao;
      atualizarTarefas();
    }
  };

  const imagemBotao = document.createElement("img");
  imagemBotao.src = "/imagens/edit.png";
  botao.appendChild(imagemBotao);

  li.append(svg, paragrafo, botao);

  if (tarefa.completa) {
    li.classList.add("app__section-task-list-item-complete");
    botao.disabled = true;
  } else {
    li.onclick = () => {
      [...elements.ulTarefas.children].forEach((elemento) =>
        elemento.classList.remove("app__section-task-list-item-active")
      );
      if (tarefaSelecionada === tarefa) {
        elements.paragrafoDescricaoTarefa.textContent = "";
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
        return;
      }
      tarefaSelecionada = tarefa;
      liTarefaSelecionada = li;
      elements.paragrafoDescricaoTarefa.textContent = tarefa.descricao;
      li.classList.add("app__section-task-list-item-active");
    };
  }
  return li;
}

function adicionarTarefa(evento) {
  evento.preventDefault();
  const tarefa = { descricao: elements.textarea.value };
  tarefas.push(tarefa);
  const elementoTarefa = criarElementoTarefa(tarefa);
  elements.ulTarefas.append(elementoTarefa);
  atualizarTarefas();
  elements.textarea.value = "";
  elements.formAdicionarTarefa.classList.add("hidden");
}

elements.btnAdicionarTarefa.addEventListener("click", () => {
  elements.formAdicionarTarefa.classList.toggle("hidden");
});

elements.formAdicionarTarefa.addEventListener("submit", adicionarTarefa);

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  elements.ulTarefas.appendChild(elementoTarefa);
});

document.addEventListener("focoFinalizado", () => {
  if (tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
    liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
    liTarefaSelecionada.querySelector("button").disabled = true;
    tarefaSelecionada.completa = true;
    atualizarTarefas();
  }
});

function removerTarefas(somenteCompletas) {
  let seletor = ".app__section-task-list-item";
  if (somenteCompletas) {
    seletor += "-complete";
  }
  document.querySelectorAll(seletor).forEach((elemento) => elemento.remove());
  tarefas = somenteCompletas
    ? tarefas.filter((tarefa) => !tarefa.completa)
    : [];
  atualizarTarefas();
}

elements.btnRemoverConcluidas.onclick = () => removerTarefas(true);
elements.btnRemoverTodas.onclick = () => removerTarefas(false);
