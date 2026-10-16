import { applyAction, copyGame, createGame, MAX_HP } from './model.js';
import { analyzeNetwork } from './network.js';
import { key, lineCells, positionToCell } from './grid.js';
import { CAPS, COSTS, RATE, syncTotals, tickEconomy } from './economy.js';
import { COMBAT, createCombat, startWave, orderUnit, tickCombat } from './combat.js';

const board=document.querySelector('#board'),ctx=board.getContext('2d');
const modeButtons=[...document.querySelectorAll('[data-mode]')],hint=document.querySelector('#hint');
const undoButton=document.querySelector('#undo');
let state=createGame(),combat=createCombat(),mode='ore',pointerId=null,previousCell=null,gesture=null;
const history=[],MAX_HISTORY=60;
const help={
 ore:'🟨 Erzband: Verbinde Erzminen mit Fabriken. Nur gelbe Segmente transportieren Erz.',
 ammo:'🟦 Munitionsband: Verbinde Fabriken mit MGs. Blaue Segmente dürfen sich nicht mit gelben verbinden.',
 mine:'Mine (18 Baumaterial): Setze eine Mine auf einem sichtbaren Erzfeld; anschließen mit gelbem Band.',
 factory:'Fabrik (24 Baumaterial): Annahme von Erz über gelbes Band, Ausgabe von Munition über blaues Band.',
 turret:'MG (14 Baumaterial): Benötigt blaue Verbindung zur Fabrik und lokal erzeugte Munition.',
 erase:'Entfernen: Bänder oder Gebäude abreißen. Die letzte intakte Fabrik ist gegen versehentliches Entfernen gesperrt.',
 repair:'Reparatur (3 Baumaterial/HP): Funktioniert auch während einer Welle. Vollständig zerstörte Teile neu bauen.',
 damage:'Testschaden: Einmal antippen beschädigt Gebäude oder Band. Nur im Prototyp.'
};
function selectMode(next){mode=next;modeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));hint.textContent=help[mode];draw();}
modeButtons.forEach(b=>b.addEventListener('click',()=>selectMode(b.dataset.mode)));
function markHistory(){if(!gesture?.changed||combat.phase!=='prep'){gesture=null;return;}if(history.length===MAX_HISTORY)history.shift();history.push(gesture);gesture=null;undoButton.disabled=false;}
function perform(cell){
 if(!cell||['victory','defeat'].includes(combat.phase))return;
 if(!gesture)gesture={before:copyGame(state),materialDelta:0,changed:false};
 const before=state.resources.material;
 if(applyAction(state,mode,cell.x,cell.y)){
  gesture.changed=true;gesture.materialDelta+=state.resources.material-before;draw();
 }else if(!['ore','ammo','erase'].includes(mode))hint.textContent=`Nicht möglich. Feldbelegung, Bandtyp oder Baumaterial prüfen!`;
}
const eventCell=e=>positionToCell(e.clientX,e.clientY,board.getBoundingClientRect(),state.width,state.height);
board.addEventListener('pointerdown',e=>{
 if(e.button!==0||pointerId!==null)return;const cell=eventCell(e);if(!cell)return;
 pointerId=e.pointerId;previousCell=cell;board.setPointerCapture(pointerId);perform(cell);
});
board.addEventListener('pointermove',e=>{
 if(e.pointerId!==pointerId||!['ore','ammo','erase'].includes(mode))return;
 const cell=eventCell(e);if(!cell||!previousCell)return;
 for(const p of lineCells(previousCell,cell))perform(p);
 previousCell=cell;
});
function finish(e){if(e.pointerId!==pointerId)return;pointerId=null;previousCell=null;markHistory();}
board.addEventListener('pointerup',finish);board.addEventListener('pointercancel',finish);board.addEventListener('lostpointercapture',finish);
board.addEventListener('contextmenu',e=>e.preventDefault());
undoButton.addEventListener('click',()=>{
 if(!history.length||combat.phase!=='prep')return;
 const action=history.pop(),current=state;
 state.belts={ore:new Map(action.before.belts.ore),ammo:new Map(action.before.belts.ammo)};
 state.buildings=action.before.buildings.map(b=>{
  const live=current.buildings.find(x=>x.id===b.id);
  return {...b,store:b.type==='factory'?(live?.store?{...live.store}:{...b.store}):undefined};
 });
 state.nextId=action.before.nextId;
 state.resources.material=Math.max(0,Math.min(CAPS.material,state.resources.material-action.materialDelta));
 syncTotals(state);undoButton.disabled=history.length===0;draw();
});
document.querySelector('#reset').addEventListener('click',()=>{
 state=createGame();combat=createCombat();history.length=0;gesture=null;undoButton.disabled=true;draw();
});
document.querySelector('#wave-button').addEventListener('click',()=>{if(startWave(combat)){history.length=0;undoButton.disabled=true;gesture=null;draw();}});
document.querySelector('#order-unit').addEventListener('click',()=>{
 const factories=state.buildings.filter(b=>b.type==='factory'&&b.hp>0);
 const factory=factories.sort((a,b)=>combat.orders.filter(o=>o.factoryId===a.id).length-combat.orders.filter(o=>o.factoryId===b.id).length)[0];
 if(!factory||!orderUnit(state,combat,factory.id))hint.textContent='Einheit nicht bestellbar: Baumaterial fehlt, Fabrik zerstört oder Warteschlange voll.';
 else hint.textContent='Einheit im Bau. Nach der Fertigung greift sie automatisch den markierten Bunker an.';
 draw();
});
function draw(){
 const tw=board.width/state.width,th=board.height/state.height,net=analyzeNetwork(state);
 ctx.clearRect(0,0,board.width,board.height);ctx.fillStyle='#102736';ctx.fillRect(0,0,board.width,board.height);
 ctx.strokeStyle='#274454';ctx.lineWidth=1;
 for(let x=0;x<=state.width;x++){ctx.beginPath();ctx.moveTo(x*tw+.5,0);ctx.lineTo(x*tw+.5,board.height);ctx.stroke();}
 for(let y=0;y<=state.height;y++){ctx.beginPath();ctx.moveTo(0,y*th+.5);ctx.lineTo(board.width,y*th+.5);ctx.stroke();}
 for(const tile of state.ores){const [x,y]=tile.split(',').map(Number);const cx=(x+.5)*tw,cy=(y+.5)*th;
  ctx.fillStyle='#3e3a37';ctx.fillRect(x*tw+3,y*th+3,tw-6,th-6);ctx.fillStyle='#e0b66a';ctx.beginPath();ctx.moveTo(cx,cy-th*.3);ctx.lineTo(cx+tw*.28,cy);ctx.lineTo(cx,cy+th*.3);ctx.lineTo(cx-tw*.28,cy);ctx.closePath();ctx.fill();}
 for(const type of ['ore','ammo'])for(const [tile,hp] of state.belts[type]){
  const [x,y]=tile.split(',').map(Number),online=net.connected[type].has(tile);
  ctx.fillStyle=hp<=0?'#753b46':hp<MAX_HP?'#9e6c51':type==='ore'?(online?'#c99b42':'#675b43'):(online?'#3d90ba':'#39596c');
  ctx.fillRect(x*tw+5,y*th+5,tw-10,th-10);
  if(hp<=0){ctx.strokeStyle='#ffb2b2';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x*tw+13,y*th+12);ctx.lineTo((x+1)*tw-13,(y+1)*th-12);ctx.moveTo((x+1)*tw-13,y*th+12);ctx.lineTo(x*tw+13,(y+1)*th-12);ctx.stroke();}
  else{ctx.fillStyle=type==='ore'?'#fff0be':'#d3f3ff';ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(type==='ore'?'◆':'➜',(x+.5)*tw,(y+.5)*th);}
 }
 for(const b of state.buildings){const cx=(b.x+.5)*tw,cy=(b.y+.5)*th;
  const connected=b.type==='factory'?true:b.type==='mine'?net.mineOwner.has(b.id):(net.turretProviders.has(b.id));
  ctx.fillStyle=b.hp<=0?'#753b46':b.hp<MAX_HP?'#a07349':!connected?'#526574':b.type==='factory'?'#327c73':b.type==='turret'?'#3a7599':'#376f56';
  ctx.beginPath();ctx.roundRect(b.x*tw+3,b.y*th+3,tw-6,th-6,7);ctx.fill();
  ctx.fillStyle='#ffffff';ctx.font='bold 24px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.type==='mine'?'⛏':b.type==='turret'?'✹':'⚙',cx,cy-4);
  ctx.font='bold 10px system-ui';ctx.fillText(b.type==='mine'?'MINE':b.type==='turret'?'MG':'FAB',cx,cy+16);
  if(b.hp<MAX_HP){ctx.fillStyle='#ffb265';ctx.fillRect(b.x*tw+6,(b.y+1)*th-7,(tw-12)*(b.hp/MAX_HP),3);}
 }
 const bunker=combat.bunker,bx=bunker.x*tw,by=bunker.y*th;
 ctx.fillStyle=bunker.hp>0?'#973d4e':'#42474a';ctx.beginPath();ctx.roundRect((bunker.x-.5)*tw+3,(bunker.y-.5)*th+3,tw-6,th-6,6);ctx.fill();
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='white';ctx.font='bold 12px system-ui';ctx.fillText('BUNK',bx,by);
 ctx.fillStyle='#702c36';ctx.fillRect(bx-22,by-30,44,5);ctx.fillStyle='#f5a576';ctx.fillRect(bx-22,by-30,44*(bunker.hp/bunker.maxHp),5);
 for(const e of combat.enemies){const x=e.x*tw,y=e.y*th;ctx.fillStyle=e.focus==='network'?'#edaa66':'#ee6670';ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#29262b';ctx.font='bold 13px system-ui';ctx.fillText('!',x,y);ctx.fillStyle='#9be8b7';ctx.fillRect(x-15,y-18,30*(e.hp/e.maxHp),3);}
 for(const u of combat.units){const x=u.x*tw,y=u.y*th;ctx.fillStyle='#6cdab9';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#14363b';ctx.font='bold 13px system-ui';ctx.fillText('➤',x,y);}
 for(const shot of combat.shots){ctx.strokeStyle=shot.team==='enemy'?'#ff7b75':shot.team==='unit'?'#96ffd1':'#ffe0a2';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(shot.x1*tw,shot.y1*th);ctx.lineTo(shot.x2*tw,shot.y2*th);ctx.stroke();}
 updateHUD(net);
}
function updateHUD(net){
 const mines=state.buildings.filter(b=>b.type==='mine'&&b.hp>0),turrets=state.buildings.filter(b=>b.type==='turret'&&b.hp>0);
 document.querySelector('#connected').textContent=`${mines.filter(b=>net.mineOwner.has(b.id)).length} / ${mines.length}`;
 document.querySelector('#turrets').textContent=`${turrets.filter(b=>net.turretProviders.has(b.id)).length} / ${turrets.length}`;
 document.querySelector('#factories').textContent=net.factories.length;
 document.querySelector('#status').textContent=mines.every(b=>net.mineOwner.has(b.id))&&turrets.every(b=>net.turretProviders.has(b.id))?'Verbunden':'Netz getrennt';
 for(const v of ['ore','ammo','material'])document.querySelector('#'+v).textContent=`${state.resources[v].toFixed(1)} / ${CAPS[v]}`;
 document.querySelector('#rates').textContent=`Erzförderung: ${[...net.mineOwner].length*RATE.mine}/s · Fabriken: ${net.factories.length*RATE.factory} Einh./s`;
 document.querySelector('#build-cost').textContent=COSTS[mode]?`Kosten: ${COSTS[mode]} Baumaterial ${state.resources.material+1e-8>=COSTS[mode]?'✓':'· zu wenig'}`:'';
 document.querySelector('#enemy-count').textContent=combat.enemies.length;
 document.querySelector('#kills').textContent=combat.kills;
 const wave=document.querySelector('#wave-status'),button=document.querySelector('#wave-button');
 if(combat.phase==='prep'){wave.textContent=`Vorbereitung ${combat.wave+1}/3: ${Math.ceil(combat.countdown)} s`;button.textContent='Welle früher starten';button.disabled=false;}
 else if(combat.phase==='fight'){wave.textContent=`⚔ Angriffswelle ${combat.wave}/3`;button.textContent='Welle läuft …';button.disabled=true;}
 else if(combat.phase==='siege'){wave.textContent='Alle 3 Wellen abgewehrt';button.textContent='Bunker angreifen!';button.disabled=true;}
 else{wave.textContent=combat.phase==='victory'?'🏆 Sieg – Bunker zerstört':'💥 Niederlage – keine Fabrik';button.textContent='Neu starten';button.disabled=true;}
 document.querySelector('#wave-message').textContent=combat.message;
 document.querySelector('#bunker-status').textContent=`Bunker: ${combat.bunker.hp.toFixed(1)} / ${COMBAT.bunkerHp} HP`;
 document.querySelector('#unit-status').textContent=`${combat.units.length} unterwegs · ${combat.orders.length} im Bau`;
 document.querySelector('#order-unit').disabled=['victory','defeat'].includes(combat.phase)||combat.orders.length>=3||!net.factories.length||state.resources.material<COSTS.unit;
 undoButton.disabled=combat.phase!=='prep'||history.length===0;
}
selectMode('ore');draw();
// No fast-forward on inactive browser tabs; economical and fighting simulation
// advance in the same fixed step for predictable testing.
setInterval(()=>{if(document.hidden)return;tickEconomy(state,.1);tickCombat(state,combat,.1);if(combat.phase!=='prep')history.length=0;draw();},100);
