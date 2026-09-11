/* =====================================================================
  FONTE DE DADOS
  O catálogo (título, artista, gênero) fica cadastrado aqui embaixo.
  O VÍDEO de cada música não precisa mais ser digitado à mão: clicando
  em "Selecionar pasta de vídeos", o navegador lê os arquivos da pasta
  escolhida e casa cada arquivo com uma música pelo nome (comparando
  o nome do arquivo com o título/artista, ignorando acentos, espaços
  e maiúsculas). Dica: nomeie os arquivos como
  "Artista - Título.mp4" para facilitar o casamento automático.

  Ainda é possível fixar um vídeo manualmente por música com
  videoSrc (arquivo/URL) ou youtubeId (ID do YouTube) — útil como
  plano B para músicas que a busca por pasta não encontrar.
===================================================================== */
const SONGS = [
 { id: 1, title: "Firmado na Rocha", artist: "Alessandro Vilas Boas", genre: "Worship", duration: "10:19", videoSrc: "", youtubeId: "" },
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

function renderChips(){
 genreChipsEl.innerHTML = "";
 genres.forEach(g => {
   const chip = document.createElement("button");
   chip.className = "chip" + (g === activeGenre ? " active" : "");
   chip.textContent = g;
   chip.addEventListener("click", () => { activeGenre = g; renderSongs(); });
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
   row.addEventListener("keydown", (e) => {
     if(e.key === "Enter") loadToStage(s);
   });
   songListEl.appendChild(row);
 });
}

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
       <button class="icon-btn" title="Mover para cima" aria-label="Mover para cima">↑</button>
       <button class="icon-btn" title="Mover para baixo" aria-label="Mover para baixo">↓</button>
       <button class="icon-btn" title="Remover da fila" aria-label="Remover da fila">✕</button>
     </div>
   `;
   const [up, down, remove] = item.querySelectorAll(".icon-btn");
   up.addEventListener("click", () => moveInQueue(q.queueKey, -1));
   down.addEventListener("click", () => moveInQueue(q.queueKey, 1));
   remove.addEventListener("click", () => removeFromQueue(q.queueKey));
   queueListEl.appendChild(item);
 });
}

/* ---------- Leitura da pasta local de vídeos ---------- */
function normalize(str){
 return str
   .toLowerCase()
   .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
   .replace(/[^a-z0-9]/g, "");
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

 // Se a música que está no palco agora ganhou vídeo, recarrega o palco
 if(nowPlayingId){
   const current = SONGS.find(s => s.id === nowPlayingId);
   if(current) loadToStage(current);
 }
});

function loadToStage(song){
 nowPlayingId = song.id;
 nowInfo.style.display = "block";
 nowTitle.textContent = song.title;
 nowMeta.textContent = `${song.artist} · ${song.genre} · ${song.duration}`;

 if(song.videoSrc){
   stagePlaceholder.style.display = "none";
   stageVideo.style.display = "block";
   stageVideo.src = song.videoSrc;
   stageVideo.load();
 } else if(song.youtubeId){
   // Troca o <video> por um iframe do YouTube quando um ID é fornecido
   stagePlaceholder.style.display = "none";
   stageVideo.style.display = "none";
   let iframe = document.getElementById("stageIframe");
   if(!iframe){
     iframe = document.createElement("iframe");
     iframe.id = "stageIframe";
     iframe.style.cssText = "width:100%;height:100%;border:0;";
     iframe.allow = "autoplay; encrypted-media";
     iframe.allowFullscreen = true;
     document.getElementById("stage").appendChild(iframe);
   }
   iframe.style.display = "block";
   iframe.src = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`;
 } else {
   stageVideo.style.display = "none";
   const iframe = document.getElementById("stageIframe");
   if(iframe) iframe.style.display = "none";
   stagePlaceholder.style.display = "flex";
   stagePlaceholder.querySelector("p").textContent =
     `Sem prévia cadastrada para "${song.title}". Adicione um videoSrc ou youtubeId nos dados da música.`;
 }
 renderSongs();
}

function clearStage(){
 nowPlayingId = null;
 nowInfo.style.display = "none";
 stageVideo.pause();
 stageVideo.removeAttribute("src");
 stageVideo.style.display = "none";
 const iframe = document.getElementById("stageIframe");
 if(iframe){ iframe.src = ""; iframe.style.display = "none"; }
 stagePlaceholder.style.display = "flex";
 stagePlaceholder.querySelector("p").textContent =
   "Nenhum playback carregado. Escolha uma música no catálogo ao lado.";
 renderSongs();
}

document.getElementById("btnNext").addEventListener("click", () => {
 if(queue.length === 0) return;
 const next = queue.shift();
 loadToStage(next);
 renderQueue();
});
document.getElementById("btnClear").addEventListener("click", clearStage);

document.getElementById("search").addEventListener("input", (e) => {
 searchTerm = e.target.value;
 renderSongs();
});

renderChips();
renderSongs();
renderQueue();
                         
