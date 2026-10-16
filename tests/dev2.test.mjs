import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, copyGame, applyAction } from '../src/model.js';
import { CAPS, COSTS, RATE, tickEconomy } from '../src/economy.js';
import { analyzeNetwork } from '../src/network.js';
const approx = (actual,expected) => assert.ok(Math.abs(actual-expected)<1e-8, `expected ${expected}, got ${actual}`);

test('start resources, nominal mining and equal factory production', () => {
 const s=createGame();assert.deepEqual(s.resources,{ore:0,ammo:0,material:50});
 const out=tickEconomy(s,0.5);
 approx(out.mined,2);approx(out.ammo,0.5);approx(out.material,0.5);
 approx(s.resources.ore,1);approx(s.resources.ammo,0.5);approx(s.resources.material,50.5);
});
test('production redirects all capacity if ammo full', () => {
 const s=createGame();s.resources={ore:50,ammo:CAPS.ammo,material:0};
 tickEconomy(s,0.5);approx(s.resources.ammo,CAPS.ammo);approx(s.resources.material,1);
});
test('production redirects to ammo if material full', () => {
 const s=createGame();s.resources={ore:50,ammo:0,material:CAPS.material};
 tickEconomy(s,0.5);approx(s.resources.ammo,1);approx(s.resources.material,CAPS.material);
});
test('small remaining room is filled before redirecting the balance', () => {
 const s=createGame();s.resources={ore:30,ammo:99.8,material:40};
 tickEconomy(s,0.5);approx(s.resources.ammo,100);approx(s.resources.material,40.8);
});
test('full finished products do not consume ore, and capped ore never overflows', () => {
 const s=createGame();s.resources={ore:CAPS.ore,ammo:CAPS.ammo,material:CAPS.material};
 tickEconomy(s,0.5);approx(s.resources.ore,CAPS.ore);
 approx(s.resources.ammo,CAPS.ammo);approx(s.resources.material,CAPS.material);
});
test('network cut immediately stops mining; HQ can process leftover ore', () => {
 const s=createGame();s.resources.ore=8;
 applyAction(s,'erase',3,6);
 const out=tickEconomy(s,0.5);
 approx(out.mined,0);approx(out.material,0.5);approx(out.ammo,0.5);
 approx(s.resources.ore,7);
});
test('destroyed HQ stops production, even with ore, other factory has no supply', () => {
 const s=createGame();s.resources.ore=20;
 for(let i=0;i<3;i++) applyAction(s,'damage',2,6);
 const before=copyGame(s);tickEconomy(s,0.5);
 assert.deepEqual(s.resources,before.resources);
});
test('factory purchase on clear tile increases production only when connected', () => {
 const s=createGame();s.resources.ore=60;
 assert.equal(applyAction(s,'factory',2,5),true); // adjacent HQ
 approx(s.resources.material,50-COSTS.factory);
 const m=tickEconomy(s,0.5);
 approx(m.ammo,1);approx(m.material,1);
 assert.equal(applyAction(s,'factory',17,5),true); // disconnected
 const next=tickEconomy(s,0.5);approx(next.ammo,1);approx(next.material,1);
});
test('prevent resource overdraft and invalid actions without hidden costs', () => {
 const s=createGame();s.resources.material=0;
 for(const [mode,x,y] of [['road',1,1],['mine',9,2],['factory',1,1],['repair',3,6]]){
   assert.equal(applyAction(s,mode,x,y),false);
 }
 assert.deepEqual(s.resources,{ore:0,ammo:0,material:0});
 assert.equal(s.roads.size,2);assert.equal(s.buildings.length,2);
});
test('repair costs material, no repair for destroyed road and factory', () => {
 const s=createGame();
 applyAction(s,'damage',3,6);
 assert.equal(applyAction(s,'repair',3,6),true);
 approx(s.resources.material,50-COSTS.repair);
 for(let i=0;i<3;i++) applyAction(s,'damage',3,6);
 assert.equal(applyAction(s,'repair',3,6),false);
 assert.equal(applyAction(s,'road',3,6),true);
 approx(s.resources.material,50-COSTS.repair-COSTS.road);
});
test('salvage refund is capped, destroyed objects yield nothing', () => {
 const s=createGame();
 assert.equal(applyAction(s,'mine',9,2),true);
 approx(s.resources.material,50-COSTS.mine);
 assert.equal(applyAction(s,'erase',9,2),true);
 approx(s.resources.material,50-COSTS.mine+Math.floor(COSTS.mine/2));
 s.resources.material=CAPS.material;
 assert.equal(applyAction(s,'erase',3,6),true);
 approx(s.resources.material,CAPS.material);
 assert.equal(applyAction(s,'mine',9,2),true);
 for(let i=0;i<3;i++) applyAction(s,'damage',9,2);
 const before=s.resources.material;
 assert.equal(applyAction(s,'erase',9,2),true);
 approx(s.resources.material,before);
});
test('time is bounded and no imaginary production for invalid time values', () => {
 const s=createGame();const before=copyGame(s);
 for(const t of [-1,0,NaN,Infinity]) tickEconomy(s,t);
 assert.deepEqual(s.resources,before.resources);
 tickEconomy(s,10);approx(s.resources.ammo,.5); // clamp dt to .5
});
test('production never produces negative or over-cap inventories through stress test',()=>{
 const s=createGame();
 for(let i=0;i<3000;i++) {
   if(i===400) s.resources.ammo=CAPS.ammo;
   if(i===800) s.resources.material=CAPS.material;
   if(i===1500) applyAction(s,'erase',3,6);
   if(i===1800) applyAction(s,'road',3,6);
   tickEconomy(s,0.1);
   for(const k of Object.keys(CAPS)) assert.ok(s.resources[k]>=-1e-8 && s.resources[k]<=CAPS[k]+1e-8,`${k} cap failure ${s.resources[k]}`);
 }
});
