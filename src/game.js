import { applyAction, copyGame, createGame, MAX_HP } from './model.js';
import { analyzeNetwork } from './network.js';
import { key, lineCells, positionToCell } from './grid.js';
import { CAPS, COSTS, RATE, tickEconomy } from './economy.js';
import { COMBAT, createCombat, startWave, tickCombat } from './combat.js';

const board = document.querySelector('#board');
const ctx = board.getContext('2d');
const modeButtons = [...document.querySelectorAll('[data-mode]')];
const hint = document.querySelector('#hint');
const undoButton = document.querySelector('#undo');
let state = createGame();
let combat = createCombat();
let mode = 'road';
let previousCell = null;
let dragging = false;
let pointerId = null;
let gesture = null;
const history = [];
const MAX_HISTORY = 80;
const help = {
  road: 'Weg (2 Material/Feld): mit Maus oder Finger über freie Felder ziehen.',
  mine: 'Mine (18 Material): auf ein freies Erzfeld tippen. Ohne Weg bleibt sie unversorgt.',
  factory: 'Fabrik (24 Material): auf freie Fläche tippen. Mehr Produktionskapazität.',
  turret: 'MG (14 Material): benötigt Anschluss an das Versorgungsnetz und verbraucht 1 Munition je Schuss.',
  erase: 'Entfernen: Wege, Minen oder Fabriken abreißen. Intakte Gebäude geben halbes Baumaterial zurück.',
  repair: 'Reparatur (3 Material/HP): beschädigten Weg oder Gebäude antippen. Zerstörtes neu bauen.',
  damage: 'Nur Debug: Schadensereignis ohne Gegner simulieren (nicht Teil des regulären Spiels).'
};

function selectMode(next) {
  mode = next;
  for (const b of modeButtons) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
  hint.textContent = help[mode];
}
modeButtons.forEach(b => b.addEventListener('click', () => selectMode(b.dataset.mode)));

function recordUndo() {
  if (!gesture?.changed || combat.phase === 'fight' || combat.phase === 'defeat' || combat.phase === 'victory') { gesture = null; return; }
  if (history.length >= MAX_HISTORY) history.shift();
  history.push(gesture);
  gesture = null;
  undoButton.disabled = false;
}
function act(cell) {
  if (!cell || combat.phase === 'victory' || combat.phase === 'defeat') return;
  if (!gesture) gesture = { before: copyGame(state), materialDelta: 0, changed: false };
  const beforeMaterial = state.resources.material;
  if (applyAction(state, mode, cell.x, cell.y)) {
    gesture.changed = true;
    gesture.materialDelta += state.resources.material - beforeMaterial;
    draw();
  } else if (mode !== 'road' && mode !== 'erase') {
    hint.textContent = `Aktion nicht möglich: Prüfe Feld, Lagerbestand und Baukosten (${COSTS[mode] ?? 0} Material).`;
  }
}
function eventCell(e) { return positionToCell(e.clientX, e.clientY, board.getBoundingClientRect(), state.width, state.height); }
board.addEventListener('pointerdown', e => {
  if (e.button !== 0 || dragging) return;
  const cell = eventCell(e);
  if (!cell) return;
  dragging = true; pointerId = e.pointerId; previousCell = cell;
  board.setPointerCapture(e.pointerId);
  act(cell);
});
board.addEventListener('pointermove', e => {
  if (!dragging || e.pointerId !== pointerId || !['road', 'erase'].includes(mode)) return;
  const cell = eventCell(e);
  if (!cell || !previousCell) return;
  for (const point of lineCells(previousCell, cell)) act(point);
  previousCell = cell;
});
function endPointer(e) {
  if (!dragging || e.pointerId !== pointerId) return;
  dragging = false; previousCell = null; pointerId = null;
  if (board.hasPointerCapture(e.pointerId)) board.releasePointerCapture(e.pointerId);
  recordUndo();
}
board.addEventListener('pointerup', endPointer);
board.addEventListener('pointercancel', endPointer);
board.addEventListener('lostpointercapture', endPointer);
board.addEventListener('contextmenu', e => e.preventDefault());
undoButton.addEventListener('click', () => {
  if (!history.length || combat.phase !== 'prep') return;
  const last = history.pop();
  // Revert only the edited structures and the associated material cost; do not
  // rewind mining/production that occurred while the user was interacting.
  state.roads = new Map(last.before.roads);
  state.buildings = last.before.buildings.map(b => ({ ...b }));
  state.nextId = last.before.nextId;
  state.resources.material = Math.max(0, Math.min(CAPS.material, state.resources.material - last.materialDelta));
  undoButton.disabled = history.length === 0;
  draw();
});
document.querySelector('#reset').addEventListener('click', () => {
  state = createGame(); combat = createCombat(); history.length = 0; gesture = null;
  undoButton.disabled = true; draw();
});

function draw() {
  const W = board.width, H = board.height;
  const tw = W / state.width, th = H / state.height;
  const net = analyzeNetwork(state);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#102736'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#274454'; ctx.lineWidth = 1;
  for (let x = 0; x <= state.width; x++) { ctx.beginPath(); ctx.moveTo(x*tw+.5, 0); ctx.lineTo(x*tw+.5, H); ctx.stroke(); }
  for (let y = 0; y <= state.height; y++) { ctx.beginPath(); ctx.moveTo(0, y*th+.5); ctx.lineTo(W, y*th+.5); ctx.stroke(); }

  for (const tile of state.ores) {
    const [x, y] = tile.split(',').map(Number), cx = (x+.5)*tw, cy=(y+.5)*th;
    ctx.fillStyle='#3e3a37'; ctx.fillRect(x*tw+3,y*th+3,tw-6,th-6);
    ctx.fillStyle='#e0af75'; ctx.beginPath();ctx.moveTo(cx,cy-th*.3);ctx.lineTo(cx+tw*.29,cy);ctx.lineTo(cx,cy+th*.30);ctx.lineTo(cx-tw*.29,cy);ctx.closePath();ctx.fill();
  }
  for (const [tile, hp] of state.roads) {
    const [x,y] = tile.split(',').map(Number);
    const linked = net.suppliedRoads.has(tile);
    ctx.fillStyle = hp === 0 ? '#784048' : hp < MAX_HP ? '#9c7650' : linked ? '#347e65' : '#4c6270';
    ctx.fillRect(x*tw+5,y*th+5,tw-10,th-10);
    if (hp === 0) { ctx.strokeStyle='#ffaf9a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x*tw+12,y*th+12);ctx.lineTo((x+1)*tw-12,(y+1)*th-12);ctx.moveTo((x+1)*tw-12,y*th+12);ctx.lineTo(x*tw+12,(y+1)*th-12);ctx.stroke(); }
    else { ctx.fillStyle='#daf9dd';ctx.fillRect(x*tw+tw*.20,y*th+th*.42,tw*.60,th*.16); }
  }
  for (const b of state.buildings) {
    const cx=(b.x+.5)*tw, cy=(b.y+.5)*th;
    const active = net.connectedBuildings.has(b.id);
    ctx.fillStyle=b.hp===0?'#763d46':b.hp<MAX_HP?'#976643':active?'#3b86a8':'#52616d';
    ctx.beginPath();ctx.roundRect(b.x*tw+3,b.y*th+3,tw-6,th-6,7);ctx.fill();
    ctx.font='bold 24px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#ffffff';ctx.fillText(b.type==='hq'?'⌂':b.type==='mine'?'⛏':b.type==='turret'?'✹':'⚙',cx,cy-3);
    ctx.font='bold 10px system-ui';ctx.fillText(b.type==='hq'?'HQ':b.type==='mine'?'MINE':b.type==='turret'?'MG':'FAB',cx,cy+16);
    if (b.hp<MAX_HP) {ctx.fillStyle='#ecb96b';ctx.fillRect(b.x*tw+6,(b.y+1)*th-7,(tw-12)*(b.hp/MAX_HP),3);}
  }
  const mines=state.buildings.filter(b=>b.type==='mine'&&b.hp>0);
  document.querySelector('#connected').textContent=`${mines.filter(b=>net.connectedBuildings.has(b.id)).length} / ${mines.length}`;
  document.querySelector('#roads').textContent=`${net.suppliedRoads.size} / ${[...state.roads.values()].filter(hp=>hp>0).length}`;
  const activeFactories=state.buildings.filter(b => b.hp>0 && (b.type==='factory'||b.type==='hq') && net.connectedBuildings.has(b.id)).length;
  document.querySelector('#factories').textContent=activeFactories;
  const available = mines.every(b=>net.connectedBuildings.has(b.id));
  document.querySelector('#status').textContent=available?'Versorgt':'Netz getrennt';
  for (const resource of ['ore','ammo','material']) {
    document.querySelector('#'+resource).textContent=`${state.resources[resource].toFixed(1)} / ${CAPS[resource]}`;
  }
  document.querySelector('#rates').textContent=`Förderung: ${(mines.filter(b=>net.connectedBuildings.has(b.id)).length*RATE.mine).toFixed(0)} Erz/s · Fabrik: ${activeFactories*RATE.factory} Einh./s`;
  const enough = state.resources.material >= COSTS[mode];
  if (mode === 'road' || mode === 'mine' || mode === 'factory' || mode === 'turret' || mode === 'repair') {
    document.querySelector('#build-cost').textContent=`Kosten: ${COSTS[mode]} Material ${enough ? '✓' : '· zu wenig Material'}`;
  } else document.querySelector('#build-cost').textContent='';
  updateWaveHUD();
  drawEnemies();
}
function updateWaveHUD() {
  const wave = document.querySelector('#wave-status');
  const count = document.querySelector('#enemy-count');
  const button = document.querySelector('#wave-button');
  document.querySelector('#kills').textContent = combat.kills;
  count.textContent = combat.enemies.length;
  if (combat.phase === 'prep') {
    wave.textContent = `Vorbereitung ${combat.wave + 1}/${COMBAT.maxWaves}: ${Math.ceil(combat.countdown)} s`;
    button.disabled = false;
    button.textContent = `Welle ${combat.wave + 1} früher starten`;
  } else if (combat.phase === 'fight') {
    wave.textContent = `⚔ Angriffswelle ${combat.wave}/${COMBAT.maxWaves}`;
    button.disabled = true;
    button.textContent = 'Welle läuft …';
  } else {
    wave.textContent = combat.phase === 'victory' ? '🏆 Sieg – alle 3 Wellen' : '💥 Niederlage – HQ zerstört';
    button.disabled = true;
    button.textContent = combat.phase === 'victory' ? 'Mission bestanden!' : 'Neustart oben';
  }
  document.querySelector('#wave-message').textContent = combat.message;
}
function drawEnemies() {
  const tw = board.width / state.width, th = board.height / state.height;
  const ctx2 = ctx;
  ctx2.save(); ctx2.textAlign = 'center'; ctx2.textBaseline = 'middle';
  for (const e of combat.enemies) {
    const x = e.x * tw, y = e.y * th;
    ctx2.fillStyle = e.focus === 'network' ? '#f3a863' : '#ed6570';
    ctx2.beginPath();ctx2.arc(x,y,13,0,Math.PI*2);ctx2.fill();
    ctx2.fillStyle='#241e29';ctx2.font='bold 15px system-ui';ctx2.fillText('!',x,y);
    ctx2.fillStyle='#3c2830';ctx2.fillRect(x-16,y-21,32,4);
    ctx2.fillStyle='#bdebc3';ctx2.fillRect(x-16,y-21,32*(e.hp/e.maxHp),4);
  }
  for (const shot of combat.shots) {
    ctx2.strokeStyle = '#ffe4a3';ctx2.lineWidth = 3;
    ctx2.beginPath();ctx2.moveTo(shot.x1*tw,shot.y1*th);ctx2.lineTo(shot.x2*tw,shot.y2*th);ctx2.stroke();
  }
  if (combat.phase === 'victory' || combat.phase === 'defeat') {
    ctx2.fillStyle = '#081929e0';ctx2.fillRect(210,242,580,115);
    ctx2.fillStyle = combat.phase === 'victory' ? '#c5f9c8' : '#ff9b9b';
    ctx2.font = 'bold 30px system-ui';
    ctx2.fillText(combat.phase === 'victory' ? 'MISSION GESCHAFFT' : 'HAUPTFABRIK ZERSTÖRT',500,291);
    ctx2.fillStyle = '#edf5fa';ctx2.font='16px system-ui';ctx2.fillText('Neustart über die Schaltfläche oben',500,325);
  }
  ctx2.restore();
}
document.querySelector('#wave-button').addEventListener('click', () => {
  if (startWave(combat)) { history.length = 0; gesture = null; undoButton.disabled = true; draw(); }
});
selectMode('road'); draw();
// Fixed-rate world stepping. Hidden tabs do not accumulate free production or attacks.
setInterval(() => {
  if (document.hidden || combat.phase === 'victory' || combat.phase === 'defeat') return;
  const was = combat.phase;
  tickEconomy(state, 0.1);
  tickCombat(state, combat, 0.1);
  if (was !== combat.phase && (was === 'fight' || combat.phase === 'fight')) {
    history.length = 0; gesture = null; undoButton.disabled = true;
  }
  draw();
}, 100);
