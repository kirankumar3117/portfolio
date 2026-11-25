type Point = { x: number; y: number };

export type NinjaPose = {
  x: number;
  y: number;
  facing: number;
  variant: 'red' | 'black';
  action: 'idle' | 'run' | 'sneak' | 'guard' | 'feint' | 'jump' | 'slash' | 'throw' | 'drop' | 'hit';
  progress: number;
  phase: number;
  moving: number;
  gaze: Point;
  flutter: number;
};

const floor = 42.5;
const stride = 22;
const plantedPhase = 0.62;

const palettes = {
  red: {
    backLeg: '#922f27', backArm: '#ac3c31', body: '#dd5143', belt: '#ff9985',
    leg: '#ec6553', arm: '#fb7865', scarf: '#e75647', hood: '#4b211d',
    rim: '#fa7360', mask: '#251614', pupil: '#55251e', trail: '#f57661',
    sword: { handle: '#3d2722', guard: '#d4725e', blade: '#ffe9d8', edge: '#ad6859' },
  },
  black: {
    backLeg: '#262522', backArm: '#34332f', body: '#373633', belt: '#a8a39a',
    leg: '#4a4945', arm: '#595752', scarf: '#67655e', hood: '#252421',
    rim: '#77746b', mask: '#141310', pupil: '#252421', trail: '#969389',
    sword: { handle: '#282630', guard: '#807d8b', blade: '#e6e3ec', edge: '#5f5c67' },
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function smoothStep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function footPosition(phase: number, restX: number, moving: number): Point {
  const halfStep = stride * plantedPhase / 2;
  let x: number;
  let rise = 0;

  if (phase < plantedPhase) {
    // Cancel forward body travel during the planted part of each step.
    x = halfStep - stride * phase;
  } else {
    const swing = (phase - plantedPhase) / (1 - plantedPhase);
    x = halfStep * (2 * smoothStep(swing) - 1);
    rise = 3.7 * Math.sin(swing * Math.PI);
  }

  return { x: restX + (x - restX) * moving, y: floor - rise * moving };
}

function jointFor(start: Point, end: Point, upper: number, lower: number, bend: number): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.max(0.01, Math.hypot(dx, dy));
  const reach = clamp(length, Math.abs(upper - lower) + 0.01, upper + lower - 0.01);
  const along = (upper * upper - lower * lower + reach * reach) / (2 * reach);
  const offset = Math.sqrt(Math.max(0, upper * upper - along * along)) * bend;

  return {
    x: start.x + (dx * along - dy * offset) / length,
    y: start.y + (dy * along + dx * offset) / length,
  };
}

function strokeLine(
  context: CanvasRenderingContext2D,
  color: string,
  width: number,
  start: Point,
  ...points: Point[]
) {
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(start.x, start.y);
  for (const point of points) context.lineTo(point.x, point.y);
  context.stroke();
}

function skeleton(pose: NinjaPose) {
  const progress = clamp(pose.progress, 0, 1);
  const phase = ((pose.phase % 1) + 1) % 1;
  const planted = pose.action === 'guard' || pose.action === 'feint';
  const moving = planted ? 0 : clamp(pose.moving, 0, 1);
  const bob = moving * Math.cos(phase * Math.PI * 4) * 0.55;
  const hips = { x: -0.7, y: 28.5 + bob };
  const shoulder = { x: 0.8 + 1.6 * moving, y: 20.5 + bob };
  const farFoot = footPosition((phase + 0.5) % 1, 2.5, moving);
  const nearFoot = footPosition(phase, -3.2, moving);
  const armSwing = moving * Math.cos(phase * Math.PI * 2);
  const farHand = { x: 3.6 + 4.3 * armSwing, y: 25.1 + bob - armSwing };
  const nearHand = { x: 4.5 - 5.3 * armSwing, y: 26.6 + bob + armSwing };
  const effort = Math.sin(progress * Math.PI);
  let swordAngle = 0;

  switch (pose.action) {
    case 'sneak': {
      const crouch = smoothStep(progress * 6) * smoothStep((1 - progress) * 6);
      hips.y += 4.5 * crouch;
      shoulder.x += 5.2 * crouch;
      shoulder.y += 6.5 * crouch;
      farFoot.y += (floor - farFoot.y) * 0.35 * crouch;
      nearFoot.y += (floor - nearFoot.y) * 0.35 * crouch;
      farHand.x += (shoulder.x + 6.2 + armSwing * 1.6 - farHand.x) * crouch;
      farHand.y += (shoulder.y - 0.5 - farHand.y) * crouch;
      nearHand.x += (shoulder.x + 2.5 - armSwing * 1.8 - nearHand.x) * crouch;
      nearHand.y += (shoulder.y + 3.6 - nearHand.y) * crouch;
      break;
    }
    case 'guard':
    case 'feint': {
      const breathing = pose.action === 'guard';
      const cycle = progress * Math.PI * 2;
      const breath = breathing ? (1 - Math.cos(cycle)) * 0.45 : 0;
      const roll = breathing ? 0 : Math.sin(cycle) * effort;
      const dip = breathing ? 0 : effort * 2.4;

      // The upper body moves over a stance that stays fixed throughout the gesture.
      farFoot.x = 4.6;
      nearFoot.x = -4.8;
      hips.x += roll * 1.5;
      hips.y += 2 + breath * 0.35 + dip * 0.55;
      shoulder.x += 1.1 + roll * 4.5;
      shoulder.y += 2.1 + breath + dip;
      farHand.x = shoulder.x + 7.4 + roll * 1.7;
      farHand.y = shoulder.y + 0.7 - roll * 2.1;
      nearHand.x = shoulder.x + 5.8 - roll * 2.7;
      nearHand.y = shoulder.y - 3.4 + breath * 0.3 + roll * 3;
      break;
    }
    case 'jump': {
      const lean = pose.variant === 'black' ? effort : 0;
      hips.x += lean * 1.6;
      hips.y -= effort * 2;
      shoulder.x += effort * 2 + lean * 3.9;
      nearFoot.x += effort * 6;
      nearFoot.y -= effort * 6 + lean * 1.4;
      farFoot.x -= effort * 4 + lean * 2.3;
      farFoot.y -= effort * 3;
      nearHand.x += effort * 3 + lean * 3.5;
      nearHand.y -= effort * 6;
      farHand.x -= effort * 5;
      break;
    }
    case 'drop': {
      const landing = progress ** 5;
      shoulder.y += landing * 2.5;
      hips.y += landing * 3;
      farFoot.x += 3;
      nearFoot.x -= 2.5;
      farHand.y -= (1 - landing) * 9;
      nearHand.x -= (1 - landing) * 9;
      nearHand.y -= (1 - landing) * 7;
      break;
    }
    case 'slash': {
      const sweep = smoothStep((progress - 0.16) / 0.58);
      swordAngle = -2.23 + sweep * 2.78;
      shoulder.x += effort * (1.2 + sweep * 2.4);
      shoulder.y += effort * 1.3;
      hips.y += effort * 1.6;
      farFoot.x += effort * 3.8;
      nearFoot.x -= effort * 2.1;
      farHand.x -= effort * 4;
      nearHand.x = shoulder.x + Math.cos(swordAngle + 0.23) * (5 + effort * 4);
      nearHand.y = shoulder.y + Math.sin(swordAngle + 0.23) * (5 + effort * 4);
      break;
    }
    case 'throw': {
      const release = smoothStep((progress - 0.26) / 0.35);
      shoulder.x += effort * (release * 3.7 - 1.1);
      hips.y += effort * 1.4;
      farFoot.x += effort * 4.4;
      nearFoot.x -= effort * 2.5;
      farHand.x -= effort * 4;
      nearHand.x += effort * (release * 20 - 10);
      nearHand.y -= effort * (8 - release * 3);
      break;
    }
    case 'hit':
      shoulder.x -= effort * 5;
      shoulder.y += effort * 3;
      hips.x -= effort * 2.8;
      hips.y += effort * 2.8;
      nearFoot.x -= effort * 3.6;
      farHand.x -= effort * 5.6;
      nearHand.y -= effort * 5;
      break;
  }

  return { hips, shoulder, farFoot, nearFoot, farHand, nearHand, swordAngle, progress, moving };
}

function drawSword(context: CanvasRenderingContext2D, hand: Point, angle: number, variant: NinjaPose['variant']) {
  const colors = palettes[variant].sword;
  context.save();
  context.translate(hand.x, hand.y);
  context.rotate(angle);
  strokeLine(context, colors.handle, 2.2, { x: -2.7, y: 0 }, { x: 3, y: 0 });
  strokeLine(context, colors.guard, 1.4, { x: 3.3, y: -2.3 }, { x: 3.3, y: 2.3 });

  context.fillStyle = colors.blade;
  context.strokeStyle = colors.edge;
  context.lineWidth = 0.55;
  context.beginPath();
  context.moveTo(3.8, -0.65);
  context.quadraticCurveTo(11.5, -0.8, 18.6, -2.7);
  context.quadraticCurveTo(17.8, -0.15, 15.4, 0.45);
  context.quadraticCurveTo(9.5, 1.4, 3.8, 0.9);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
}

export function drawNinja(context: CanvasRenderingContext2D, pose: NinjaPose): void {
  const { hips, shoulder, farFoot, nearFoot, farHand, nearHand, swordAngle, progress, moving } = skeleton(pose);
  const colors = palettes[pose.variant];
  const gazeX = clamp(pose.gaze.x, -1, 1);
  const gazeY = clamp(pose.gaze.y, -1, 1);

  context.save();
  context.translate(pose.x, pose.y - floor - 1.8);
  context.scale(pose.facing < 0 ? -1 : 1, 1);
  context.lineCap = 'round';
  context.lineJoin = 'round';

  const farKnee = jointFor(hips, farFoot, 7.8, 8.9, -1);
  const nearKnee = jointFor(hips, nearFoot, 7.8, 8.9, -1);
  const farElbow = jointFor(shoulder, farHand, 5.1, 5.5, 1);
  const nearElbow = jointFor(shoulder, nearHand, 5.1, 5.5, 1);

  strokeLine(context, colors.backLeg, 3.8, hips, farKnee, farFoot);
  strokeLine(context, colors.backLeg, 3, farFoot, { x: farFoot.x + 2.8, y: farFoot.y });
  strokeLine(context, colors.backArm, 3, shoulder, farElbow, farHand);

  context.fillStyle = colors.body;
  context.beginPath();
  context.moveTo(shoulder.x - 3.4, shoulder.y - 1.2);
  context.quadraticCurveTo(shoulder.x + 0.6, shoulder.y - 3.5, shoulder.x + 3.5, shoulder.y);
  context.lineTo(hips.x + 3.3, hips.y + 0.9);
  context.quadraticCurveTo(hips.x, hips.y + 2.4, hips.x - 3.2, hips.y + 0.2);
  context.closePath();
  context.fill();

  strokeLine(context, colors.belt, 1.3,
    { x: hips.x - 2.8, y: hips.y - 1.3 },
    { x: hips.x + 0.1, y: hips.y - 0.9 },
    { x: hips.x + 3.5, y: hips.y - 1.6 });
  strokeLine(context, colors.leg, 3.8, hips, nearKnee, nearFoot);
  strokeLine(context, colors.leg, 3, nearFoot, { x: nearFoot.x + 3.1, y: nearFoot.y });
  strokeLine(context, colors.arm, 3.25, shoulder, nearElbow, nearHand);

  if (pose.action === 'slash') {
    const arcProgress = clamp((progress - 0.26) / 0.48, 0, 1);
    context.save();
    context.globalAlpha *= Math.sin(arcProgress * Math.PI) * 0.8;
    context.strokeStyle = colors.trail;
    context.lineWidth = 1.45;
    context.beginPath();
    context.arc(shoulder.x, shoulder.y, 24, swordAngle - 0.84, swordAngle + 0.13);
    context.stroke();
    context.restore();
    drawSword(context, nearHand, swordAngle, pose.variant);
  }

  const scarfX = shoulder.x - 2.8;
  const scarfY = shoulder.y - 2;
  context.fillStyle = colors.scarf;
  context.beginPath();
  context.moveTo(scarfX, scarfY);
  context.quadraticCurveTo(scarfX - 4, scarfY - 2.1, scarfX - 10 - moving * 3, scarfY + 1 + pose.flutter);
  context.quadraticCurveTo(scarfX - 4, scarfY + 2.3 + pose.flutter, scarfX + 1, scarfY + 2.7);
  context.closePath();
  context.fill();

  context.translate(shoulder.x + 0.65 + gazeX * 0.7, shoulder.y - 6.2);
  context.rotate(gazeX * 0.11);
  context.fillStyle = colors.hood;
  context.strokeStyle = colors.rim;
  context.lineWidth = 1.45;
  context.beginPath();
  context.ellipse(0, 0, 6.5, 6.4, 0.08, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.fillStyle = colors.mask;
  context.beginPath();
  context.ellipse(0.65, -0.45, 5.25, 2.55, -0.04, 0, Math.PI * 2);
  context.fill();

  for (const x of [-1.95, 2.8]) {
    const eyeX = x + gazeX * 0.86;
    const eyeY = -0.66 + gazeY * 0.7;
    context.fillStyle = '#fff9ef';
    context.beginPath();
    context.ellipse(eyeX, eyeY, 1.46, 0.92, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = colors.pupil;
    context.beginPath();
    context.arc(eyeX + gazeX * 0.62, eyeY + gazeY * 0.24, 0.36, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}
