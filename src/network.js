import { key, neighbors } from './grid.js';

// Media remain isolated even at an orthogonal bridge crossing. Factories
// convert ore into ammunition; crossings are never converters.
export const BELTS = Object.freeze(['ore', 'ammo']);
export const beltAt = (state, x, y) => state.crossings?.get(key(x,y))?.over ?? (state.belts.ore.has(key(x,y)) ? 'ore' : state.belts.ammo.has(key(x,y)) ? 'ammo' : null);
export const axisBetween=(x,y,ax,ay)=>x===ax?'v':y===ay?'h':null;
export const crossingAxis=(state,x,y,type)=>{
 const has=(a,b)=>(state.belts[type].get(key(a,b))??0)>0;
 const h=has(x-1,y)&&has(x+1,y),v=has(x,y-1)&&has(x,y+1);
 return h&&!v?'h':v&&!h?'v':null;
};
export const canBridge=(state,x,y,under)=>{
 if(state.crossings.has(key(x,y)))return false;
 if((state.belts[under].get(key(x,y))??0)<=0)return false;
 return crossingAxis(state,x,y,under)!==null;
};
// A crossing tile connects ONLY in the axis of its own medium. Both
// endpoints of an edge must admit that direction (no side-entry/turns).
function connectionAllowed(state,type,x,y,ax,ay){
 const axis=axisBetween(x,y,ax,ay);
 const source=state.crossings.get(key(x,y)),dest=state.crossings.get(key(ax,ay));
 return (!source||source[type+'Axis']===axis)&&(!dest||dest[type+'Axis']===axis);
}

const alive = b => b.hp > 0;
const adjacent = (a, b) => Math.abs(a.x-b.x)+Math.abs(a.y-b.y) === 1;
const cmp = (a, b) => String(a.id).localeCompare(String(b.id));

export function analyzeNetwork(state) {
  const factories = state.buildings.filter(b => b.type === 'factory' && alive(b)).sort(cmp);
  const groups = { ore: [], ammo: [] };
  const byTile = { ore: new Map(), ammo: new Map() };
  const connected = { ore: new Set(), ammo: new Set() };
  for (const type of BELTS) {
    const visited = new Set();
    for (const [tile, hp] of state.belts[type]) {
      if (hp <= 0 || visited.has(tile)) continue;
      const component = { type, tiles: new Set([tile]), factories: [], mines: [], turrets: [] };
      const todo = [tile]; visited.add(tile);
      for (let i=0;i<todo.length;i++) {
        const loc=todo[i];
        const [x,y]=loc.split(',').map(Number);
        for (const [ax,ay] of neighbors(x,y,state.width,state.height)) {
          const next=key(ax,ay);
          if (!visited.has(next) && (state.belts[type].get(next)??0)>0 && connectionAllowed(state,type,x,y,ax,ay)) {
            visited.add(next);component.tiles.add(next);todo.push(next);
          }
        }
      }
      component.factories = factories.filter(f=> [...component.tiles].some(t=>{
        const [x,y]=t.split(',').map(Number);return adjacent(f,{x,y});
      }));
      const candidates = state.buildings.filter(alive);
      component.mines = candidates.filter(b=>b.type==='mine' && [...component.tiles].some(t=>{
        const [x,y]=t.split(',').map(Number);return adjacent(b,{x,y});
      }));
      component.turrets = candidates.filter(b=>b.type==='turret' && [...component.tiles].some(t=>{
        const [x,y]=t.split(',').map(Number);return adjacent(b,{x,y});
      }));
      const index = groups[type].length;
      groups[type].push(component);
      for (const t of component.tiles) {
        byTile[type].set(t,index);
        if(component.factories.length)connected[type].add(t);
      }
    }
  }
  // Mine ore belongs to one factory only; deterministic assignment prevents
  // multiple factories double-counting the same source.
  const mineOwner = new Map();
  const turretProviders = new Map();
  for(const b of state.buildings.filter(alive)) {
    if(b.type==='mine') {
      const matches=new Map();
      for(const c of groups.ore) if(c.factories.length && c.mines.includes(b)) {
        for(const f of c.factories)matches.set(f.id,f);
      }
      const owners=[...matches.values()].sort(cmp);
      if(owners.length)mineOwner.set(b.id,owners[0].id);
    }
    if(b.type==='turret') {
      const matches=new Map();
      for(const c of groups.ammo) if(c.factories.length && c.turrets.includes(b)) {
        for(const f of c.factories)matches.set(f.id,f);
      }
      if(matches.size)turretProviders.set(b.id,[...matches.keys()].sort());
    }
  }
  return { factories, groups, byTile, connected, mineOwner, turretProviders };
}
