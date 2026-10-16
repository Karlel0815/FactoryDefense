import { inBounds, key } from './grid.js';
import { CAPS, COSTS, START_RESOURCES, takeMaterial, salvageMaterial, syncTotals } from './economy.js';
import { beltAt, crossingAxis, canBridge } from './network.js';
export const MAX_HP = 3;
export const MODES = ['ore', 'ammo', 'mine', 'factory', 'turret', 'inspect', 'erase', 'repair', 'damage'];
export const makeFactory = (id,x,y) => ({id,type:'factory',x,y,hp:MAX_HP,store:{ore:0,ammo:0}});

export function createGame() {
 const game={
   width:20,height:12,
   ores:new Set(['5,6','9,2','11,9','16,4']),
   belts:{ore:new Map([['3,6',MAX_HP],['4,6',MAX_HP]]),ammo:new Map([['2,5',MAX_HP]])},
   crossings:new Map(),
   buildings:[makeFactory('factory-1',2,6),{id:'mine-1',type:'mine',x:5,y:6,hp:MAX_HP}],
   resources:{...START_RESOURCES},nextId:2
 };
 return game;
}
export const copyGame = s=>({
 ...s,ores:new Set(s.ores),
 belts:{ore:new Map(s.belts.ore),ammo:new Map(s.belts.ammo)},
 crossings:new Map([...s.crossings].map(([tile,cross])=>[tile,{...cross}])),
 buildings:s.buildings.map(b=>({...b,store:b.store?{...b.store}:undefined})),
 resources:{...s.resources}
});
export function applyAction(state, mode, x, y) {
 if(!MODES.includes(mode)||!inBounds(x,y,state.width,state.height))return false;
 if(x===18&&y===6)return false; // Enemy bunker tile stays reserved.
 const tile=key(x,y),b=state.buildings.find(v=>v.x===x&&v.y===y);
 const cross=state.crossings.get(tile);
 const type=cross?.over ?? beltAt(state,x,y),hp=type?state.belts[type].get(tile):undefined;
 if(mode==='ore'||mode==='ammo') {
   if(b||state.ores.has(tile)||(state.belts[mode].get(tile)??0)>0)return false;
   const other=mode==='ore'?'ammo':'ore';
   // A bridge requires an uninterrupted, straight underpass. The new belt
   // runs perpendicularly above it; its two media remain distinct.
   const rebuilding=state.belts[mode].has(tile);
   const under=state.belts[other].has(tile);
   if(under&&!rebuilding && !canBridge(state,x,y,other))return false;
   if(!takeMaterial(state,mode))return false;
   state.belts[mode].set(tile,MAX_HP);
   if(under&&!rebuilding){const underAxis=crossingAxis(state,x,y,other);state.crossings.set(tile,{over:mode,oreAxis:mode==='ore'?(underAxis==='h'?'v':'h'):underAxis,ammoAxis:mode==='ammo'?(underAxis==='h'?'v':'h'):underAxis});}
   return true;
 }
 if(['mine','factory','turret'].includes(mode)) {
   if(b||type || ((mode==='mine')!==state.ores.has(tile)) || !takeMaterial(state,mode))return false;
   const id=`${mode}-${state.nextId++}`;
   state.buildings.push(mode==='factory'?makeFactory(id,x,y):{id,type:mode,x,y,hp:MAX_HP});return true;
 }
 if(mode==='inspect')return false;
 if(mode==='erase') {
   if(b){
     if(b.type==='factory'&&state.buildings.filter(v=>v.type==='factory'&&v.hp>0).length<=1&&b.hp>0)return false;
     salvageMaterial(state,b.type,b.hp);
     state.buildings=state.buildings.filter(v=>v.id!==b.id);syncTotals(state);return true;
   }
   if(type){salvageMaterial(state,type,hp);state.belts[type].delete(tile);
    if(cross)state.crossings.delete(tile);return true;}
   return false;
 }
 if(mode==='damage') {
   if(b&&b.hp>0){b.hp=Math.max(0,b.hp-1);return true;}
   if(type&&hp>0){state.belts[type].set(tile,Math.max(0,hp-1));return true;}return false;
 }
 if(mode==='repair') {
   if(b&&b.hp>0&&b.hp<MAX_HP){if(!takeMaterial(state,mode))return false;b.hp=Math.min(MAX_HP,b.hp+1);return true;}
   const repairType=cross?([cross.over,cross.over==='ore'?'ammo':'ore'].find(t=>(state.belts[t].get(tile)??0)>0&&(state.belts[t].get(tile)??0)<MAX_HP)):type;
   const repairHP=repairType?state.belts[repairType].get(tile):undefined;
   if(repairType&&repairHP>0&&repairHP<MAX_HP){if(!takeMaterial(state,mode))return false;state.belts[repairType].set(tile,Math.min(MAX_HP,repairHP+1));return true;}
   return false;
 }
 return false;
}
