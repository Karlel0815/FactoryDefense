import { inBounds, key } from './grid.js';
import { CAPS, COSTS, START_RESOURCES, takeMaterial, salvageMaterial, syncTotals } from './economy.js';
import { beltAt } from './network.js';
export const MAX_HP = 3;
export const MODES = ['ore', 'ammo', 'mine', 'factory', 'turret', 'erase', 'repair', 'damage'];
export const makeFactory = (id,x,y) => ({id,type:'factory',x,y,hp:MAX_HP,store:{ore:0,ammo:0}});

export function createGame() {
 const game={
   width:20,height:12,
   ores:new Set(['5,6','9,2','11,9','16,4']),
   belts:{ore:new Map([['3,6',MAX_HP],['4,6',MAX_HP]]),ammo:new Map([['2,5',MAX_HP]])},
   buildings:[makeFactory('factory-1',2,6),{id:'mine-1',type:'mine',x:5,y:6,hp:MAX_HP}],
   resources:{...START_RESOURCES},nextId:2
 };
 return game;
}
export const copyGame = s=>({
 ...s,ores:new Set(s.ores),
 belts:{ore:new Map(s.belts.ore),ammo:new Map(s.belts.ammo)},
 buildings:s.buildings.map(b=>({...b,store:b.store?{...b.store}:undefined})),
 resources:{...s.resources}
});
export function applyAction(state, mode, x, y) {
 if(!MODES.includes(mode)||!inBounds(x,y,state.width,state.height))return false;
 if(x===18&&y===6)return false; // Enemy bunker tile stays reserved.
 const tile=key(x,y),b=state.buildings.find(v=>v.x===x&&v.y===y);
 const type=beltAt(state,x,y),hp=type?state.belts[type].get(tile):undefined;
 if(mode==='ore'||mode==='ammo') {
   if(b||state.ores.has(tile)|| (type && (type!==mode||hp>0)) || !takeMaterial(state,mode))return false;
   state.belts[mode].set(tile,MAX_HP);return true;
 }
 if(['mine','factory','turret'].includes(mode)) {
   if(b||type || ((mode==='mine')!==state.ores.has(tile)) || !takeMaterial(state,mode))return false;
   const id=`${mode}-${state.nextId++}`;
   state.buildings.push(mode==='factory'?makeFactory(id,x,y):{id,type:mode,x,y,hp:MAX_HP});return true;
 }
 if(mode==='erase') {
   if(b){
     if(b.type==='factory'&&state.buildings.filter(v=>v.type==='factory'&&v.hp>0).length<=1&&b.hp>0)return false;
     salvageMaterial(state,b.type,b.hp);
     state.buildings=state.buildings.filter(v=>v.id!==b.id);syncTotals(state);return true;
   }
   if(type){salvageMaterial(state,type,hp);state.belts[type].delete(tile);return true;}
   return false;
 }
 if(mode==='damage') {
   if(b&&b.hp>0){b.hp=Math.max(0,b.hp-1);return true;}
   if(type&&hp>0){state.belts[type].set(tile,Math.max(0,hp-1));return true;}return false;
 }
 if(mode==='repair') {
   if(b&&b.hp>0&&b.hp<MAX_HP){if(!takeMaterial(state,mode))return false;b.hp=Math.min(MAX_HP,b.hp+1);return true;}
   if(type&&hp>0&&hp<MAX_HP){if(!takeMaterial(state,mode))return false;state.belts[type].set(tile,Math.min(MAX_HP,hp+1));return true;}
   return false;
 }
 return false;
}
