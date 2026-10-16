import test from 'node:test';
import assert from 'node:assert/strict';
import {inBounds,lineCells,positionToCell,neighbors} from '../src/grid.js';
import {createGame,copyGame,applyAction,MAX_HP} from '../src/model.js';
import {analyzeNetwork,beltAt} from '../src/network.js';
import {tickEconomy,CAPS,COSTS,consumeAmmo,syncTotals} from '../src/economy.js';
import {COMBAT,createCombat,tickCombat,tickGame,startWave,orderUnit,chooseTarget,hurtInfrastructure} from '../src/combat.js';
const eq=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} differs from ${b}`);
const advance=(s,c,seconds)=>{for(let i=0;i<seconds*10;i++){tickEconomy(s,.1);tickCombat(s,c,.1);}};
const mkMG=(s,x=3,y=5)=>{assert.equal(applyAction(s,'turret',x,y),true);return s.buildings.find(b=>b.type==='turret'&&b.x===x&&b.y===y)};
const mine=(s,id='mine-1')=>s.buildings.find(b=>b.id===id);
const firstFactory=s=>s.buildings.find(b=>b.type==='factory'&&b.hp>0);

test('grid boundaries and pointer mapping',()=>{assert.equal(inBounds(-1,0,20,12),false);assert.equal(inBounds(19,11,20,12),true);assert.equal(positionToCell(200,120,{left:0,top:0,width:200,height:120},20,12),null);assert.deepEqual(positionToCell(19,11,{left:0,top:0,width:200,height:120},20,12),{x:1,y:1});});
test('stroke covers every cell and bridges orthogonal diagonals',()=>{assert.equal(lineCells({x:0,y:0},{x:4,y:0}).length,5);const l=lineCells({x:0,y:0},{x:4,y:4});assert.equal(l.length,9);assert.ok(l.every((p,i)=>i===0||Math.abs(p.x-l[i-1].x)+Math.abs(p.y-l[i-1].y)===1));});
test('initial configuration contains factory, mine, two ore belts, blue ammo stub and no HQ',()=>{const s=createGame();assert.equal(s.buildings.filter(b=>b.type==='factory').length,1);assert.equal(s.buildings.filter(b=>b.type==='hq').length,0);assert.equal(s.belts.ore.size,2);assert.equal(s.belts.ammo.size,1);});
test('yellow ore belt never connects to blue ammo belt',()=>{const s=createGame();assert.equal(beltAt(s,3,6),'ore');assert.equal(beltAt(s,2,5),'ammo');assert.equal(analyzeNetwork(s).connected.ore.has('2,5'),false);assert.equal(analyzeNetwork(s).connected.ammo.has('3,6'),false);});
test('ore and ammo cannot be built atop each other',()=>{const s=createGame();assert.equal(applyAction(s,'ammo',3,6),false);assert.equal(applyAction(s,'ore',2,5),false);});
test('different belts may touch at neighbors but stay separate',()=>{const s=createGame();assert.equal(applyAction(s,'ammo',3,5),true);assert.equal(analyzeNetwork(s).connected.ammo.has('3,5'),true);assert.equal(analyzeNetwork(s).connected.ore.has('3,5'),false);});
test('ore belt may extend rapidly and must not be drawn over ore deposit',()=>{const s=createGame();assert.equal(applyAction(s,'ore',6,6),true);assert.equal(applyAction(s,'ore',9,2),false);});
test('bunker cell is reserved for enemy objective',()=>{const s=createGame();for(const type of ['ore','ammo','factory','turret'])assert.equal(applyAction(s,type,18,6),false);});
test('factory and starting mine are connected only by ore',()=>{const s=createGame(),net=analyzeNetwork(s);assert.equal(net.mineOwner.get('mine-1'),'factory-1');assert.equal(net.turretProviders.size,0);});
test('destroy ore belt stops mine output',()=>{const s=createGame();for(let i=0;i<3;i++)assert.equal(applyAction(s,'damage',3,6),true);assert.equal(analyzeNetwork(s).mineOwner.has('mine-1'),false);eq(tickEconomy(s,.5).mined,0);});
test('destroyed ore belt is rebuilt as ore but never becomes ammo',()=>{const s=createGame();for(let i=0;i<3;i++)applyAction(s,'damage',3,6);assert.equal(applyAction(s,'ammo',3,6),false);assert.equal(applyAction(s,'ore',3,6),true);assert.equal(analyzeNetwork(s).mineOwner.has('mine-1'),true);});
test('damaged but positive belt still supplies',()=>{const s=createGame();applyAction(s,'damage',4,6);assert.equal(analyzeNetwork(s).mineOwner.has('mine-1'),true);});
test('blue belt supplies MG but yellow belt does not',()=>{const s=createGame();const t=mkMG(s);assert.deepEqual(analyzeNetwork(s).turretProviders.get(t.id),['factory-1']);assert.equal(applyAction(s,'erase',2,5),true);assert.equal(analyzeNetwork(s).turretProviders.has(t.id),false);assert.equal(applyAction(s,'ore',2,5),true);assert.equal(analyzeNetwork(s).turretProviders.has(t.id),false);});
test('MG needs connected blue belt even when locally produced ammo exists',()=>{const s=createGame();const t=mkMG(s);firstFactory(s).store.ammo=5;syncTotals(s);for(let i=0;i<3;i++)applyAction(s,'damage',2,5);assert.equal(consumeAmmo(s,analyzeNetwork(s).turretProviders.get(t.id)||[],1),null);eq(s.resources.ammo,5);});
test('start production is 50:50, and ore stays in the factory store',()=>{const s=createGame();const out=tickEconomy(s,.5);eq(out.mined,2);eq(out.ammo,.5);eq(out.material,.5);eq(firstFactory(s).store.ore,1);eq(s.resources.ammo,.5);});
test('material capped, remaining throughput redirected to ammo',()=>{const s=createGame();s.resources.material=CAPS.material;firstFactory(s).store.ore=10;syncTotals(s);const out=tickEconomy(s,.5);eq(out.material,0);eq(out.ammo,1);});
test('ammo cap redirects throughput to material',()=>{const s=createGame();firstFactory(s).store.ammo=CAPS.ammo;firstFactory(s).store.ore=10;syncTotals(s);const out=tickEconomy(s,.5);eq(out.ammo,0);eq(out.material,1);});
test('full product stocks do not consume ore for processing',()=>{const s=createGame();firstFactory(s).store.ammo=CAPS.ammo;firstFactory(s).store.ore=50;s.resources.material=CAPS.material;syncTotals(s);tickEconomy(s,.5);eq(firstFactory(s).store.ore,52);});
test('no factory means no mining / economy output',()=>{const s=createGame();firstFactory(s).hp=0;eq(tickEconomy(s,.5).mined,0);});
test('unconnected mine is inert',()=>{const s=createGame();assert.equal(applyAction(s,'mine',9,2),true);const net=analyzeNetwork(s);assert.equal(net.mineOwner.has('mine-2'),false);eq(tickEconomy(s,.5).mined,2);});
test('build costs deducted and invalid builds are free',()=>{const s=createGame(),before=s.resources.material;assert.equal(applyAction(s,'factory',6,3),true);eq(s.resources.material,before-COSTS.factory);assert.equal(applyAction(s,'factory',6,3),false);eq(s.resources.material,before-COSTS.factory);});
test('insufficient material blocks construction',()=>{const s=createGame();s.resources.material=0;assert.equal(applyAction(s,'turret',4,5),false);assert.equal(applyAction(s,'ammo',4,5),false);});
test('repair costs material; destroyed segment must be rebuilt',()=>{const s=createGame();applyAction(s,'damage',3,6);const before=s.resources.material;assert.equal(applyAction(s,'repair',3,6),true);eq(s.resources.material,before-COSTS.repair);for(let i=0;i<3;i++)applyAction(s,'damage',3,6);assert.equal(applyAction(s,'repair',3,6),false);assert.equal(applyAction(s,'ore',3,6),true);});
test('last intact factory cannot be manually erased',()=>{const s=createGame();assert.equal(applyAction(s,'erase',2,6),false);assert.equal(firstFactory(s).hp,3);});
test('multiple factories: second survives destruction of first',()=>{const s=createGame(),c=createCombat();assert.equal(applyAction(s,'factory',10,6),true);hurtInfrastructure(s,{type:'building',id:'factory-1'},4);tickCombat(s,c,.1);assert.notEqual(c.phase,'defeat');});
test('last factory destroyed causes instant defeat',()=>{const s=createGame(),c=createCombat();hurtInfrastructure(s,{type:'building',id:'factory-1'},4);tickCombat(s,c,.1);assert.equal(c.phase,'defeat');assert.equal(startWave(c),false);});
test('isolated factory cannot see ore of first island',()=>{const s=createGame();applyAction(s,'factory',12,6);for(let i=0;i<100;i++)tickEconomy(s,.1);const second=s.buildings.find(b=>b.type==='factory'&&b.id!=='factory-1');eq(second.store.ore,0);eq(second.store.ammo,0);assert.ok(firstFactory(s).store.ammo>0);});
test('two factories do not duplicate mine output',()=>{const s=createGame();applyAction(s,'factory',3,5);const n=analyzeNetwork(s);assert.equal(n.mineOwner.size,1);tickEconomy(s,.5);eq(s.resources.ore+s.resources.ammo,1.5);});
test('detached network ammo remains at original factory (no teleportation)',()=>{const s=createGame();applyAction(s,'factory',10,6);const b=s.buildings.find(b=>b.id==='factory-2');b.store.ammo=5;syncTotals(s);const t=mkMG(s);assert.equal(consumeAmmo(s,analyzeNetwork(s).turretProviders.get(t.id),1),null);eq(s.resources.ammo,5);});
test('connected MG consumes local factory ammo and hits enemy',()=>{const s=createGame(),c=createCombat(),t=mkMG(s);firstFactory(s).store.ammo=5;syncTotals(s);startWave(c);c.enemies=[{id:5,x:4.5,y:5.5,hp:3,maxHp:3,focus:'structure',attackClock:0}];c.spawned=3;tickCombat(s,c,.1);eq(s.resources.ammo,4);assert.equal(c.enemies[0].hp,2);});
test('enemy prioritizes nearby infrastructure and both belt types can be damaged',()=>{const s=createGame();const enemy={x:4.5,y:6.5,focus:'network'};const target=chooseTarget(s,enemy);assert.ok(['ore','ammo','building'].includes(target.type));assert.equal(hurtInfrastructure(s,{type:'ore',id:'3,6'},.6),true);eq(s.belts.ore.get('3,6'),2.4);assert.equal(hurtInfrastructure(s,{type:'ammo',id:'2,5'},.6),true);eq(s.belts.ammo.get('2,5'),2.4);});
test('first wave never auto-starts and subsequent waves keep automatic countdown',()=>{const s=createGame(),c=createCombat();for(let i=0;i<1000;i++)tickGame(s,c,.1);assert.equal(c.phase,'ready');assert.equal(c.wave,0);assert.equal(c.countdown,0);assert.equal(startWave(c),true);assert.equal(c.wave,1);assert.equal(startWave(c),false);c.phase='prep';c.countdown=COMBAT.betweenWaves;for(let i=0;i<COMBAT.betweenWaves*10+1;i++)tickCombat(s,c,.1);assert.equal(c.wave,2);});
test('repair possible during active wave',()=>{const s=createGame(),c=createCombat();startWave(c);hurtInfrastructure(s,{type:'building',id:'factory-1'},.5);assert.equal(applyAction(s,'repair',2,6),true);eq(firstFactory(s).hp,3);assert.equal(c.phase,'fight');});
test('unit order spends material and is built asynchronously',()=>{const s=createGame(),c=createCombat(),before=s.resources.material;startWave(c);assert.equal(orderUnit(s,c,'factory-1'),true);eq(s.resources.material,before-COSTS.unit);assert.equal(c.units.length,0);for(let i=0;i<41;i++)tickCombat(s,c,.1);assert.equal(c.orders.length,0);assert.equal(c.units.length,1);});
test('invalid unit orders and full queue rejected',()=>{const s=createGame(),c=createCombat();assert.equal(orderUnit(s,c,'not-a-factory'),false);startWave(c);assert.equal(orderUnit(s,c,'factory-1'),true);assert.equal(orderUnit(s,c,'factory-1'),true);assert.equal(orderUnit(s,c,'factory-1'),true);assert.equal(orderUnit(s,c,'factory-1'),false);});
test('bunker is target and starts with health',()=>{const c=createCombat();eq(c.bunker.hp,COMBAT.bunkerHp);assert.equal(c.bunker.x,18.5);});
test('own units move, shoot bunker and eventually win',()=>{const s=createGame(),c=createCombat();startWave(c);assert.equal(orderUnit(s,c,'factory-1'),true);assert.equal(orderUnit(s,c,'factory-1'),true);for(let i=0;i<1000&&c.phase!=='victory'&&c.phase!=='defeat';i++){tickCombat(s,c,.1);if(c.phase==='fight')for(const e of c.enemies)e.hp=0;}assert.equal(c.phase,'victory');assert.equal(c.bunker.hp,0);});
test('three defended waves lead to bunker siege, NOT automatic win',()=>{const s=createGame(),c=createCombat();startWave(c);for(let wave=1;wave<=3;wave++){
 for(let i=0;i<1200&&c.phase==='fight';i++){tickCombat(s,c,.1);for(const e of c.enemies)e.hp=0;}
 assert.equal(c.phase,wave===3?'siege':'prep');if(wave<3)assert.equal(startWave(c),true);
 }assert.ok(c.bunker.hp>0);});
test('invalid time never changes state, large dt capped',()=>{const s=createGame(),c=createCombat();const prev=structuredClone(c);for(const dt of [-1,0,NaN,Infinity])tickCombat(s,c,dt);assert.deepEqual(c,prev);const r=tickEconomy(s,20);eq(r.mined,2);});
test('snapshots keep belts and stocks independent',()=>{const s=createGame(),copy=copyGame(s);applyAction(s,'damage',3,6);firstFactory(s).store.ammo=4;assert.equal(copy.belts.ore.get('3,6'),3);eq(copy.buildings[0].store.ammo,0);});
test('long production run never generates negative or over-cap resource balances',()=>{const s=createGame();for(let i=0;i<1200;i++){tickEconomy(s,.1);for(const k of Object.keys(CAPS))assert.ok(s.resources[k]>=-1e-7&&s.resources[k]<=CAPS[k]+1e-7,`${k} invalid ${s.resources[k]}`);}});

test('no resource production, combat, unit construction or wave timer prior to manual start',()=>{
 const s=createGame(),c=createCombat(),initial=structuredClone(s.resources),f=firstFactory(s),store={...f.store};
 for(let i=0;i<1200;i++)tickGame(s,c,.1); // two minutes waiting for human
 assert.equal(c.phase,'ready');assert.equal(c.wave,0);assert.equal(c.countdown,0);
 assert.deepEqual(s.resources,initial);assert.deepEqual(f.store,store);
 assert.equal(c.enemies.length,0);assert.equal(c.units.length,0);
 assert.equal(orderUnit(s,c,'factory-1'),false);assert.equal(c.orders.length,0);
});
test('first click starts wave and production, reset creates fresh ready state',()=>{
 const s=createGame(),c=createCombat();const before={...s.resources};
 assert.equal(startWave(c),true);assert.equal(c.wave,1);assert.equal(c.phase,'fight');
 tickGame(s,c,.5);assert.ok(s.resources.ore>before.ore);assert.ok(s.resources.ammo>before.ammo);
 assert.ok(s.resources.material>before.material);
 const restarted=createCombat();const newGame=createGame();tickGame(newGame,restarted,100);
 assert.equal(restarted.phase,'ready');assert.equal(newGame.resources.ammo,0);
});
test('building and undo remain available while waiting without generating materials',()=>{
 const s=createGame(),c=createCombat(),before=s.resources.material;
 assert.equal(c.phase,'ready');assert.equal(applyAction(s,'turret',3,5),true);
 assert.ok(s.resources.material<before);tickGame(s,c,25);
 assert.equal(s.resources.material,before-COSTS.turret);
});

test('bridge: perpendicular ammo crosses straight ore without mixing resources',()=>{
 const s=createGame();
 for(const x of [6,7,8]) assert.equal(applyAction(s,'ore',x,4),true);
 assert.equal(applyAction(s,'ammo',7,3),true);
 assert.equal(applyAction(s,'ammo',7,4),true);
 assert.equal(applyAction(s,'ammo',7,5),true);
 assert.deepEqual(s.crossings.get('7,4'),{over:'ammo',oreAxis:'h',ammoAxis:'v'});
 assert.equal(s.belts.ore.get('7,4'),MAX_HP);
 assert.equal(s.belts.ammo.get('7,4'),MAX_HP);
 assert.equal(applyAction(s,'ammo',7,4),false);
 const net=analyzeNetwork(s);
 assert.notEqual(net.byTile.ore.get('7,4'),undefined);
 assert.notEqual(net.byTile.ammo.get('7,4'),undefined);
 assert.notStrictEqual(net.groups.ore,net.groups.ammo);
});
test('bridge auto-creation also works when ore passes over a straight blue band',()=>{
 const s=createGame();
 for(const y of [3,4,5])assert.equal(applyAction(s,'ammo',8,y),true);
 assert.equal(applyAction(s,'ore',7,4),true);
 assert.equal(applyAction(s,'ore',8,4),true);
 assert.equal(applyAction(s,'ore',9,4),true);
 assert.deepEqual(s.crossings.get('8,4'),{over:'ore',oreAxis:'h',ammoAxis:'v'});
});
test('invalid bridges on a lone stub, a corner or a parallel stretch are rejected without cost',()=>{
 const s=createGame();const old=s.resources.material;
 assert.equal(applyAction(s,'ore',2,5),false); // one blue stub, not through-line
 assert.equal(s.resources.material,old);
 for(const xy of [[10,4],[11,4],[11,5]])assert.equal(applyAction(s,'ore',...xy),true);
 const before=s.resources.material;
 assert.equal(applyAction(s,'ammo',11,4),false); // only one ore neighbor
 assert.equal(s.resources.material,before);
});
test('a bridge cannot turn through a side-arm of the same type',()=>{
 const s=createGame();
 for(const x of [5,6,7])assert.equal(applyAction(s,'ore',x,4),true);
 assert.equal(applyAction(s,'ammo',6,3),true);
 assert.equal(applyAction(s,'ammo',6,4),true);
 assert.equal(applyAction(s,'ammo',6,5),true);
 assert.equal(applyAction(s,'ore',6,5),false); // no other medium mixing
 // Model an older save with an invalid ore side branch adjacent to crossing;
 // solver must not connect it by turning inside the bridge.
 s.belts.ore.set('6,3',MAX_HP);
 const net=analyzeNetwork(s);
 const crossGroup=net.groups.ore.find(c=>c.tiles.has('6,4'));
 assert.ok(crossGroup.tiles.has('5,4')&&crossGroup.tiles.has('7,4'));
 assert.equal(crossGroup.tiles.has('6,3'),false);
});
test('removing or damaging the upper crossing lane does not break the lower lane',()=>{
 const s=createGame();for(const x of [6,7,8])applyAction(s,'ore',x,4);
 applyAction(s,'ammo',7,3);applyAction(s,'ammo',7,4);applyAction(s,'ammo',7,5);
 assert.equal(applyAction(s,'damage',7,4),true);
 assert.equal(s.belts.ammo.get('7,4'),2);
 assert.equal(s.belts.ore.get('7,4'),3);
 assert.equal(applyAction(s,'repair',7,4),true);
 assert.equal(s.belts.ammo.get('7,4'),3);
 assert.equal(applyAction(s,'erase',7,4),true);
 assert.equal(s.crossings.has('7,4'),false);
 assert.equal(s.belts.ore.get('7,4'),3);
 assert.equal(s.belts.ammo.has('7,4'),false);
});
test('save snapshots preserve bridge direction and its own undo-able resources',()=>{
 const s=createGame();for(const x of [6,7,8])applyAction(s,'ore',x,4);
 applyAction(s,'ammo',7,3);
 const prev=copyGame(s);
 applyAction(s,'ammo',7,4);
 assert.equal(prev.crossings.has('7,4'),false);
 const cp=copyGame(s);cp.crossings.get('7,4').over='ore';
 assert.equal(s.crossings.get('7,4').over,'ammo');
});
test('mine and factory expose actual throughput percentages, not network nominal values',()=>{
 const s=createGame(),m=mine(s),f=firstFactory(s);
 assert.equal(m.outputRate||0,0);assert.equal(f.outputRate||0,0);
 const c=createCombat();tickGame(s,c,.5);
 assert.equal(m.outputRate||0,0);assert.equal(f.outputRate||0,0);
 startWave(c);tickGame(s,c,.5);
 eq(m.outputRate,4);eq(f.outputRate,2);
 const minePercent=Math.round(100*m.outputRate/4),factoryPercent=Math.round(100*f.outputRate/2);
 assert.equal(minePercent,100);assert.equal(factoryPercent,100);
 for(let i=0;i<3;i++)applyAction(s,'damage',3,6);
 tickEconomy(s,.5);
 eq(m.outputRate,0);
 assert.equal(Math.round(100*m.outputRate/4),0);
});
test('factory load falls to zero when both output caps are full',()=>{
 const s=createGame(),f=firstFactory(s);f.store.ammo=CAPS.ammo;s.resources.material=CAPS.material;f.store.ore=8;syncTotals(s);
 tickEconomy(s,.5);eq(f.outputRate,0);
});
test('end-to-end crossing: two factory islands retain separate ore/ammo paths',()=>{
 const s=createGame();s.belts={ore:new Map(),ammo:new Map()};s.crossings=new Map();
 s.buildings=[
  {id:'fac-A',type:'factory',hp:3,x:1,y:4,store:{ore:0,ammo:9}},
  {id:'fac-B',type:'factory',hp:3,x:4,y:1,store:{ore:0,ammo:5}},
  {id:'mine-C',type:'mine',hp:3,x:6,y:4},
  {id:'tur-D',type:'turret',hp:3,x:4,y:6}
 ];
 for(const x of [2,3,4,5])s.belts.ore.set(`${x},4`,3);
 for(const y of [2,3,5])s.belts.ammo.set(`4,${y}`,3);
 assert.equal(applyAction(s,'ammo',4,4),true);
 const net=analyzeNetwork(s);
 assert.equal(net.mineOwner.get('mine-C'),'fac-A');
 assert.deepEqual(net.turretProviders.get('tur-D'),['fac-B']);
 assert.equal(consumeAmmo(s,net.turretProviders.get('tur-D'),1),'fac-B');
 eq(s.buildings[0].store.ammo,9);eq(s.buildings[1].store.ammo,4);
 // Attacking the upper lane isolates only the turret, not ore input.
 for(let i=0;i<3;i++)applyAction(s,'damage',4,4);
 const after=analyzeNetwork(s);
 assert.equal(after.mineOwner.get('mine-C'),'fac-A');
 assert.equal(after.turretProviders.has('tur-D'),false);
 assert.equal(applyAction(s,'ammo',4,4),true);
 assert.deepEqual(analyzeNetwork(s).turretProviders.get('tur-D'),['fac-B']);
});
