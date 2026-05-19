/**
 * Canvas-based page curl engine — FlipHTML5-style fold-line reflection.
 * Draws a single frame of the page curl animation.
 */

/** Draw the "idle" spread (no animation) */
export function drawIdle(
  ctx: CanvasRenderingContext2D,
  left: HTMLCanvasElement | null,
  right: HTMLCanvasElement | null,
  pw: number, ph: number, dbl: boolean,
) {
  const W = dbl ? pw * 2 : pw;
  ctx.clearRect(0, 0, W, ph);
  ctx.fillStyle = '#fdf8f0';
  ctx.fillRect(0, 0, W, ph);
  if (dbl && left) ctx.drawImage(left, 0, 0, pw, ph);
  if (right) ctx.drawImage(right, dbl ? pw : 0, 0, pw, ph);
  if (dbl) drawSpine(ctx, pw, ph);
}

/** Draw spine shadow for double-page */
function drawSpine(ctx: CanvasRenderingContext2D, pw: number, ph: number) {
  const g = ctx.createLinearGradient(pw - 12, 0, pw + 12, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.35, 'rgba(0,0,0,0.06)');
  g.addColorStop(0.5, 'rgba(0,0,0,0.18)');
  g.addColorStop(0.65, 'rgba(0,0,0,0.06)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(pw - 12, 0, 24, ph);
}

/**
 * Draw one frame of the page curl animation.
 * @param progress 0→1 (0 = flat, 1 = fully turned)
 * @param dir 'next' | 'prev'
 */
export function drawCurlFrame(
  ctx: CanvasRenderingContext2D,
  frontPage: HTMLCanvasElement | null,   // page being turned
  underPage: HTMLCanvasElement | null,   // page revealed underneath
  stayPage: HTMLCanvasElement | null,    // page that stays (other side)
  pw: number, ph: number,
  dbl: boolean,
  progress: number,
  dir: 'next' | 'prev',
) {
  const W = dbl ? pw * 2 : pw;
  ctx.clearRect(0, 0, W, ph);
  ctx.fillStyle = '#fdf8f0';
  ctx.fillRect(0, 0, W, ph);

  // Ease progress for natural feel
  const t = progress;

  if (dir === 'next') {
    drawNextFrame(ctx, frontPage, underPage, stayPage, pw, ph, dbl, t);
  } else {
    drawPrevFrame(ctx, frontPage, underPage, stayPage, pw, ph, dbl, t);
  }
  if (dbl) drawSpine(ctx, pw, ph);
}

function drawNextFrame(
  ctx: CanvasRenderingContext2D,
  front: HTMLCanvasElement | null,
  under: HTMLCanvasElement | null,
  stay: HTMLCanvasElement | null,
  pw: number, ph: number, dbl: boolean, t: number,
) {
  const W = dbl ? pw * 2 : pw;
  // Fold line X position — sweeps from right edge to left
  const rightEdge = dbl ? pw * 2 : pw;
  const leftEdge = dbl ? pw * 0.15 : pw * 0.05;
  const foldX = rightEdge - (rightEdge - leftEdge) * t;
  const curlW = Math.min(pw * 0.45, (rightEdge - foldX) * 0.42);

  // 1. Draw page that stays (left page in double mode)
  if (dbl && stay) ctx.drawImage(stay, 0, 0, pw, ph);

  // 2. Draw under page (revealed page)
  if (under) {
    ctx.save();
    ctx.beginPath();
    if (dbl) { ctx.rect(pw, 0, pw, ph); } else { ctx.rect(0, 0, pw, ph); }
    ctx.clip();
    ctx.drawImage(under, dbl ? pw : 0, 0, pw, ph);
    ctx.restore();
  }

  // 3. Shadow on under page from curl
  if (curlW > 2) {
    ctx.save();
    const sw = Math.min(curlW * 0.7, 40);
    const sg = ctx.createLinearGradient(foldX - sw, 0, foldX, 0);
    sg.addColorStop(0, 'rgba(0,0,0,0)');
    sg.addColorStop(0.6, `rgba(0,0,0,${0.08 + t * 0.12})`);
    sg.addColorStop(1, `rgba(0,0,0,${0.15 + t * 0.15})`);
    ctx.fillStyle = sg;
    ctx.fillRect(foldX - sw, 0, sw, ph);
    ctx.restore();
  }

  // 4. Draw front page — flat portion (left of fold line)
  if (front) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(dbl ? pw : 0, 0, foldX - (dbl ? pw : 0), ph);
    ctx.clip();
    ctx.drawImage(front, dbl ? pw : 0, 0, pw, ph);
    ctx.restore();
  }

  // 5. Draw curled portion (reflected)
  if (front && curlW > 2) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(foldX, 0, curlW, ph);
    ctx.clip();
    // Reflect across fold line
    ctx.translate(foldX, 0);
    ctx.scale(-1, 1);
    ctx.translate(-foldX, 0);
    ctx.drawImage(front, dbl ? pw : 0, 0, pw, ph);
    ctx.restore();

    // Gradient shading on curl
    ctx.save();
    ctx.beginPath();
    ctx.rect(foldX, 0, curlW, ph);
    ctx.clip();
    const cg = ctx.createLinearGradient(foldX, 0, foldX + curlW, 0);
    cg.addColorStop(0, 'rgba(0,0,0,0.12)');
    cg.addColorStop(0.15, 'rgba(255,255,255,0.06)');
    cg.addColorStop(0.4, 'rgba(0,0,0,0)');
    cg.addColorStop(0.85, 'rgba(0,0,0,0.04)');
    cg.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = cg;
    ctx.fillRect(foldX, 0, curlW, ph);
    ctx.restore();

    // Fold edge highlight
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(foldX, 0);
    ctx.lineTo(foldX, ph);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPrevFrame(
  ctx: CanvasRenderingContext2D,
  front: HTMLCanvasElement | null,
  under: HTMLCanvasElement | null,
  stay: HTMLCanvasElement | null,
  pw: number, ph: number, dbl: boolean, t: number,
) {
  const leftEdge = 0;
  const rightEdge = dbl ? pw * 0.85 : pw * 0.95;
  const foldX = leftEdge + (rightEdge - leftEdge) * t;
  const curlW = Math.min(pw * 0.45, foldX * 0.42);

  // 1. Draw page that stays (right page in double mode)
  if (dbl && stay) ctx.drawImage(stay, pw, 0, pw, ph);

  // 2. Draw under page (revealed page)
  if (under) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, dbl ? pw : pw, ph);
    ctx.clip();
    ctx.drawImage(under, 0, 0, pw, ph);
    ctx.restore();
  }

  // 3. Shadow on under page
  if (curlW > 2) {
    ctx.save();
    const sw = Math.min(curlW * 0.7, 40);
    const sg = ctx.createLinearGradient(foldX + sw, 0, foldX, 0);
    sg.addColorStop(0, 'rgba(0,0,0,0)');
    sg.addColorStop(0.6, `rgba(0,0,0,${0.08 + t * 0.12})`);
    sg.addColorStop(1, `rgba(0,0,0,${0.15 + t * 0.15})`);
    ctx.fillStyle = sg;
    ctx.fillRect(foldX, 0, sw, ph);
    ctx.restore();
  }

  // 4. Draw front page — flat portion (right of fold line)
  if (front) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(foldX, 0, (dbl ? pw : pw) - foldX, ph);
    ctx.clip();
    ctx.drawImage(front, 0, 0, pw, ph);
    ctx.restore();
  }

  // 5. Draw curled portion (reflected)
  if (front && curlW > 2) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(foldX - curlW, 0, curlW, ph);
    ctx.clip();
    ctx.translate(foldX, 0);
    ctx.scale(-1, 1);
    ctx.translate(-foldX, 0);
    ctx.drawImage(front, 0, 0, pw, ph);
    ctx.restore();

    // Gradient shading
    ctx.save();
    ctx.beginPath();
    ctx.rect(foldX - curlW, 0, curlW, ph);
    ctx.clip();
    const cg = ctx.createLinearGradient(foldX, 0, foldX - curlW, 0);
    cg.addColorStop(0, 'rgba(0,0,0,0.12)');
    cg.addColorStop(0.15, 'rgba(255,255,255,0.06)');
    cg.addColorStop(0.4, 'rgba(0,0,0,0)');
    cg.addColorStop(0.85, 'rgba(0,0,0,0.04)');
    cg.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = cg;
    ctx.fillRect(foldX - curlW, 0, curlW, ph);
    ctx.restore();

    // Fold edge
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(foldX, 0);
    ctx.lineTo(foldX, ph);
    ctx.stroke();
    ctx.restore();
  }
}

/** Draw corner curl preview (small triangle peel at corner) */
export function drawCornerCurl(
  ctx: CanvasRenderingContext2D,
  pw: number, ph: number, dbl: boolean,
  corner: 'br' | 'bl' | null,
  amount: number, // 0–1
) {
  if (!corner || amount <= 0) return;
  const W = dbl ? pw * 2 : pw;
  const sz = 30 + amount * 50; // curl size in pixels

  ctx.save();
  if (corner === 'br') {
    const cx = W, cy = ph;
    // Triangle peel
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - sz, cy);
    ctx.lineTo(cx, cy - sz);
    ctx.closePath();
    ctx.clip();
    // Background (page underneath)
    ctx.fillStyle = '#e8e0d0';
    ctx.fill();
    // Gradient
    const g = ctx.createLinearGradient(cx, cy, cx - sz, cy - sz);
    g.addColorStop(0, 'rgba(0,0,0,0.15)');
    g.addColorStop(0.5, 'rgba(0,0,0,0.04)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - sz, cy - sz, sz, sz);
  } else {
    const cx = 0, cy = ph;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + sz, cy);
    ctx.lineTo(cx, cy - sz);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = '#e8e0d0';
    ctx.fill();
    const g = ctx.createLinearGradient(cx, cy, cx + sz, cy - sz);
    g.addColorStop(0, 'rgba(0,0,0,0.15)');
    g.addColorStop(0.5, 'rgba(0,0,0,0.04)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx, cy - sz, sz, sz);
  }
  ctx.restore();

  // Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 8;
  if (corner === 'br') {
    ctx.beginPath();
    ctx.moveTo(W, ph);
    ctx.lineTo(W - sz, ph);
    ctx.lineTo(W, ph - sz);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, ph);
    ctx.lineTo(sz, ph);
    ctx.lineTo(0, ph - sz);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fill();
  }
  ctx.restore();
}
