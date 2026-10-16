import test from 'node:test';
import assert from 'node:assert/strict';
import { inBounds, key, neighbors, lineCells, positionToCell } from '../src/grid.js';
import { createGame, copyGame, applyAction } from '../src/model.js';
import { analyzeNetwork } from '../src/network.js';

test('raster and pointer boundaries including exact right/bottom edge', () => {
  assert.equal(inBounds(0, 0, 20, 12), true);
  assert.equal(inBounds(-1, 0, 20, 12), false);
  assert.equal(inBounds(20, 0, 20, 12), false);
  assert.deepEqual(positionToCell(199,119,{left:0,top:0,width:200,height:120},20,12),{x:19,y:11});
  assert.equal(positionToCell(200,119,{left:0,top:0,width:200,height:120},20,12),null);
  assert.equal(positionToCell(20,-1,{left:0,top:0,width:200,height:120},20,12),null);
  assert.equal(neighbors(0,0,20,12).length,2);
});
test('strokes fill quick swipes including endpoints and diagonals', () => {
  assert.deepEqual(lineCells({x:0,y:0},{x:5,y:0}).map(c=>key(c.x,c.y)),['0,0','1,0','2,0','3,0','4,0','5,0']);
  assert.equal(lineCells({x:0,y:0},{x:5,y:5}).length,11);
  const diagonals = lineCells({x:0,y:0},{x:5,y:5});
  assert.ok(diagonals.every((p,i) => i===0 || Math.abs(p.x-diagonals[i-1].x)+Math.abs(p.y-diagonals[i-1].y)===1));
  assert.deepEqual(lineCells({x:5,y:0},{x:5,y:0}),[{x:5,y:0}]);
  assert.deepEqual(lineCells({}, {x:1,y:1}),[]);
});
test('initial mine is linked and a broken road isolates it', () => {
  const state=createGame();
  assert.equal(analyzeNetwork(state).connectedBuildings.has('mine-1'),true);
  assert.equal(applyAction(state,'erase',3,6),true);
  assert.equal(analyzeNetwork(state).connectedBuildings.has('mine-1'),false);
  assert.equal(applyAction(state,'road',3,6),true);
  assert.equal(analyzeNetwork(state).connectedBuildings.has('mine-1'),true);
});
test('detached mine and isolated road remain disconnected until linked', () => {
  const s=createGame();
  assert.equal(applyAction(s,'mine',9,2),true);
  assert.equal(analyzeNetwork(s).connectedBuildings.has('mine-2'),false);
  assert.equal(applyAction(s,'road',9,3),true);
  assert.equal(analyzeNetwork(s).suppliedRoads.has('9,3'),false);
});
test('blocked placements and erasing HQ are rejected without mutation', () => {
  const s=createGame(); const original=JSON.stringify(s.buildings);
  assert.equal(applyAction(s,'mine',1,1),false);
  assert.equal(applyAction(s,'road',2,6),false);
  assert.equal(applyAction(s,'road',9,2),false);
  assert.equal(applyAction(s,'erase',2,6),false);
  assert.equal(applyAction(s,'road',-1,1),false);
  assert.equal(applyAction(s,'unknown',1,1),false);
  assert.equal(JSON.stringify(s.buildings),original);
});
test('damage, repair, destruction and rebuilding do not resurrect destroyed roads', () => {
  const s=createGame();
  for(let i=0;i<3;i++) assert.equal(applyAction(s,'damage',3,6),true);
  assert.equal(s.roads.get('3,6'),0);
  assert.equal(analyzeNetwork(s).connectedBuildings.has('mine-1'),false);
  assert.equal(applyAction(s,'repair',3,6),false);
  assert.equal(applyAction(s,'road',3,6),true);
  assert.equal(analyzeNetwork(s).connectedBuildings.has('mine-1'),true);
  assert.equal(applyAction(s,'damage',3,6),true);
  assert.equal(applyAction(s,'repair',3,6),true);
  assert.equal(s.roads.get('3,6'),3);
});
test('destroyed mines must be rebuilt; damage to HQ disconnects on destruction', () => {
  const s=createGame();
  for(let i=0;i<3;i++) assert.equal(applyAction(s,'damage',5,6),true);
  assert.equal(analyzeNetwork(s).connectedBuildings.has('mine-1'),false);
  assert.equal(applyAction(s,'repair',5,6),false);
  assert.equal(applyAction(s,'erase',5,6),true);
  assert.equal(applyAction(s,'mine',5,6),true);
  assert.equal(analyzeNetwork(s).connectedBuildings.has('mine-2'),true);
  for(let i=0;i<3;i++) applyAction(s,'damage',2,6);
  assert.equal(analyzeNetwork(s).connectedBuildings.size,0);
});
test('undo snapshot is independent from later modifications', () => {
  const s=createGame(), snapshot=copyGame(s);
  applyAction(s,'erase',3,6);
  applyAction(s,'mine',9,2);
  assert.equal(snapshot.roads.get('3,6'),3);
  assert.equal(snapshot.buildings.length,2);
  assert.equal(s.buildings.length,3);
});
