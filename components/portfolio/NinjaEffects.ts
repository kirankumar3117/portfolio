export type ProjectileKind = 'star' | 'dart';

export type DustParticle = {
  x: number;
  y: number;
  drift: number;
  lift: number;
  delay: number;
  size: number;
  color: string;
  ash?: string;
  opacity: number;
};

export function makeDissolve(image: ImageData, left: number, top: number): DustParticle[] {
  const { data, width, height } = image;
  const step = Math.max(1, Math.ceil(Math.max(width, height) / 48));
  const particles: DustParticle[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const offset = (y * width + x) * 4;
      const alpha = data[offset + 3] / 255;
      if (alpha < 0.35) continue;

      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const dark = Math.max(red, green, blue) < 104;

      particles.push({
        x: left + x,
        y: top + y,
        drift: -13 + Math.random() * 46,
        lift: 9 + Math.random() * 24,
        delay: (y / height) * 0.22 + Math.random() * 0.18,
        size: step,
        color: `rgb(${red} ${green} ${blue})`,
        ash: dark && Math.random() < 0.36 ? '#968780' : undefined,
        opacity: alpha,
      });
    }
  }

  return particles;
}

export function drawDissolve(ctx: CanvasRenderingContext2D, particles: DustParticle[], progress: number) {
  if (progress >= 1) return;

  ctx.save();
  const opacity = ctx.globalAlpha;

  for (const particle of particles) {
    const time = Math.max(0, (progress - particle.delay) / (1 - particle.delay));
    const drift = time * (0.45 + 0.55 * time);
    const size = Math.max(0.45, particle.size * (1 - time * 0.55));
    ctx.globalAlpha = opacity * particle.opacity * (1 - time * time);
    ctx.fillStyle = time > 0.16 && particle.ash ? particle.ash : particle.color;
    ctx.fillRect(particle.x + particle.drift * drift, particle.y - particle.lift * time, size, size);
  }

  ctx.restore();
}

export function drawProjectile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  kind: ProjectileKind,
  direction: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction < 0 ? -1 : 1, 1);
  ctx.lineJoin = 'round';

  const trail = kind === 'star' ? 12 : 19;
  ctx.fillStyle = kind === 'star' ? '#7775816b' : '#f0523675';
  ctx.beginPath();
  ctx.moveTo(-trail, 0);
  ctx.lineTo(0, -2);
  ctx.lineTo(0, 2);
  ctx.closePath();
  ctx.fill();

  if (kind === 'star') {
    ctx.rotate(progress * Math.PI * 6);
    ctx.fillStyle = '#393643';
    ctx.strokeStyle = '#d9d7e2';
    ctx.lineWidth = 0.95;
    ctx.beginPath();
    for (let point = 0; point < 8; point++) {
      const angle = point * Math.PI / 4;
      const radius = point % 2 === 0 ? 5.8 : 2.05;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e8e5ee';
    ctx.beginPath();
    ctx.arc(0, 0, 0.8, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#fe713f';
    ctx.strokeStyle = '#873526';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-6, -2.15);
    ctx.lineTo(4.25, -1.75);
    ctx.lineTo(8.25, 0);
    ctx.lineTo(4.25, 1.75);
    ctx.lineTo(-6, 2.15);
    ctx.lineTo(-3.1, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff2c0';
    ctx.fillRect(-1.5, -0.55, 6.5, 1.1);
  }

  ctx.restore();
}

export function drawImpact(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) {
  if (progress >= 1) return;

  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha *= 1 - progress;
  ctx.strokeStyle = '#de5639';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 2 + progress * 11, 0, Math.PI * 2);
  ctx.stroke();

  for (let index = 0; index < 6; index++) {
    const angle = index * Math.PI / 3 + 0.23;
    const distance = 4 + progress * (12 + (index % 3) * 2);
    const length = distance + 4 * (1 - progress);
    ctx.strokeStyle = index % 2 === 0 ? '#ec6e43' : '#b96d3c';
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * distance, Math.sin(angle) * distance);
    ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawLanding(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) {
  if (progress >= 1) return;

  ctx.save();
  ctx.globalAlpha *= (1 - progress) * 0.65;
  const height = Math.sin(progress * Math.PI);

  for (let dot = 0; dot < 6; dot++) {
    const direction = dot % 2 === 0 ? -1 : 1;
    const distance = 2 + progress * (8 + dot * 2);
    const size = (dot % 3 === 0 ? 2 : 1.5) * (1 - progress * 0.45);
    ctx.fillStyle = dot % 2 === 0 ? '#887a6b' : '#ac9381';
    ctx.fillRect(x + direction * distance, y - height * (2 + dot * 0.75), size, size);
  }

  ctx.restore();
}
