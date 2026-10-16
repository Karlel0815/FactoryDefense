import { applyAction, copyGame, createGame, MAX_HP } from './model.js';
import { analyzeNetwork } from './network.js';
import { key, lineCells, positionToCell } from './grid.js';

const board = document.querySelector('#board');
const ctx = board.getContext('2d');
const modeButtons = [...document.querySelectorAll('[data-mode]')];
const hint = document.querySelector('#hint');
const undoButton = document.querySelector('#undo');
let state = createGame();
let mode = 'road';
let previousCell = null;
let dragging = false;
let pointerId = null;
let pendingUndo = null;
const history = [];
const MAX_HISTORY = 80;
const help = {
  road: 'Weg: mit Maus oder Finger über freie Felder ziehen. Verbindungen verlaufen waagrecht/senkrecht.',
  mine: 'Mine: auf ein sichtbares, unbebautes Erzfeld tippen. Ohne Weg bleibt sie unversorgt.',
  erase: 'Entfernen: Wege oder Minen abreißen, Hauptfabrik bleibt erhalten.',
  repair: 'Reparatur: beschädigten Weg oder Gebäude antippen. Zerstörtes muss neu gebaut werden.',
  damage: 'Testschaden (nur DEV1): Ein Treffer pro Antippen. Ein Weg mit null HP unterbricht das Netz.'
};

function selectMode(next) {
  mode = next;
  for (const b of modeButtons) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
  hint.textContent = help[mode];
}
modeButtons.forEach(b => b.addEventListener('click', () => selectMode(b.dataset.mode)));

function recordUndo() {
  if (!pendingUndo) return;
  if (history.length >= MAX_HISTORY) history.shift();
  history.push(pendingUndo);
  pendingUndo = null;
  undoButton.disabled = false;
}
function act(cell) {
  if (!cell) return;
  if (!pendingUndo) pendingUndo = copyGame(state);
  if (applyAction(state, mode, cell.x, cell.y)) {
    draw();
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
  // No-op gestures must not create an undo entry.
  if (pendingUndo && JSON.stringify(serialize(state)) !== JSON.stringify(serialize(pendingUndo))) recordUndo();
  else pendingUndo = null;
}
board.addEventListener('pointerup', endPointer);
board.addEventListener('pointercancel', endPointer);
board.addEventListener('lostpointercapture', endPointer);
board.addEventListener('contextmenu', e => e.preventDefault());
function serialize(s) { return { roads: [...s.roads], buildings: s.buildings, nextId: s.nextId }; }
undoButton.addEventListener('click', () => {
  if (!history.length) return;
  state = history.pop();
  undoButton.disabled = history.length === 0;
  draw();
});
document.querySelector('#reset').addEventListener('click', () => {
  state = createGame(); history.length = 0; pendingUndo = null;
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
    ctx.fillStyle='#ffffff';ctx.fillText(b.type==='hq'?'⌂':'⛏',cx,cy-3);
    ctx.font='bold 10px system-ui';ctx.fillText(b.type==='hq'?'HQ':'MINE',cx,cy+16);
    if (b.hp<MAX_HP) {ctx.fillStyle='#ecb96b';ctx.fillRect(b.x*tw+6,(b.y+1)*th-7,(tw-12)*(b.hp/MAX_HP),3);}
  }
  const mines=state.buildings.filter(b=>b.type==='mine'&&b.hp>0);
  document.querySelector('#connected').textContent=`${mines.filter(b=>net.connectedBuildings.has(b.id)).length} / ${mines.length}`;
  document.querySelector('#roads').textContent=`${net.suppliedRoads.size} / ${[...state.roads.values()].filter(hp=>hp>0).length}`;
  document.querySelector('#status').textContent=mines.every(b=>net.connectedBuildings.has(b.id))?'Versorgt':'Netz getrennt';
}
selectMode('road');draw();
