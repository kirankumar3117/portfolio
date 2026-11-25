'use client';

import { useEffect, useRef } from 'react';
import {
  drawDissolve,
  drawImpact,
  drawLanding,
  drawProjectile,
  makeDissolve,
  type DustParticle,
  type ProjectileKind,
} from './NinjaEffects';
import { drawNinja, type NinjaPose } from './NinjaSprite';
import styles from './BottomNinja.module.css';

const stageHeight = 128;
const spriteSize = 48;
const stageMargin = 22;
const gazeTime = 2600;
const dropTime = 440;
const dustTime = 1020;
const windup = 155;
const slashTime = 520;
const jumpTime = 475;
const maxRivals = 6;

type Point = NinjaPose['gaze'];
type Attack = 'katana' | 'throw' | 'combo';
type Move = 'slash' | 'throw';

const wanderPlans = {
  walk: { action: 'run', duration: 1800, distance: 96 },
  sneak: { action: 'sneak', duration: 1460, distance: 58 },
  hop: { action: 'jump', duration: 560, distance: 51 },
  feint: { action: 'feint', duration: 740, distance: 0 },
} as const;

type WanderMove = keyof typeof wanderPlans;
type Wander = {
  move: WanderMove;
  from: number;
  to: number;
  facing: number;
  duration: number;
  elapsed: number;
};

type Rival = {
  x: number;
  facing: number;
  enteredAt: number;
  dropHeight: number;
  hitAt: number;
  dissolveAt: number;
  dust: DustParticle[] | null;
};

type Strike = {
  move: Move;
  startedAt: number | null;
  flightTime: number;
  projectile: ProjectileKind;
};

type Counter = Strike & { distance: number; jumpAt: number | null };
type Duel = Strike & {
  rival: Rival;
  attack: Attack;
  jumpAt: number | null;
  hit: boolean;
  counter?: Counter;
};

type Shot = Point & { progress: number; kind: ProjectileKind; facing: number };
type RivalMotion = {
  rival: Rival;
  action: NinjaPose['action'];
  progress: number;
  lift: number;
  offset: number;
  distance: number;
  moving: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function progress(elapsed: number, duration: number) {
  return clamp(elapsed / duration, 0, 1);
}

function beginStrike(strike: Strike, now: number, gap: number) {
  strike.startedAt = now;
  strike.flightTime = clamp(gap * 1.8, 125, 250);
}

function strikeFrame(strike: Strike, now: number, from: number, target: number, facing: number) {
  const elapsed = now - (strike.startedAt ?? now);
  const ranged = strike.move === 'throw';
  const impactTime = ranged ? windup + strike.flightTime : slashTime * 0.48;
  const duration = ranged ? impactTime + 185 : slashTime;
  let pose = progress(elapsed, duration);
  let shot: Shot | null = null;

  if (ranged) {
    pose = elapsed < windup
      ? progress(elapsed, windup) / 2
      : (1 + progress(elapsed - windup, duration - windup)) / 2;

    if (elapsed >= windup && elapsed < impactTime) {
      const flight = progress(elapsed - windup, strike.flightTime);
      const hand = from + facing * Math.min(8, Math.abs(target - from));
      shot = {
        x: hand + (target - hand) * flight,
        y: stageHeight - 23 - Math.sin(flight * Math.PI) * 11,
        progress: flight,
        kind: strike.projectile,
        facing,
      };
    }
  }

  return { pose, shot, sinceImpact: elapsed - impactTime, finished: elapsed >= duration };
}

function startWander(move: WanderMove, position: number, max: number, facing: number): Wander {
  const plan = wanderPlans[move];
  const distance = plan.distance * (0.85 + Math.random() * 0.3);
  let direction = Math.random() < 0.5 ? -1 : 1;
  const destination = position + distance * direction;
  if (destination < stageMargin || destination > max) direction = position < (stageMargin + max) / 2 ? 1 : -1;

  const backwardHop = move === 'hop' && Math.random() < 0.4;
  return {
    move,
    from: position,
    to: clamp(position + distance * direction, stageMargin, max),
    facing: move === 'feint' ? facing : direction * (backwardHop ? -1 : 1),
    duration: plan.duration,
    elapsed: 0,
  };
}

function drawShadow(context: CanvasRenderingContext2D, x: number, lift: number) {
  const spread = Math.min(lift / 100, 1);
  context.fillStyle = `rgba(36, 20, 18, ${0.19 - spread * 0.11})`;
  context.beginPath();
  context.ellipse(x, stageHeight - 0.65, 9 + spread * 6, 0.65, 0, 0, Math.PI * 2);
  context.fill();
}

export default function BottomNinja() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const snapshot = document.createElement('canvas');
    snapshot.width = spriteSize;
    snapshot.height = spriteSize;
    const snapshotContext = snapshot.getContext('2d', { willReadFrequently: true });
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rivals: Rival[] = [];
    const attackBag: Attack[] = [];
    const wanderBag: WanderMove[] = [];
    let nextCounter: Move = Math.random() < 0.5 ? 'slash' : 'throw';
    let duel: Duel | undefined;
    let wander: Wander | undefined;
    let width = 0;
    let maxX = stageMargin;
    let position = window.innerWidth * 0.68;
    let facing = 1;
    let distance = 0;
    let gait = 0;
    let wanderLift = 0;
    let pauseUntil = 0;
    let observeUntil = 0;
    let pointer: Point | null = null;
    let gaze: Point = { x: 0.3, y: 0 };
    let previousTime = 0;
    let frame = 0;

    const resize = () => {
      width = document.documentElement.clientWidth;
      maxX = Math.max(stageMargin, width - stageMargin);
      position = clamp(position, stageMargin, maxX);
      wander = undefined;
      for (const rival of rivals) rival.x = clamp(rival.x, stageMargin, maxX);

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(stageHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      requestFrame();
    };

    function watchPointer(event: PointerEvent) {
      if (event.pointerType === 'touch') return;

      pointer = { x: event.clientX, y: event.clientY };
      observeUntil = performance.now() + gazeTime;
      requestFrame();
    }

    function releasePointer(event: PointerEvent) {
      if (event.relatedTarget !== null) return;
      pointer = null;
      observeUntil = 0;
      requestFrame();
    }

    function dropRival(event: MouseEvent) {
      if (event.button !== 0 || event.detail === 0) return;

      if (rivals.length >= maxRivals) {
        const fading = rivals.findIndex((rival) => rival.dissolveAt < Infinity);
        const waiting = rivals.findIndex((rival) => rival !== duel?.rival);
        const replace = fading >= 0 ? fading : waiting;
        if (replace >= 0) rivals.splice(replace, 1);
      }

      const x = clamp(event.clientX, stageMargin, maxX);
      rivals.push({
        x,
        facing: position < x ? -1 : 1,
        enteredAt: performance.now(),
        dropHeight: clamp(window.innerHeight - event.clientY, 45, stageHeight - 12),
        hitAt: -Infinity,
        dissolveAt: Infinity,
        dust: null,
      });
      requestFrame();
    }

    function nextDuel(rival: Rival): Duel {
      if (attackBag.length === 0) attackBag.push('katana', 'throw', 'combo');
      const [attack] = attackBag.splice(Math.floor(Math.random() * attackBag.length), 1);
      const counterMove = nextCounter;
      nextCounter = counterMove === 'slash' ? 'throw' : 'slash';
      return {
        rival,
        attack,
        move: attack === 'katana' ? 'slash' : 'throw',
        startedAt: null,
        jumpAt: null,
        flightTime: 0,
        hit: false,
        projectile: Math.random() < 0.5 ? 'star' : 'dart',
        counter: { move: counterMove, startedAt: null, flightTime: 0, projectile: 'star', distance: 0, jumpAt: null },
      };
    }

    const snapshotRival = (rival: Rival, pose: NinjaPose) => {
      if (!snapshotContext) return [];
      snapshotContext.clearRect(0, 0, spriteSize, spriteSize);
      drawNinja(snapshotContext, { ...pose, x: spriteSize / 2, y: spriteSize });
      const pixels = snapshotContext.getImageData(0, 0, spriteSize, spriteSize);
      return makeDissolve(pixels, rival.x - spriteSize / 2, stageHeight - spriteSize);
    };

    const animate = (now: number) => {
      frame = 0;
      const dt = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 0;
      previousTime = now;
      const reduced = motion.matches;
      const watching = pointer !== null && (reduced || now < observeUntil);
      const groundedAfter = reduced ? 0 : dropTime;
      let walking = false;
      let action: NinjaPose['action'] = 'idle';
      let actionProgress = 0;
      wanderLift = reduced ? 0 : Math.max(0, wanderLift - dt * 135);
      let lift = wanderLift;
      let lunge = 0;
      let shot: Shot | null = null;
      let rivalMotion: RivalMotion | null = null;
      let redImpact: number | null = null;

      if (!duel) {
        const waiting = rivals.find((rival) => rival.dissolveAt === Infinity);
        if (waiting) duel = nextDuel(waiting);
      }

      if (duel) {
        wander = undefined;
        const { rival, counter } = duel;
        const dx = rival.x - position;
        if (Math.abs(dx) > 0.25) facing = Math.sign(dx);
        rival.facing = -facing;

        if (counter) {
          const melee = counter.move === 'slash';
          const gap = melee ? 22 : 116;
          const grounded = now - rival.enteredAt >= groundedAfter;
          let rivalStep = 0;

          if (counter.startedAt === null) {
            const remaining = Math.max(0, Math.abs(dx) - gap);
            const redPace = clamp(Math.abs(dx) * 1.8, 120, 320);
            const rivalPace = grounded ? clamp(Math.abs(dx) * 1.9, 112, 255) : 0;
            const pace = redPace + rivalPace;
            const advance = reduced ? remaining : Math.min(remaining, pace * dt);
            const redStep = advance * redPace / pace;
            rivalStep = advance - redStep;
            position += facing * redStep;
            rival.x += rival.facing * rivalStep;
            distance += redStep;
            counter.distance += rivalStep;
            walking = redStep > 0;

            if (melee && !reduced && grounded && remaining > 13 && remaining < 85 && counter.jumpAt === null) {
              counter.jumpAt = now;
            }

            const landed = counter.jumpAt === null || now - counter.jumpAt >= jumpTime;
            if (grounded && landed && remaining - advance < 0.1) {
              beginStrike(counter, now, Math.abs(rival.x - position));
            }
          }

          const jump = counter.jumpAt === null ? 0 : progress(now - counter.jumpAt, jumpTime);
          const rivalLift = 24 * 4 * jump * (1 - jump);
          rivalMotion = {
            rival,
            action: rivalLift > 0 ? 'jump' : rivalStep > 0 ? 'run' : 'guard',
            progress: rivalLift > 0 ? jump : (now % 1850) / 1850,
            lift: rivalLift,
            offset: 0,
            distance: counter.distance,
            moving: reduced || rivalStep === 0 ? 0 : 1,
          };

          if (!walking) {
            action = 'guard';
            actionProgress = reduced ? 0 : (now % 1850) / 1850;
          }

          if (counter.startedAt !== null) {
            const strike = strikeFrame(counter, now, rival.x, position, rival.facing);
            rivalMotion.action = counter.move;
            rivalMotion.progress = strike.pose;
            shot = strike.shot;

            if (melee && !reduced) {
              rivalMotion.offset = rival.facing * 10 * Math.sin(strike.pose * Math.PI);
            }

            if (strike.sinceImpact >= 0 && strike.sinceImpact < 175) {
              redImpact = progress(strike.sinceImpact, 175);
              action = 'hit';
              actionProgress = redImpact;
              if (!reduced) lunge = -facing * 6 * Math.sin(redImpact * Math.PI);
            }

            if (strike.finished) duel.counter = undefined;
          }
        } else {
          const { move } = duel;
          const isThrow = move === 'throw';
          const gap = isThrow ? 134 : 19;

          if (duel.startedAt === null) {
            const remaining = Math.max(0, Math.abs(dx) - gap);
            const pace = clamp(Math.abs(dx) * 2.25, 150, 448);
            const step = reduced ? remaining : Math.min(remaining, pace * dt);
            position += facing * step;
            distance += step;
            walking = step > 0;

            if (!isThrow && !reduced && remaining > 27 && remaining < 145 && duel.jumpAt === null) {
              duel.jumpAt = now;
            }

            if (remaining - step < 0.1) beginStrike(duel, now, Math.abs(rival.x - position));
          }

          if (duel.jumpAt !== null) {
            const jump = progress(now - duel.jumpAt, jumpTime);
            lift = Math.max(lift, 39 * 4 * jump * (1 - jump));
            if (lift > 0) {
              action = 'jump';
              actionProgress = jump;
            }
          }

          if (duel.startedAt !== null) {
            const strike = strikeFrame(duel, now, position, rival.x, facing);
            action = move;
            actionProgress = strike.pose;
            shot = strike.shot;

            if (!isThrow && !reduced) {
              const hop = 10 * Math.sin(actionProgress * Math.PI);
              lunge = facing * hop;
              lift = Math.max(lift, hop);
            }

            if (strike.sinceImpact >= 0 && !duel.hit) {
              rival.hitAt = now;
              duel.hit = true;
              if (!isThrow || duel.attack !== 'combo') rival.dissolveAt = now + 95;
            }

            if (strike.finished) {
              if (isThrow && duel.attack === 'combo') {
                duel.move = 'slash';
                duel.startedAt = null;
                duel.hit = false;
              } else {
                pauseUntil = now + 380;
                duel = undefined;
              }
            }
          }
        }
      } else if (watching || reduced) {
        wander = undefined;
        if (watching) {
          if (lift > 0) {
            action = 'jump';
            actionProgress = 1 - lift / 65;
          } else {
            action = 'guard';
            actionProgress = reduced ? 0 : (now % 1850) / 1850;
          }
        }
      } else if (now >= pauseUntil) {
        if (!wander) {
          if (wanderBag.length === 0) wanderBag.push('walk', 'sneak', 'hop', 'feint');
          const [move] = wanderBag.splice(Math.floor(Math.random() * wanderBag.length), 1);
          wander = startWander(move, position, maxX, facing);
        }

        const { move } = wander;
        wander.elapsed += dt * 1000;
        actionProgress = progress(wander.elapsed, wander.duration);
        action = wanderPlans[move].action;
        facing = wander.facing;
        const t = actionProgress;
        const travel = move === 'hop' ? t * t * (3 - 2 * t) : t;
        const nextPosition = wander.from + (wander.to - wander.from) * travel;
        const step = Math.abs(nextPosition - position);
        distance += step;
        position = nextPosition;
        walking = (move === 'walk' || move === 'sneak') && step > 0;

        if (move === 'hop') {
          wanderLift = 29 * 4 * t * (1 - t);
          lift = wanderLift;
        }

        if (t === 1) {
          wander = undefined;
          pauseUntil = now + 120 + Math.random() * 230;
        }
      }

      gait = reduced ? 0 : gait + ((walking ? 1 : 0) - gait) * (1 - Math.exp(-13 * dt));
      if (action === 'idle' && gait > 0.08) action = 'run';
      let desiredX = reduced ? 0 : 0.45 + Math.sin(now / 550) * 0.19;
      let desiredY = 0;

      if (duel) {
        desiredX = 0.68;
      } else if (pointer) {
        const dx = pointer.x - position;
        const dy = pointer.y - (window.innerHeight - 30 - lift);
        desiredX = clamp(dx / 135, -1, 1) * facing;
        desiredY = clamp(dy / 115, -1, 1);
      }

      const response = reduced ? 1 : 1 - Math.exp(-15 * dt);
      gaze = {
        x: gaze.x + (desiredX - gaze.x) * response,
        y: gaze.y + (desiredY - gaze.y) * response,
      };

      context.clearRect(0, 0, width, stageHeight);
      for (let index = rivals.length - 1; index >= 0; index--) {
        const rival = rivals[index];
        const drop = progress(now - rival.enteredAt, dropTime);
        const dropLift = reduced ? 0 : rival.dropHeight * (1 - drop * drop);
        const recentHit = progress(now - rival.hitAt, 210);
        const fighting = rivalMotion?.rival === rival ? rivalMotion : null;
        const ready = reduced ? 0 : ((now - rival.enteredAt) % 2900) / 2900;
        const feint = ready > 0.77;
        const rivalLift = Math.max(dropLift, fighting?.lift ?? 0);

        if (!fighting && Math.abs(position - rival.x) > 3) rival.facing = Math.sign(position - rival.x);

        const rivalPose: NinjaPose = {
          x: rival.x + (fighting?.offset ?? 0),
          y: stageHeight - rivalLift,
          variant: 'black',
          facing: rival.facing,
          action: fighting?.action ?? (feint ? 'feint' : 'guard'),
          progress: fighting?.progress ?? (feint ? (ready - 0.77) / 0.23 : ready / 0.77),
          phase: ((fighting?.distance ?? 0) / 22) % 1,
          moving: fighting?.moving ?? 0,
          gaze: { x: 0.52, y: 0 },
          flutter: reduced ? 0 : 0.55 * Math.sin(now / 105),
        };

        if (dropLift > 0) {
          rivalPose.action = 'drop';
          rivalPose.progress = drop;
        } else if (recentHit < 1) {
          rivalPose.action = 'hit';
          rivalPose.progress = recentHit;
        }

        if (now >= rival.dissolveAt) {
          const fade = progress(now - rival.dissolveAt, dustTime);
          if (fade >= 1) {
            rivals.splice(index, 1);
            continue;
          }
          rival.dust ??= snapshotRival(rival, rivalPose);
          drawDissolve(context, rival.dust, fade);
        } else {
          drawShadow(context, rivalPose.x, rivalLift);
          drawNinja(context, rivalPose);
          const landing = progress(now - rival.enteredAt - dropTime, 280);
          if (!reduced && drop === 1 && landing < 1) drawLanding(context, rival.x, stageHeight - 1, landing);
        }

        if (recentHit < 1) {
          drawImpact(context, rival.x, stageHeight - 21, recentHit);
        }
      }

      drawShadow(context, position, lift);
      drawNinja(context, {
        x: position + lunge,
        y: stageHeight - lift,
        variant: 'red',
        facing,
        action,
        progress: actionProgress,
        phase: (distance / 22) % 1,
        moving: gait,
        gaze,
        flutter: gait * Math.sin(now / 59) * 1.25,
      });

      if (redImpact !== null) drawImpact(context, position + lunge, stageHeight - 22 - lift, redImpact);
      if (shot) drawProjectile(context, shot.x, shot.y, shot.progress, shot.kind, shot.facing);
      if (!reduced || rivals.length > 0 || duel) requestFrame();
      else previousTime = 0;
    };

    function requestFrame() {
      if (!frame) frame = requestAnimationFrame(animate);
    }

    resize();
    motion.addEventListener('change', requestFrame);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', watchPointer, { passive: true });
    window.addEventListener('pointerout', releasePointer, { passive: true });
    window.addEventListener('click', dropRival, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      motion.removeEventListener('change', requestFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', watchPointer);
      window.removeEventListener('pointerout', releasePointer);
      window.removeEventListener('click', dropRival);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.ninja} height={stageHeight} data-portfolio-ninja aria-hidden="true" />;
}
