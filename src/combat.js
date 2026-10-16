import { analyzeNetwork } from './network.js';
import { consumeAmmo, syncTotals, takeMaterial } from './economy.js';

// All numbers are DEV4 balancing assumptions, not final design decisions.
export const COMBAT=Object.freeze({
 preparation:30,betweenWaves:20,maxWaves:3,waveSizes:[3,6,9],spawnDelay:[2.7,2.1,1.7],
 turretRange:4.8,turretCooldown:.75,turretDamage:1,bulletCost:1,
 enemySpeed:1.15,enemyAttackDelay:1.8,enemyDamage:.6,
 unitBuild:4,unitSpeed:1.7,unitRange:1.8,unitCooldown:1,unitDamage:1.35,
 bunkerHp:9,bunkerRange:2.5,bunkerCooldown:1.5,bunkerDamage:.6
});
const eps=1e-7;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function createCombat(){return{
 phase:'prep',wave:0,countdown:COMBAT.preparation,spawned:0,spawnWait:0,
 enemies:[],shots:[],kills:0,nextEnemyId:1,message:'Baue Munitionsbänder zu den MGs.',
 bunker:{x:18.5,y:6.5,hp:COMBAT.bunkerHp,maxHp:COMBAT.bunkerHp,cooldown:0},
 orders:[],units:[],nextUnitId:1
};}
export function startWave(c){if(c.phase!=='prep'||c.wave>=COMBAT.maxWaves)return false;c.phase='fight';c.wave++;c.spawned=0;c.spawnWait=0;c.countdown=0;c.message=`Welle ${c.wave} läuft`;return true;}
export function orderUnit(state,combat,factoryId){
 if(['victory','defeat'].includes(combat.phase)||combat.orders.length>=3)return false;
 const factory=state.buildings.find(b=>b.type==='factory'&&b.hp>0&&b.id===factoryId);
 if(!factory||!takeMaterial(state,'unit'))return false;
 combat.orders.push({factoryId,time:COMBAT.unitBuild});
 combat.message='Angriffseinheit bestellt – wird zur Bunkerposition geschickt';
 return true;
}
export function chooseTarget(state,enemy){
 const targets=[];
 for(const b of state.buildings){if(b.hp<=eps)continue;
  const bias=b.type==='factory'?1.4:b.type==='mine'?-1.1:b.type==='turret'?-.3:0;
  targets.push({type:'building',id:b.id,x:b.x+.5,y:b.y+.5,score:distance(enemy,{x:b.x+.5,y:b.y+.5})+bias});
 }
 for(const type of ['ore','ammo'])for(const [tile,hp] of state.belts[type]){
  if(hp<=eps)continue;
  const [x,y]=tile.split(',').map(Number);
  targets.push({type,id:tile,x:x+.5,y:y+.5,score:distance(enemy,{x:x+.5,y:y+.5})+(enemy.focus==='network'?-3:1)});
 }
 targets.sort((a,b)=>a.score-b.score||String(a.id).localeCompare(String(b.id)));
 return targets[0]||null;
}
export function hurtInfrastructure(state,target,damage){
 if(!target||!Number.isFinite(damage)||damage<=0)return false;
 if(target.type==='ore'||target.type==='ammo'){
  const hp=state.belts[target.type].get(target.id);
  if(hp==null||hp<=eps)return false;
  state.belts[target.type].set(target.id,Math.max(0,+(hp-damage).toFixed(5)));return true;
 }
 const b=state.buildings.find(b=>b.id===target.id);
 if(!b||b.hp<=eps)return false;
 b.hp=Math.max(0,+(b.hp-damage).toFixed(5));
 if(b.type==='factory'&&b.hp<=eps)syncTotals(state);
 return true;
}
function spawnEnemy(c){const i=c.spawned++;const y=[6.5,3.5,9.5,5.5,8.5][i%5];c.enemies.push({id:c.nextEnemyId++,x:19.5,y,hp:1+c.wave,maxHp:1+c.wave,focus:i%3===1?'network':'structure',attackClock:0});}
function stepEnemies(s,c,dt){
 for(const e of c.enemies){const t=chooseTarget(s,e);if(!t)continue;const d=distance(e,t);
  if(d>.62){const step=Math.min(COMBAT.enemySpeed*dt,d-.61);e.x+=(t.x-e.x)/d*step;e.y+=(t.y-e.y)/d*step;e.attackClock=0;}
  else {e.attackClock+=dt;if(e.attackClock+eps>=COMBAT.enemyAttackDelay){e.attackClock-=COMBAT.enemyAttackDelay;if(hurtInfrastructure(s,t,COMBAT.enemyDamage))c.message='Infrastruktur unter Beschuss – reparieren!';}}
 }
}
function stepTurrets(s,c,dt){
 const net=analyzeNetwork(s);
 for(const t of s.buildings){if(t.type!=='turret'||t.hp<=eps)continue;
  t.cooldown=Math.max(0,(t.cooldown||0)-dt);
  if(t.cooldown>eps)continue;
  const providers=net.turretProviders.get(t.id)||[];
  const origin={x:t.x+.5,y:t.y+.5};let target=null,min=Infinity;
  for(const e of c.enemies)if(e.hp>eps){const d=distance(origin,e);if(d<=COMBAT.turretRange&&d<min){min=d;target=e;}}
  if(!target||!consumeAmmo(s,providers,COMBAT.bulletCost))continue;
  t.cooldown=COMBAT.turretCooldown;target.hp=Math.max(0,target.hp-COMBAT.turretDamage);
  c.shots.push({x1:origin.x,y1:origin.y,x2:target.x,y2:target.y,ttl:.16,team:'player'});
 }
 const alive=[];for(const e of c.enemies){if(e.hp<=eps)c.kills++;else alive.push(e);}c.enemies=alive;
}
function stepOrders(s,c,dt){
 for(let i=c.orders.length-1;i>=0;i--){
  const order=c.orders[i];order.time-=dt;
  if(order.time>0)continue;
  const factory=s.buildings.find(b=>b.id===order.factoryId&&b.type==='factory'&&b.hp>0);
  if(factory)c.units.push({id:c.nextUnitId++,x:factory.x+.5,y:factory.y+.5,hp:3,maxHp:3,fire:0});
  else s.resources.material=Math.min(120,s.resources.material+8); // partial refund if production site is lost
  c.orders.splice(i,1);
 }
}
function stepUnits(c,dt){
 const bunker=c.bunker;
 for(const u of c.units){if(u.hp<=eps)continue;
  const dist=distance(u,bunker);
  if(dist>COMBAT.unitRange+1e-6){const step=Math.min(COMBAT.unitSpeed*dt,dist-COMBAT.unitRange);u.x+=(bunker.x-u.x)/dist*step;u.y+=(bunker.y-u.y)/dist*step;u.fire=0;}
  else{u.fire-=dt;if(u.fire<=eps){bunker.hp=Math.max(0,bunker.hp-COMBAT.unitDamage);u.fire=COMBAT.unitCooldown;c.shots.push({x1:u.x,y1:u.y,x2:bunker.x,y2:bunker.y,ttl:.25,team:'unit'});}}
 }
 if(bunker.hp<=eps)return;
 bunker.cooldown=Math.max(0,bunker.cooldown-dt);
 const inRange=c.units.filter(u=>u.hp>eps&&distance(u,bunker)<COMBAT.bunkerRange).sort((a,b)=>distance(a,bunker)-distance(b,bunker));
 if(inRange.length&&bunker.cooldown<=eps){const u=inRange[0];u.hp=Math.max(0,u.hp-COMBAT.bunkerDamage);bunker.cooldown=COMBAT.bunkerCooldown;c.shots.push({x1:bunker.x,y1:bunker.y,x2:u.x,y2:u.y,ttl:.22,team:'enemy'});}
 c.units=c.units.filter(u=>u.hp>eps);
}
export function tickCombat(s,c,seconds){
 if(!Number.isFinite(seconds)||seconds<=0||['victory','defeat'].includes(c.phase))return;
 const dt=Math.min(seconds,.25);
 if(!s.buildings.some(b=>b.type==='factory'&&b.hp>eps)){c.phase='defeat';c.message='Letzte Fabrik zerstört – Mission verloren';return;}
 for(const shot of c.shots)shot.ttl-=dt;c.shots=c.shots.filter(shot=>shot.ttl>0);
 stepOrders(s,c,dt);stepUnits(c,dt);
 if(c.bunker.hp<=eps){c.phase='victory';c.message='Gegnerischen Bunker zerstört – Mission gewonnen!';return;}
 if(c.phase==='prep'){c.countdown=Math.max(0,c.countdown-dt);if(c.countdown<=eps)startWave(c);}
 if(c.phase==='fight'){
  const max=COMBAT.waveSizes[c.wave-1];
  if(c.spawned<max){c.spawnWait-=dt;if(c.spawnWait<=eps){spawnEnemy(c);c.spawnWait=COMBAT.spawnDelay[c.wave-1];}}
  stepEnemies(s,c,dt);stepTurrets(s,c,dt);
  if(!s.buildings.some(b=>b.type==='factory'&&b.hp>eps)){c.phase='defeat';c.message='Letzte Fabrik zerstört – Mission verloren';return;}
  if(c.spawned>=max&&c.enemies.length===0){
   if(c.wave>=COMBAT.maxWaves){c.phase='siege';c.message='Angriffswellen abgewehrt – zerstöre jetzt den Bunker!';}
   else {c.phase='prep';c.countdown=COMBAT.betweenWaves;c.message=`Welle ${c.wave} abgewehrt – baue für die nächste`;}
  }
 }
}
