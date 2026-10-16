import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, copyGame, applyAction } from '../src/model.js';
import { CAPS, COSTS, tickEconomy } from '../src/economy.js';
import { analyzeNetwork } from '../src/network.js';
const approx = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `expected ${b}, got ${a}`);
test('start stock and 50:50 mining/production',()=>{
 const s=createGame();assert.deepEqual(s.resources,{ore:0,ammo:0,material:50});
 const out=tickEconomy(s,.5);
 approx(out.mined,2);approx(out.ammo,.5);approx(out.material,.5);
 approx(s.resources.ore,1);approx(s.resources.ammo,.5);approx(s.resources.material,50.5);
});
test('redirect to material if ammo full',()=>{
 const s=createGame();s.resources={ore:50,ammo:CAPS.ammo,material:0};
 tickEconomy(s,.5);approx(s.resources.ammo,CAPS.ammo);approx(s.resources.material,1);
});
test('redirect to ammo if material full',()=>{
 const s=createGame();s.resources={ore:50,ammo:0,material:CAPS.material};
 tickEconomy(s,.5);approx(s.resources.ammo,1);approx(s.resources.material,CAPS.material);
});
test('partially full store keeps its room and redirects remaining',()=>{
 const s=createGame();s.resources={ore:30,ammo:99.8,material:40};
 tickEconomy(s,.5);approx(s.resources.ammo,100);approx(s.resources.material,40.8);
});
test('both finished stocks full: no ore consumed',()=>{
 const s=createGame();s.resources={ore:CAPS.ore,ammo:CAPS.ammo,material:CAPS.material};
 tickEconomy(s,.5);approx(s.resources.ore,CAPS.ore);
});
test('isolating the mine stops mining but HQ processes stored ore',()=>{
 const s=createGame();s.resources.ore=8;applyAction(s,'erase',3,6);
 const out=tickEconomy(s,.5);
 approx(out.mined,0);approx(out.material,.5);approx(out.ammo,.5);
 approx(s.resources.ore,7);
});
test('destroyed HQ stops all processing',()=>{
 const s=createGame();s.resources.ore=20;
 for(let i=0;i<3;i++)applyAction(s,'damage',2,6);
 const before=copyGame(s);tickEconomy(s,.5);
 assert.deepEqual(s.resources,before.resources);
});
test('only connected factory increases throughput',()=>{
 const s=createGame();s.resources.ore=60;
 assert.equal(applyAction(s,'factory',2,5),true);
 approx(s.resources.material,50-COSTS.factory);
 let out=tickEconomy(s,.5);approx(out.ammo,1);approx(out.material,1);
 assert.equal(applyAction(s,'factory',17,5),true);
 out=tickEconomy(s,.5);approx(out.ammo,1);approx(out.material,1);
});
test('no building or repair without required material',()=>{
 const s=createGame();s.resources.material=0;
 for(const [m,x,y] of [['road',1,1],['mine',9,2],['factory',1,1],['repair',3,6]])
   assert.equal(applyAction(s,m,x,y),false);
 assert.deepEqual(s.resources,{ore:0,ammo:0,material:0});
 assert.equal(s.roads.size,2);assert.equal(s.buildings.length,2);
});
test('repair consumes material; zero HP must be rebuilt',()=>{
 const s=createGame();applyAction(s,'damage',3,6);
 assert.equal(applyAction(s,'repair',3,6),true);
 approx(s.resources.material,50-COSTS.repair);
 for(let i=0;i<3;i++)applyAction(s,'damage',3,6);
 assert.equal(applyAction(s,'repair',3,6),false);
 assert.equal(applyAction(s,'road',3,6),true);
 approx(s.resources.material,50-COSTS.repair-COSTS.road);
});
test('salvage capped, no salvage on destroyed objects',()=>{
 const s=createGame();
 assert.equal(applyAction(s,'mine',9,2),true);
 approx(s.resources.material,50-COSTS.mine);
 assert.equal(applyAction(s,'erase',9,2),true);
 approx(s.resources.material,50-COSTS.mine+Math.floor(COSTS.mine/2));
 s.resources.material=CAPS.material;
 assert.equal(applyAction(s,'erase',3,6),true);
 approx(s.resources.material,CAPS.material);
 assert.equal(applyAction(s,'mine',9,2),true);
 for(let i=0;i<3;i++)applyAction(s,'damage',9,2);
 const before=s.resources.material;
 assert.equal(applyAction(s,'erase',9,2),true);
 approx(s.resources.material,before);
});
test('invalid time ignored; elapsed time capped to prevent offline farm',()=>{
 const s=createGame(),before=copyGame(s);
 for(const dt of [-1,0,NaN,Infinity])tickEconomy(s,dt);
 assert.deepEqual(s.resources,before.resources);
 tickEconomy(s,10);approx(s.resources.ammo,.5);
});
test('stress: no negative or over-cap stock through damage and expansion',()=>{
 const s=createGame();
 for(let i=0;i<3000;i++){
   if(i===400)s.resources.ammo=CAPS.ammo;
   if(i===800)s.resources.material=CAPS.material;
   if(i===1500)applyAction(s,'erase',3,6);
   if(i===1800)applyAction(s,'road',3,6);
   tickEconomy(s,.1);
   for(const k of Object.keys(CAPS))
     assert.ok(s.resources[k]>=-1e-8&&s.resources[k]<=CAPS[k]+1e-8,`${k} cap failed: ${s.resources[k]}`);
 }
});