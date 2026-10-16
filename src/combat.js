import { key } from './grid.js';
import { analyzeNetwork } from './network.js';

// DEV3 values are deliberately provisional; never interpret as final balance.
export const COMBAT = Object.freeze({
  preparation: 24, betweenWaves: 19, maxWaves: 3,
  waveSizes: [3, 6, 9], spawnDelay: [2.8, 2.2, 1.7],
  turretRange: 4.8, turretCooldown: 0.75, turretDamage: 1,
  bulletCost: 1, enemySpeed: 1.15, enemyAttackDelay: 1.8, enemyDamage: 0.6
});
const COMBAT_EPS = 1e-7;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function createCombat() {
  return {
    phase: 'prep', wave: 0, countdown: COMBAT.preparation,
    spawned: 0, spawnWait: 0, enemies: [], shots: [],
    kills: 0, message: 'Bereite deine Verteidigung vor', nextEnemyId: 1
  };
}

export function startWave(combat) {
  if (combat.phase !== 'prep' || combat.wave >= COMBAT.maxWaves) return false;
  combat.phase = 'fight';
  combat.wave++;
  combat.spawned = 0;
  combat.spawnWait = 0;
  combat.countdown = 0;
  combat.message = `Welle ${combat.wave} läuft`;
  return true;
}

export function chooseTarget(state, enemy) {
  const options = [];
  for (const b of state.buildings) {
    if (b.hp <= COMBAT_EPS) continue;
    // The HQ is attacked if other infrastructure has fallen or is out of reach.
    const bias = b.type === 'hq' ? 2 : b.type === 'mine' ? -1.5 : b.type === 'turret' ? -0.5 : -1;
    options.push({ type: 'building', id: b.id, x: b.x + .5, y: b.y + .5,
      score: dist(enemy, { x: b.x + .5, y: b.y + .5 }) + bias + (enemy.focus === 'network' ? 1 : 0) });
  }
  for (const [tile, hp] of state.roads) {
    if (hp <= COMBAT_EPS) continue;
    const [x, y] = tile.split(',').map(Number);
    options.push({ type: 'road', id: tile, x: x + .5, y: y + .5,
      score: dist(enemy, { x: x + .5, y: y + .5 }) + (enemy.focus === 'network' ? -3 : .8) });
  }
  options.sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));
  return options[0] || null;
}

export function hurtInfrastructure(state, target, damage) {
  if (!target || !Number.isFinite(damage) || damage <= 0) return false;
  if (target.type === 'road') {
    const hp = state.roads.get(target.id);
    if (hp === undefined || hp <= COMBAT_EPS) return false;
    state.roads.set(target.id, Math.max(0, +(hp - damage).toFixed(5)));
    return true;
  }
  const b = state.buildings.find(v => v.id === target.id);
  if (!b || b.hp <= COMBAT_EPS) return false;
  b.hp = Math.max(0, +(b.hp - damage).toFixed(5));
  return true;
}

function spawnEnemy(combat) {
  const index = combat.spawned++;
  const y = [6.5, 3.5, 9.5, 5.5, 8.5][index % 5];
  combat.enemies.push({
    id: combat.nextEnemyId++, x: 19.5, y,
    hp: 1 + combat.wave, maxHp: 1 + combat.wave,
    focus: index % 3 === 1 ? 'network' : 'structure', attackClock: 0
  });
}

function stepEnemies(state, combat, dt) {
  for (const enemy of combat.enemies) {
    const target = chooseTarget(state, enemy);
    if (!target) continue;
    const distance = dist(enemy, target);
    if (distance > 0.62) {
      const step = Math.min(COMBAT.enemySpeed * dt, distance - 0.61);
      enemy.x += (target.x - enemy.x) / distance * step;
      enemy.y += (target.y - enemy.y) / distance * step;
      enemy.attackClock = 0;
    } else {
      enemy.attackClock += dt;
      if (enemy.attackClock + COMBAT_EPS >= COMBAT.enemyAttackDelay) {
        enemy.attackClock -= COMBAT.enemyAttackDelay;
        if (hurtInfrastructure(state, target, COMBAT.enemyDamage)) combat.message = 'Infrastruktur unter Beschuss – Reparieren jederzeit möglich';
      }
    }
  }
}

function stepTurrets(state, combat, dt) {
  const net = analyzeNetwork(state);
  for (const t of state.buildings) {
    if (t.type !== 'turret' || t.hp <= COMBAT_EPS) continue;
    t.cooldown = Math.max(0, (t.cooldown || 0) - dt);
    if (!net.connectedBuildings.has(t.id) || state.resources.ammo + COMBAT_EPS < COMBAT.bulletCost || t.cooldown > COMBAT_EPS) continue;
    const p = { x: t.x + .5, y: t.y + .5 };
    let best = null, nearest = Infinity;
    for (const enemy of combat.enemies) {
      if (enemy.hp <= COMBAT_EPS) continue;
      const d = dist(p, enemy);
      if (d <= COMBAT.turretRange && d < nearest) { nearest = d; best = enemy; }
    }
    if (!best) continue;
    state.resources.ammo = Math.max(0, +(state.resources.ammo - COMBAT.bulletCost).toFixed(5));
    t.cooldown = COMBAT.turretCooldown;
    best.hp = Math.max(0, best.hp - COMBAT.turretDamage);
    combat.shots.push({ x1: p.x, y1: p.y, x2: best.x, y2: best.y, ttl: .18 });
  }
  const alive = [];
  for (const enemy of combat.enemies) {
    if (enemy.hp <= COMBAT_EPS) combat.kills++;
    else alive.push(enemy);
  }
  combat.enemies = alive;
}

export function tickCombat(state, combat, seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0 || combat.phase === 'victory' || combat.phase === 'defeat') return;
  const dt = Math.min(seconds, .25);
  const hq = state.buildings.find(b => b.type === 'hq');
  if (!hq || hq.hp <= COMBAT_EPS) { combat.phase = 'defeat'; combat.message = 'Hauptfabrik zerstört'; return; }
  for (const s of combat.shots) s.ttl -= dt;
  combat.shots = combat.shots.filter(s => s.ttl > 0);
  if (combat.phase === 'prep') {
    combat.countdown = Math.max(0, combat.countdown - dt);
    if (combat.countdown <= COMBAT_EPS) startWave(combat);
    return;
  }
  if (combat.phase !== 'fight') return;
  // The first enemy appears immediately; remaining enemies are spaced out.
  const maxEnemies = COMBAT.waveSizes[combat.wave - 1];
  if (combat.spawned < maxEnemies) {
    combat.spawnWait -= dt;
    if (combat.spawnWait <= COMBAT_EPS) {
      spawnEnemy(combat);
      combat.spawnWait = COMBAT.spawnDelay[combat.wave - 1];
    }
  }
  stepEnemies(state, combat, dt);
  stepTurrets(state, combat, dt);
  if (hq.hp <= COMBAT_EPS) { combat.phase = 'defeat'; combat.message = 'Hauptfabrik zerstört'; return; }
  if (combat.spawned >= maxEnemies && combat.enemies.length === 0) {
    if (combat.wave >= COMBAT.maxWaves) {
      combat.phase = 'victory'; combat.message = 'Alle drei Angriffswellen überstanden!';
    } else {
      combat.phase = 'prep'; combat.countdown = COMBAT.betweenWaves;
      combat.message = `Welle ${combat.wave} abgewehrt – bereite dich vor`;
    }
  }
}
