import { key, neighbors } from './grid.js';

// Only roads connected to the HQ distribute resources. Roads have unlimited
// throughput in DEV1; detached islands intentionally remain disconnected.
export function analyzeNetwork(state) {
  const hq = state.buildings.find(b => b.type === 'hq' && b.hp > 0);
  const suppliedRoads = new Set();
  const connectedBuildings = new Set();
  if (!hq) return { suppliedRoads, connectedBuildings };
  connectedBuildings.add(hq.id);
  const queue = [];
  for (const [x, y] of neighbors(hq.x, hq.y, state.width, state.height)) {
    const k = key(x, y);
    if ((state.roads.get(k) ?? 0) > 0 && !suppliedRoads.has(k)) {
      suppliedRoads.add(k); queue.push([x, y]);
    }
  }
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    for (const [a, b] of neighbors(x, y, state.width, state.height)) {
      const k = key(a, b);
      if ((state.roads.get(k) ?? 0) > 0 && !suppliedRoads.has(k)) {
        suppliedRoads.add(k); queue.push([a, b]);
      }
    }
  }
  for (const building of state.buildings) {
    if (building.hp <= 0 || building.id === hq.id) continue;
    const adjacent = neighbors(building.x, building.y, state.width, state.height);
    if (adjacent.some(([x, y]) => suppliedRoads.has(key(x, y)) || (x === hq.x && y === hq.y))) {
      connectedBuildings.add(building.id);
    }
  }
  return { suppliedRoads, connectedBuildings };
}
