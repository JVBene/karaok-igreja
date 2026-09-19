/* =====================================================================
   LÓGICA DA VINHETA
===================================================================== */
(function () {
  var intro = document.getElementById('intro');
  if (!intro) return;

  var DURACAO = 7000;

  function fecharIntro() {
    if (intro.dataset.fechando) return;
    intro.dataset.fechando = '1';
    intro.classList.add('intro--saindo');
    document.body.classList.remove('intro-travada');
    setTimeout(function () { intro.remove(); }, 650);
  }

  var timer = setTimeout(fecharIntro, DURACAO);

  document.getElementById('pularIntro').addEventListener('click', function () {
    clearTimeout(timer);
    fecharIntro();
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearTimeout(timer);
    fecharIntro();
  }
})();

/* =====================================================================
   LÓGICA DO KARAOKÊ (Catálogo e Fila)
===================================================================== */
const SONGS = [
  { id: 1, title: "Arde Outra Vez", artist: "Thalles Roberto", genre: "Groove", duration: "7:07", videoSrc: "", youtubeId: "" },
  { id: 1, title: "1000 Graus", artist: "Renascer Praise", genre: "Pop Rock", duration: "5:32", videoSrc: "", youtubeId: "" },
  { id: 1, title: "A Alegria", artist: "3Palavrinhas", genre: "Pop Infantil", duration: "3:53", videoSrc: "", youtubeId: "" },
  { id: 1, title: "A Alegria do Senhor", artist: "Fernandinho", genre: "Rock", duration: "3:49", videoSrc: "", youtubeId: "" },
  { id: 1, title: "A Boa Parte", artist: "Fhop Music e Nívea Soares", genre: "Worship", duration: "6:11", videoSrc: "", youtubeId: "" },
  { id: 1, title: "A Vitória da Cruz", artist: "Diante do Trono", genre: "Pop Gospel", duration: "7:59", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Aquele Que Está Feliz", artist: "Comunidade de Ninópolis", genre: "Pop Gospel", duration: "3:16", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Celebrai a Cristo", artist: "", genre: "Pop Gospel", duration: "2:49", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Chuta Que É Laço", artist: "Adriano Gospel Funk", genre: "Funk", duration: "2:52", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Dança do Canguru", artist: "Aline Barros", genre: "Pop Infantil", duration: "3:02", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Dança do Pinguim", artist: "Aline Barros", genre: "Pop Infantil", duration: "3:00", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Dançar na Chuva", artist: "Fernandinho", genre: "Pop Rock", duration: "4:35", videoSrc: "", youtubeId: "" },
  { id: 1, title: "De Quem É", artist: "Irmão Lázaro", genre: "Corinho", duration: "8:11", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Desemborca o Vaso", artist: "", genre: "Corinho", duration: "2:35", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Desenvolvendo Amor", artist: "Morada", genre: "Reggae Rock", duration: "4:25", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Divino Companheiro", artist: "Mara Lima", genre: "Moda de Viola", duration: "3:23", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Divisa de Fogo", artist: "Fogo no Pé", genre: "Corinho", duration: "3:16", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Ele Vem (Incendeia)", artist: "David Quinlan", genre: "Louvor", duration: "3:48", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Escape", artist: "Renascer Praise", genre: "Worship", duration: "5:57", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Estações", artist: "Dunamis Music e Victor Valente", genre: "Pop Rock", duration: "5:28", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Estátua de Sal", artist: "3Palavrinhas", genre: "Pop Infantil", duration: "3:20", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Fico Feliz", artist: "Aline Barros", genre: "Louvor", duration: "4:05", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Filho do Deus Vivo", artist: "Nívea Soares", genre: "Pop Gospel", duration: "5:30", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Galileu", artist: "Fernandinho", genre: "Pop Gospel", duration: "5:53", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Há Alegria", artist: "", genre: "Outro", duration: "6:06", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Há Um Rio", artist: "", genre: "Rock", duration: "4:44", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Isaías 9", artist: "Rodolfo Abrantes", genre: "Rock Alternativo", duration: "11:44", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Jacó Segurou o Anjo", artist: "", genre: "Corinho", duration: "3:22", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Joquebede", artist: "Pr. Isaías Santos", genre: "Corinho", duration: "3:34", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Escudo", artist: "", genre: "Louvor", duration: "4:23", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Não Temas", artist: "Diante do Trono", genre: "Louvor", duration: "4:03", videoSrc: "", youtubeId: "" },
  { id: 1, title: "O Barco Balançou", artist: "Aline Barros", genre: "Pop Infantil", duration: "3:07", videoSrc: "", youtubeId: "" },
  { id: 1, title: "O Melhor de Deus", artist: "Kleber Lucas", genre: "Pop Gospel", duration: "4:53", videoSrc: "", youtubeId: "" },
  { id: 1, title: "O Nosso General É Cristo", artist: "", genre: "Rock", duration: "3:16", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Os Anjos Te Louvam", artist: "Eli Soares", genre: "Groove", duration: "4:29", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Passando Pela Prova", artist: "Irmão Lázaro", genre: "Corinho", duration: "1:45", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Pedro, Tiago, João no Barquinho", artist: "Aline Barros", genre: "Pop Infantil", duration: "3:38", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Pelo Rei", artist: "Juliane Nogueira", genre: "Outro", duration: "4:54", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Pisa na Muralha", artist: "Aline Barros", genre: "Pop Infantil", duration: "3:25", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Pisaduras", artist: "Rodolfo Abrantes", genre: "Rock Alternativo", duration: "5:53", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Porque Ele Vive", artist: "Harpa Cristã", genre: "Hino", duration: "3:38", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Pula Pula", artist: "Aline Barros", genre: "Pop Infantil", duration: "3:22", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Rei Davi", artist: "3Palavrinhas", genre: "Pop Infantil", duration: "2:43", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Rompendo em Fé", artist: "David Quinlan", genre: "Louvor", duration: "5:41", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Ruja o Leão", artist: "Talita Catanzaro", genre: "Outro", duration: "5:20", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Samuel", artist: "Aline Barros", genre: "Pop Infantil", duration: "2:45", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Se Não For Pra Te Adorar", artist: "Fernandinho", genre: "Louvor", duration: "3:38", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Senhor, Te Quero", artist: "Vineyard", genre: "Louvor", duration: "4:04", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Seu Sangue", artist: "Fernandinho", genre: "Rock", duration: "4:45", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Soldados do Rei", artist: "Diante do Trono", genre: "Pop Infantil", duration: "3:17", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Tempo de Festa", artist: "Diante do Trono", genre: "Pop Gospel", duration: "5:20", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Teu Amor Não Falha", artist: "Nívea Soares", genre: "Worship", duration: "5:53", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Toda Sorte de Benção", artist: "", genre: "Louvor", duration: "4:13", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Tu És Bom", artist: "", genre: "Pop Gospel", duration: "4:05", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Tua Alegria", artist: "Drops", genre: "Pop Gospel", duration: "4:57", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Vem Com Josué Lutar em Jericó", artist: "Eli Soares", genre: "Groove", duration: "2:34", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Vim Falar Com Deus", artist: "Delino Marçal", genre: "Groove", duration: "2:55", videoSrc: "", youtubeId: "" },
  { id: 1, title: "Vitória no Deserto", artist: "Aline Barros", genre: "Pop Gospel", duration: "3:38", videoSrc: "", youtubeId: "" },
];

const genres = ["Todos", ...new Set(SONGS.map(s => s.genre))];
let activeGenre = "Todos";
let searchTerm = "";
let queue = [];
let nowPlayingId = null;

const genreChipsEl = document.getElementById("genreChips");
const songListEl = document.getElementById("songList");
const queueListEl = document.getElementById("queueList");
const stagePlaceholder = document.getElementById("stagePlaceholder");
const stageVideo = document.getElementById("stageVideo");
const nowInfo = document.getElementById("nowInfo");
const nowTitle = document.getElementById("nowTitle");
const nowMeta = document.getElementById("nowMeta");

// Busca e Filtros
document.getElementById("search").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderSongs();
});

function renderChips(){
  genreChipsEl.innerHTML = "";
  genres.forEach(g => {
    const chip = document.createElement("button");
    chip.className = "chip" + (g === activeGenre ? " active" : "");
    chip.textContent = g;
    chip.addEventListener("click", () => { activeGenre = g; renderChips(); renderSongs(); });
    genreChipsEl.appendChild(chip);
  });
}

function renderSongs(){
  const filtered = SONGS.filter(s => {
    const matchGenre = activeGenre === "Todos" || s.genre === activeGenre;
    const matchSearch = (s.title + " " + s.artist).toLowerCase().includes(searchTerm.toLowerCase());
    return matchGenre && matchSearch;
  });

  songListEl.innerHTML = "";
  if(filtered.length === 0){
    songListEl.innerHTML = '<div class="empty-msg">Nenhuma música encontrada com esse filtro.</div>';
    return;
  }

  filtered.forEach(s => {
    const row = document.createElement("div");
    row.className = "song-row" + (s.id === nowPlayingId ? " playing" : "");
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.innerHTML = `
      <div>
        <div class="song-title">${s.title}</div>
        <div class="song-meta">${s.artist} · ${s.duration}</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
        <span class="song-genre-tag">${s.genre}</span>
        ${(s.videoSrc || s.youtubeId) ? '<span class="video-ready">● vídeo pronto</span>' : ''}
      </div>
      <button class="add-btn" title="Adicionar à fila" aria-label="Adicionar ${s.title} à fila">+</button>
    `;
    row.addEventListener("click", (e) => {
      if(e.target.classList.contains("add-btn")) return;
      loadToStage(s);
    });
    row.querySelector(".add-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      addToQueue(s);
    });
    songListEl.appendChild(row);
  });
}

// Fila
function addToQueue(song){
  queue.push({ ...song, queueKey: Date.now() + Math.random() });
  renderQueue();
}

function removeFromQueue(queueKey){
  queue = queue.filter(q => q.queueKey !== queueKey);
  renderQueue();
}

function moveInQueue(queueKey, direction){
  const idx = queue.findIndex(q => q.queueKey === queueKey);
  const newIdx = idx + direction;
  if(newIdx < 0 || newIdx >= queue.length) return;
  [queue[idx], queue[newIdx]] = [queue[newIdx], queue[idx]];
  renderQueue();
}

function renderQueue(){
  queueListEl.innerHTML = "";
  if(queue.length === 0){
    queueListEl.innerHTML = '<div class="empty-msg">A fila está vazia. Adicione músicas pelo botão "+".</div>';
    document.getElementById("btnNext").disabled = true;
    return;
  }
  document.getElementById("btnNext").disabled = false;

  queue.forEach((q, i) => {
    const item = document.createElement("div");
    item.className = "queue-item";
    item.innerHTML = `
      <div class="queue-num">${i + 1}</div>
      <div>
        <div class="song-title" style="font-size:0.9rem; font-family:'Inter',sans-serif; font-weight:600;">${q.title}</div>
        <div class="song-meta">${q.artist}</div>
      </div>
      <div class="queue-controls">
        <button class="icon-btn" title="Mover para cima">↑</button>
        <button class="icon-btn" title="Mover para baixo">↓</button>
        <button class="icon-btn" title="Remover da fila">✕</button>
      </div>
    `;
    const [up, down, remove] = item.querySelectorAll(".icon-btn");
    up.addEventListener("click", () => moveInQueue(q.queueKey, -1));
    down.addEventListener("click", () => moveInQueue(q.queueKey, 1));
    remove.addEventListener("click", () => removeFromQueue(q.queueKey));
    queueListEl.appendChild(item);
  });
}

// Leitura da pasta local
function normalize(str){
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

function matchVideosToSongs(fileList){
  const videoExt = /\.(mp4|webm|ogg|mov|mkv)$/i;
  const videoFiles = Array.from(fileList).filter(f => videoExt.test(f.name));

  let matched = 0;
  SONGS.forEach(song => {
    const titleSlug = normalize(song.title);
    const artistSlug = normalize(song.artist);
    const found = videoFiles.find(f => {
      const nameSlug = normalize(f.name.replace(/\.[^.]+$/, ""));
      return nameSlug.includes(titleSlug) || nameSlug.includes(artistSlug + titleSlug);
    });
    if(found){
      song.videoSrc = URL.createObjectURL(found);
      matched++;
    }
  });
  return { total: videoFiles.length, matched };
}

document.getElementById("btnFolder").addEventListener("click", () => {
  document.getElementById("folderInput").click();
});

document.getElementById("folderInput").addEventListener("change", (e) => {
  const { total, matched } = matchVideosToSongs(e.target.files);
  document.getElementById("folderStatus").textContent =
    total === 0
      ? "Nenhum arquivo de vídeo encontrado nessa pasta."
      : `${total} vídeo(s) encontrados na pasta · ${matched} correspondido(s) ao catálogo.`;

  renderSongs();

  if(nowPlayingId){
    const current = SONGS.find(s => s.id === nowPlayingId);
    if(current) loadToStage(current);
  }
});

// Ação de Play (Finalizando a função cortada)
function loadToStage(song){
  nowPlayingId = song.id;
  nowInfo.style.display = "block";
  nowTitle.textContent = song.title;
  nowMeta.textContent = `${song.artist} · ${song.genre} · ${song.duration}`;

  // Remove qualquer iframe existente caso exista
  const existingIframe = document.getElementById("youtubeIframe");
  if(existingIframe) existingIframe.remove();

  if(song.videoSrc){
    stagePlaceholder.style.display = "none";
    stageVideo.style.display = "block";
    stageVideo.src = song.videoSrc;
    stageVideo.load();
    stageVideo.play();
  } else if(song.youtubeId){
    stagePlaceholder.style.display = "none";
    stageVideo.style.display = "none";
    
    let iframe = document.createElement("iframe");
    iframe.id = "youtubeIframe";
    iframe.src = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.allow = "autoplay; fullscreen";
    document.getElementById("stage").appendChild(iframe);
  } else {
    stageVideo.style.display = "none";
    stageVideo.src = "";
    stagePlaceholder.style.display = "flex";
    stagePlaceholder.querySelector("p").textContent = "Nenhum vídeo carregado para esta música.";
  }
  
  renderSongs(); // Atualiza a marcação verde da música tocando no catálogo
}

// Botões da Now Playing
document.getElementById("btnClear").addEventListener("click", () => {
  nowPlayingId = null;
  nowInfo.style.display = "none";
  stageVideo.pause();
  stageVideo.src = "";
  stageVideo.style.display = "none";
  
  const existingIframe = document.getElementById("youtubeIframe");
  if(existingIframe) existingIframe.remove();

  stagePlaceholder.style.display = "flex";
  stagePlaceholder.querySelector("p").textContent = "Nenhum playback carregado. Escolha uma música do catálogo.";
  renderSongs();
});

document.getElementById("btnNext").addEventListener("click", () => {
  if (queue.length > 0) {
    const nextSong = queue[0];
    removeFromQueue(nextSong.queueKey);
    loadToStage(nextSong);
  }
});

// Inicialização
renderChips();
renderSongs();
renderQueue();
