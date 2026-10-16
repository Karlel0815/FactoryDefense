import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction } from '../src/model.js';
import { analyzeNetwork } from '../src/network.js';
import { tickEconomy } from '../src/economy.js';
import { createCombat, startWave, tickCombat, COMBAT, chooseTarget, hurtInfrastructure } from '../src/combat.js';
const advance = (s,c,n) => {for(let i=0;i<n;i++) {tickEconomy(s,.1);tickCombat(s,c,.1)}};
const tower = (s, x=3, y=5) => {assert.ok(applyAction(s,'turret',x,y));return s.buildings.find(b=>b.type==='turret'&&b.x===x&&b.y===y)};

test('turret costs material, must not be placed on ore, HQ or roads',()=>{
 const s=createGame(),before=s.resources.material;
 assert.equal(applyAction(s,'turret',2,6),false);
 assert.equal(applyAction(s,'turret',5,6),false);
 assert.equal(applyAction(s,'turret',3,6),false);
 assert.equal(applyAction(s,'turret',3,5),true);
 assert.equal(s.resources.material,before-14);
});
test('waves only start on request/countdown and cannot be started twice',()=>{
 const s=createGame(),c=createCombat();
 assert.equal(c.phase,'prep');
 tickCombat(s,c,.1);assert.equal(c.wave,0);
 assert.equal(startWave(c),true);assert.equal(c.wave,1);
 assert.equal(startWave(c),false);assert.equal(c.wave,1);
});
test('countdown automatically starts first wave',()=>{
 const s=createGame(),c=createCombat();
 for(let i=0;i<241;i++)tickCombat(s,c,.1);
 assert.equal(c.phase,'fight');assert.equal(c.wave,1);
});
test('attackers target mine, roads and factories instead of going only to HQ',()=>{
 const s=createGame();
 const mineTarget=chooseTarget(s,{x:6.5,y:6.5,focus:'structure'});
 assert.equal(mineTarget.id,'mine-1');
 const roadTarget=chooseTarget(s,{x:4.5,y:6.5,focus:'network'});
 assert.equal(roadTarget.type,'road');
});
test('enemy damages live road and disconnects mine; destroyed target not selected',()=>{
 const s=createGame(),c=createCombat();
 const t={type:'road',id:'3,6'};
 for(let i=0;i<5;i++)assert.equal(hurtInfrastructure(s,t,.6),true);
 assert.equal(s.roads.get('3,6'),0);
 assert.equal(analyzeNetwork(s).connectedBuildings.has('mine-1'),false);
 assert.equal(hurtInfrastructure(s,t,.6),false);
});
test('turret uses ammo per shot and deals damage only when connected',()=>{
 const s=createGame(),t=tower(s);s.resources.ammo=8;
 const c=createCombat();startWave(c);
 const e={id:1,x:5,y:5.5,hp:3,maxHp:3,focus:'structure',attackClock:0};
 c.enemies=[e];c.spawned=COMBAT.waveSizes[0];
 tickCombat(s,c,.1);
 assert.equal(s.resources.ammo,7);assert.equal(e.hp,2);assert.ok(c.shots.length>0);
});
test('disconnected turret does not fire or consume ammunition',()=>{
 const s=createGame(),t=tower(s);s.resources.ammo=9;
 const c=createCombat();startWave(c);c.enemies=[{id:1,x:5,y:5.5,hp:3,maxHp:3,focus:'structure',attackClock:0}];c.spawned=3;
 applyAction(s,'erase',3,6);
 assert.equal(analyzeNetwork(s).connectedBuildings.has(t.id),false);
 tickCombat(s,c,.1);assert.equal(s.resources.ammo,9);
});
test('empty ammo does not fire; production can later resupply turret',()=>{
 const s=createGame();tower(s);s.resources.ammo=0;
 const c=createCombat();startWave(c);c.enemies=[{id:1,x:5,y:5.5,hp:3,maxHp:3,focus:'structure',attackClock:0}];c.spawned=3;
 tickCombat(s,c,.1);assert.equal(c.enemies[0].hp,3);
 advance(s,c,15);assert.ok(s.resources.ammo>0);
});
test('repair is possible during a running wave and never overheals fractional damage',()=>{
 const s=createGame(),c=createCombat();startWave(c);
 hurtInfrastructure(s,{type:'building',id:'hq'},.6);
 assert.equal(s.buildings[0].hp,2.4);
 assert.ok(applyAction(s,'repair',2,6));
 assert.equal(s.buildings[0].hp,3);
 assert.equal(c.phase,'fight');
});
test('HQ loss ends game and prevents restarting waves',()=>{
 const s=createGame(),c=createCombat();startWave(c);
 hurtInfrastructure(s,{type:'building',id:'hq'},4);
 tickCombat(s,c,.1);assert.equal(c.phase,'defeat');
 assert.equal(startWave(c),false);
});
test('successive waves grow and three cleared waves end in victory',()=>{
 const s=createGame(),c=createCombat();startWave(c);
 for(let wave=1;wave<=3;wave++){
   if(wave>1)assert.equal(startWave(c),true);
   const limit=COMBAT.waveSizes[wave-1];
   for(let t=0;t<1800 && c.phase==='fight';t++){
     tickCombat(s,c,.1);
     for(const e of c.enemies)e.hp=0; // independent perfect defense kills incoming units
   }
   assert.equal(c.wave,wave);
   assert.equal(c.phase,wave===3?'victory':'prep');
   assert.ok(c.kills>=limit);
 }
 assert.equal(startWave(c),false);
});
test('invalid ticks do not change battle state',()=>{
 const s=createGame(),c=createCombat();const before=structuredClone(c);
 for (const d of [0,NaN,-1,Infinity])tickCombat(s,c,d);
 assert.deepEqual(c,before);
});
test('production and damage stress run never creates negative ammo or health',()=>{
 const s=createGame(),c=createCombat();tower(s);startWave(c);
 for(let i=0;i<2000 && !['defeat','victory'].includes(c.phase);i++){
  tickEconomy(s,.1);tickCombat(s,c,.1);
  assert.ok(s.resources.ammo>=-1e-8&&s.resources.ammo<=100);
  for(const b of s.buildings)assert.ok(b.hp>=0&&b.hp<=3);
  for(const hp of s.roads.values())assert.ok(hp>=0&&hp<=3);
 }
});
test('live battle can end in a victory with two turrets, one turret does not auto-win',()=>{
  for(const number of [1,2]) {
    const s=createGame(),c=createCombat();
    tower(s,3,5);if(number===2)tower(s,2,5);
    for(let i=0;i<4000 && !['victory','defeat'].includes(c.phase);i++){
      tickEconomy(s,.1);tickCombat(s,c,.1);
    }
    assert.equal(c.phase,number===2?'victory':'defeat');
    if(number===2)assert.equal(c.kills,COMBAT.waveSizes.reduce((a,b)=>a+b,0));
  }
});
