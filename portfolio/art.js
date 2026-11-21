// Orbit Study turns in its own time. Holding the ribbon gives the pointer control.
function startArt(figure, signal) {
  const canvas = figure.querySelector('canvas');
  const toggle = figure.querySelector('.orbit-toggle');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    toggle.hidden = true;
    canvas.removeAttribute('tabindex');
    return;
  }

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const options = {signal};
  const period = 34_000;
  const fullTurn = 2 * Math.PI;
  const dots = new Map([['#b095ff', []], ['#fc9bde', []], ['#ffe1aa', []]]);
  for (let row = 0; row < 170; row++) {
    const u = row * fullTurn / 170;
    for (let column = 0; column < 27; column++) {
      const v = column * fullTurn / 27;
      const radius = 1.02 + .36 * Math.cos(v);
      const color = row < 24 ? '#ffe1aa' : column < 5 ? '#fc9bde' : '#b095ff';
      dots.get(color).push([radius * Math.cos(u), radius * Math.sin(u), .36 * Math.sin(v) + .53 * Math.sin(3 * u)]);
    }
  }

  let yaw = .45;
  let width = 0, height = 0;
  let visible = false, playing = !motion.matches;
  let pointer = null, frame = 0, lastPaint = null;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const scale = Math.min(width * .30, height * .36);
    const cos = Math.cos(yaw), sin = Math.sin(yaw);
    for (const [color, points] of dots) {
      ctx.fillStyle = color;
      for (const [x, y, z] of points) {
        const across = x * cos - y * sin, away = x * sin + y * cos;
        const vertical = .56 * away - .83 * z, depth = .80 * away + .60 * z;
        const size = 1 + Math.max(0, depth) * .7;
        const px = width * .51 + scale * (across * .94 + vertical * .31);
        const py = height * .51 + scale * (-across * .31 + vertical * .94);
        ctx.globalAlpha = Math.max(.13, Math.min(1, .5 + depth * .33));
        ctx.fillRect(px, py, size, size);
      }
    }
    ctx.globalAlpha = 1;
  }
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const density = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    ctx.setTransform(density, 0, 0, density, 0, 0);
    draw();
  }
  function tick(now) {
    if (lastPaint === null) lastPaint = now;
    const elapsed = now - lastPaint;
    if (elapsed >= 1000 / 30 - 1) {
      yaw = (yaw + Math.min(elapsed, 100) * fullTurn / period) % fullTurn;
      lastPaint = now;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function syncPlayback() {
    cancelAnimationFrame(frame);
    lastPaint = null;
    if (!signal.aborted && playing && visible && !document.hidden && pointer === null) frame = requestAnimationFrame(tick);
  }
  function setPlaying(value) {
    playing = value;
    toggle.dataset.playing = String(value);
    toggle.textContent = value ? 'Pause' : 'Play';
    toggle.setAttribute('aria-label', value ? 'Pause rotation' : 'Play rotation');
    syncPlayback();
  }
  toggle.addEventListener('click', () => setPlaying(!playing), options);
  motion.addEventListener('change', () => setPlaying(!motion.matches), options);
  document.addEventListener('visibilitychange', syncPlayback, options);
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary || pointer !== null) return;
    pointer = {id:event.pointerId, x:event.clientX, yaw};
    canvas.setPointerCapture(event.pointerId);
    syncPlayback();
  }, options);
  canvas.addEventListener('pointermove', event => {
    if (pointer?.id !== event.pointerId) return;
    yaw = pointer.yaw + (event.clientX - pointer.x) * Math.PI * 1.6 / Math.max(width, 1);
    draw();
  }, options);
  function release(event) {
    if (pointer?.id !== event.pointerId) return;
    pointer = null;
    syncPlayback();
  }
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    canvas.addEventListener(type, release, options);
  }
  canvas.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    yaw += event.key === 'ArrowRight' ? .15 : -.15;
    draw();
  }, options);

  const size = new ResizeObserver(resize);
  const view = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  });
  size.observe(canvas);
  view.observe(canvas);
  signal.addEventListener('abort', () => {
    cancelAnimationFrame(frame);
    size.disconnect();
    view.disconnect();
  }, {once:true});
  resize();
  setPlaying(playing);
}
