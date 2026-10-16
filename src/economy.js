import { analyzeNetwork } from './network.js';

export const CAPS=Object.freeze({ore:100,ammo:100,material:120});
export const COSTS=Object.freeze({ore:2,ammo:2,mine:18,factory:24,turret:14,repair:3,unit:16});
export const RATE=Object.freeze({mine:4,factory:2});
export const START_RESOURCES=Object.freeze({ore:0,ammo:0,material:75});
const clamp=(v,limit)=>Math.max(0,Math.min(v,limit));
const eps=1e-8;
export function syncTotals(state) {
 const factories=state.buildings.filter(b=>b.type==='factory'&&b.hp>0);
 state.resources.ore=factories.reduce((s,f)=>s+(f.store?.ore||0),0);
 state.resources.ammo=factories.reduce((s,f)=>s+(f.store?.ammo||0),0);
 return state.resources;
}
export function tickEconomy(state,seconds) {
 if(!Number.isFinite(seconds)||seconds<=0)return {mined:0,ammo:0,material:0};
 const dt=Math.min(seconds,0.5),net=analyzeNetwork(state);
 let mined=0,ammo=0,material=0;
 for(const factory of net.factories) {
   const f=factory.store;
   const count=[...net.mineOwner.values()].filter(id=>id===factory.id).length;
   const possibleOre=Math.min(count*RATE.mine*dt, Math.max(0,CAPS.ore-state.resources.ore-mined));
   f.ore+=possibleOre;mined+=possibleOre;
 }
 // Nonphysical build material is a central pool; ore and ammo never teleport
 // between disconnected production islands.
 for(const factory of net.factories) {
   const f=factory.store;
   const output=Math.min(f.ore,RATE.factory*dt);
   const freeAmmo=Math.max(0,CAPS.ammo-(state.resources.ammo+ammo));
   const freeMaterial=Math.max(0,CAPS.material-(state.resources.material+material));
   const usable=Math.min(output,freeAmmo+freeMaterial);
   let newAmmo=Math.min(usable/2,freeAmmo),newMaterial=Math.min(usable/2,freeMaterial);
   let extra=usable-newAmmo-newMaterial;
   const addedAmmo=Math.min(extra,freeAmmo-newAmmo);newAmmo+=addedAmmo;extra-=addedAmmo;
   newMaterial+=Math.min(extra,freeMaterial-newMaterial);
   f.ore-=newAmmo+newMaterial;f.ammo+=newAmmo;
   ammo+=newAmmo;material+=newMaterial;
 }
 state.resources.material=clamp(state.resources.material+material,CAPS.material);
 syncTotals(state);
 return{mined,ammo,material};
}
export const canAfford=(s,type)=>Number.isFinite(COSTS[type])&&s.resources.material+eps>=COSTS[type];
export function takeMaterial(s,type){if(!canAfford(s,type))return false;s.resources.material=clamp(s.resources.material-COSTS[type],CAPS.material);return true;}
export function salvageMaterial(s,type,hp){const refund=hp>0?Math.floor((COSTS[type]??0)/2):0;s.resources.material=clamp(s.resources.material+refund,CAPS.material);return refund;}
export function consumeAmmo(state,providerIds,amount=1){
 const factories=providerIds.map(id=>state.buildings.find(b=>b.id===id&&b.hp>0&&b.type==='factory')).filter(Boolean);
 for(const f of factories){if(f.store.ammo+eps>=amount){f.store.ammo=Math.max(0,f.store.ammo-amount);syncTotals(state);return f.id;}}
 return null;
}
