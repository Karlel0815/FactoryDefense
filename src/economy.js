import { analyzeNetwork } from './network.js';

// Testwerte, nicht endgültig balanciert. Keine Produktionsmodi oder Lagergebäude.
export const CAPS = Object.freeze({ ore: 100, ammo: 100, material: 80 });
export const COSTS = Object.freeze({ road: 2, mine: 18, factory: 24, turret: 14, repair: 3 });
export const RATE = Object.freeze({ mine: 4, factory: 2 }); // Ressourcen / Sekunde
export const START_RESOURCES = Object.freeze({ ore: 0, ammo: 0, material: 50 });
const EPS = 1e-8;
const clamp = (x, max) => Math.max(0, Math.min(max, x));

export function tickEconomy(state, seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return { mined: 0, ammo: 0, material: 0 };
  // Prevent huge production jumps when returning from a suspended browser tab.
  const dt = Math.min(seconds, 0.5);
  const network = analyzeNetwork(state);
  const live = state.buildings.filter(b => b.hp > 0 && network.connectedBuildings.has(b.id));
  const mines = live.filter(b => b.type === 'mine').length;
  const factories = live.filter(b => b.type === 'hq' || b.type === 'factory').length;
  const r = state.resources;
  const beforeOre = r.ore;
  const incoming = Math.min(mines * RATE.mine * dt, CAPS.ore - r.ore);
  r.ore = clamp(r.ore + incoming, CAPS.ore);

  // Production first splits 50:50. If a product is full, its share goes to the
  // other. If both are full, ore is NOT consumed. No negative inventories.
  const maxOutput = Math.min(r.ore, factories * RATE.factory * dt);
  const roomAmmo = Math.max(0, CAPS.ammo - r.ammo);
  const roomMaterial = Math.max(0, CAPS.material - r.material);
  const usable = Math.min(maxOutput, roomAmmo + roomMaterial);
  let ammo = Math.min(usable / 2, roomAmmo);
  let material = Math.min(usable / 2, roomMaterial);
  let extra = usable - ammo - material;
  if (extra > EPS) {
    const addAmmo = Math.min(extra, roomAmmo - ammo);
    ammo += addAmmo;
    extra -= addAmmo;
    const addMaterial = Math.min(extra, roomMaterial - material);
    material += addMaterial;
  }
  const consumed = ammo + material;
  r.ore = clamp(r.ore - consumed, CAPS.ore);
  r.ammo = clamp(r.ammo + ammo, CAPS.ammo);
  r.material = clamp(r.material + material, CAPS.material);
  return { mined: incoming, ammo, material, netOre: r.ore - beforeOre };
}

export function canAfford(state, type) {
  const cost = COSTS[type];
  return Number.isFinite(cost) && state.resources.material + EPS >= cost;
}

export function takeMaterial(state, type) {
  if (!canAfford(state, type)) return false;
  state.resources.material = clamp(state.resources.material - COSTS[type], CAPS.material);
  return true;
}

export function salvageMaterial(state, type, hp) {
  const refund = hp > 0 ? Math.floor((COSTS[type] || 0) / 2) : 0;
  state.resources.material = clamp(state.resources.material + refund, CAPS.material);
  return refund;
}
