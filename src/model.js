import { inBounds, key } from './grid.js';
import { CAPS, COSTS, START_RESOURCES, takeMaterial, salvageMaterial } from './economy.js';

export const MAX_HP = 3;
export const MODES = ['road', 'mine', 'factory', 'erase', 'repair', 'damage'];

export function createGame() {
  return {
    width: 20, height: 12,
    ores: new Set([key(5, 6), key(9, 2), key(11, 9), key(16, 4)]),
    roads: new Map([[key(3, 6), MAX_HP], [key(4, 6), MAX_HP]]),
    buildings: [
      { id: 'hq', type: 'hq', x: 2, y: 6, hp: MAX_HP },
      { id: 'mine-1', type: 'mine', x: 5, y: 6, hp: MAX_HP }
    ],
    resources: { ...START_RESOURCES },
    nextId: 2
  };
}

export const copyGame = state => ({
  ...state,
  ores: new Set(state.ores),
  roads: new Map(state.roads),
  buildings: state.buildings.map(b => ({ ...b })),
  resources: { ...state.resources }
});

export function applyAction(state, mode, x, y) {
  if (!MODES.includes(mode) || !inBounds(x, y, state.width, state.height)) return false;
  const tile = key(x, y);
  const building = state.buildings.find(b => b.x === x && b.y === y);
  const roadHP = state.roads.get(tile);
  if (mode === 'road') {
    if (building || state.ores.has(tile) || roadHP > 0 || !takeMaterial(state, mode)) return false;
    state.roads.set(tile, MAX_HP);
    return true;
  }
  if (mode === 'mine' || mode === 'factory') {
    if (building || roadHP !== undefined || (mode === 'mine') !== state.ores.has(tile) || !takeMaterial(state, mode)) return false;
    state.buildings.push({ id: `${mode}-${state.nextId++}`, type: mode, x, y, hp: MAX_HP });
    return true;
  }
  if (mode === 'erase') {
    if (building && building.type !== 'hq') {
      salvageMaterial(state, building.type, building.hp);
      state.buildings = state.buildings.filter(b => b.id !== building.id);
      return true;
    }
    if (roadHP !== undefined) {
      salvageMaterial(state, 'road', roadHP);
      state.roads.delete(tile);
      return true;
    }
    return false;
  }
  if (mode === 'damage') {
    if (building && building.hp > 0) { building.hp--; return true; }
    if (roadHP > 0) { state.roads.set(tile, roadHP - 1); return true; }
    return false;
  }
  if (mode === 'repair') {
    if (building?.hp > 0 && building.hp < MAX_HP) {
      if (!takeMaterial(state, mode)) return false;
      building.hp++; return true;
    }
    if (roadHP > 0 && roadHP < MAX_HP) {
      if (!takeMaterial(state, mode)) return false;
      state.roads.set(tile, roadHP + 1); return true;
    }
    return false;
  }
  return false;
}
