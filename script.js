const html = document.querySelector("html");

const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");
const pauseOUplayIcon = document.querySelector(".app__card-primary-butto-icon");
const tempoNaTela = document.querySelector("#timer");

const banner = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");

const botoes = document.querySelectorAll(".app__card-button");
const startPauseBt = document.querySelector("#start-pause");
const musicaFocoInput = document.querySelector("#alternar-musica");
const iniciarOuPausarBt = document.querySelector("#start-pause span");

const fimDoTempo = new Audio(`/sons/beep.mp3`);
const playBtAUDIO = new Audio(`/sons/play.wav`);
const pauseBtAUDIO = new Audio(`/sons/pause.mp3`);
const musica = new Audio(`/sons/musica.mp3`);

musica.loop = true;

let tempoDecorridoEmSegudos = 1500;
let intervaloId = null;

musicaFocoInput.addEventListener("change", () => {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
});

focoBt.addEventListener("click", () => {
  tempoDecorridoEmSegudos = 10;
  alterarContexto("foco");
  focoBt.classList.add("active");
});

curtoBt.addEventListener("click", () => {
  tempoDecorridoEmSegudos = 300;
  alterarContexto("descanso-curto");
  curtoBt.classList.add("active");
});

longoBt.addEventListener("click", () => {
  tempoDecorridoEmSegudos = 900;
  alterarContexto("descanso-longo");
  longoBt.classList.add("active");
});

function alterarContexto(contexto) {
  mostrarTempo();
  botoes.forEach(function (contexto) {
    contexto.classList.remove("active");
  });
  html.setAttribute("data-contexto", contexto);
  banner.setAttribute("src", `/imagens/${contexto}.png`);
  switch (contexto) {
    case "foco":
      titulo.innerHTML = `<h1 class='app__title'>Otimize sua produtividade,<br /><strong class='app__title-strong'>mergulhe no que importa.</strong></h1>`;
      break;
    case "descanso-curto":
      titulo.innerHTML = `Que tal dar uma respirada? <strong class='app__title-strong'>Faça uma pausa curta</strong>`;
      break;
    case "descanso-longo":
      titulo.innerHTML = `Hora de voltar à superficie. <strong class='app__title-strong'>Faça uma pausa longa</strong>`;
      break;
  }
}

const contagemRegressiva = () => {
  if (tempoDecorridoEmSegudos <= 0) {
    fimDoTempo.play();
    alert("Tempo acabo");
    const focoAtivo = html.getAttribute("data-contexto") == "foco";
    if (focoAtivo) {
      const evento = new CustomEvent("focoFinalizado");
      document.dispatchEvent(evento);
    }
    zerar();
    return;
  }
  tempoDecorridoEmSegudos -= 1;
  mostrarTempo();
};

startPauseBt.addEventListener("click", iniciarOuPausar);

function iniciarOuPausar() {
  if (intervaloId) {
    pauseBtAUDIO.play();
    pauseOUplayIcon.setAttribute("src", "/imagens/play_arrow.png");
    zerar();
    return;
  }
  playBtAUDIO.play();
  intervaloId = setInterval(contagemRegressiva, 1000);
  iniciarOuPausarBt.textContent = "Pausar";
  pauseOUplayIcon.setAttribute("src", "imagens/pause.png");
}

function zerar() {
  clearInterval(intervaloId);
  iniciarOuPausarBt.textContent = "Começar";
  intervaloId = null;
}

function mostrarTempo() {
  const tempo = new Date(tempoDecorridoEmSegudos * 1000);
  const tempoFormatado = tempo.toLocaleString(`pt-BR`, {
    minute: "2-digit",
    second: "2-digit",
  });
  tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
