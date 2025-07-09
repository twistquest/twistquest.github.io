const palette = [
  '#070707', '#1f0707', '#2f0f07', '#470f07',
  '#571707', '#671f07', '#771f07', '#8f2707',
  '#9f2f07', '#af3f07', '#bf4707', '#c74707',
  '#df4f07', '#df5707', '#df5707', '#d75f07',
  '#d7670f', '#cf6f0f', '#cf770f', '#cf7f0f',
  '#cf8717', '#c78717', '#c78f17', '#c7971f', 
  '#bf9f1f', '#bf9f1f', '#bfa727', '#bfa727',
  '#bfaf2f', '#b7af2f', '#b7b72f', '#b7b737',
  '#cfcf6f', '#dfdf9f', '#efefc7', '#ffffff'
];

const scale = 4;
let width = 0, height = 0;
let dots = [];
let ctx = null;
let canvas = null;

// FPS tracking
let lastFpsUpdate = performance.now();
let frameCount = 0;
let fps = 0;
const minFps = 30; // Threshold to disable effect

let running = true; // Control the animation loop

function setupCanvas() {
  width = Math.min(320, Math.round(window.innerWidth / scale));
  height = Math.min(240, Math.round(window.innerHeight / scale));

  canvas = document.getElementById('frame');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'frame';
    document.body.appendChild(canvas);
  }
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx = canvas.getContext('2d');
}

function initDots() {
  dots = new Array(width * height).fill(0);
  // Set the bottom row to the hottest color
  for (let x = 0; x < width; x++) {
    dots[(height - 1) * width + x] = palette.length - 1;
  }
}

function updateFire() {
  for (let x = 0; x < width; x++) {
    for (let y = 1; y < height; y++) {
      const src = y * width + x;
      const rand = Math.floor(Math.random() * 3.5); // 0,1,2,3
      const dst = src - width + (rand - 1); 
      const value = dots[src] - (rand & 1);
      dots[dst < 0 ? 0 : dst] = value > 0 ? value : 0;
    }
  }
}

function drawFire() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const colorIdx = dots[y * width + x];
      ctx.fillStyle = palette[colorIdx];
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

function loop() {
  if (!running) return;

  ctx.clearRect(0, 0, width * scale, height * scale);

  updateFire();
  drawFire();

  
  frameCount++;
  const now = performance.now();
  if (now - lastFpsUpdate >= 1000) {
    fps = frameCount / ((now - lastFpsUpdate) / 1000);
    frameCount = 0;
    lastFpsUpdate = now;
    if (fps < minFps) {
      running = false;
      canvas.remove();
      alert('Effect disabled: FPS too low!');
      return;
    }
  }

  requestAnimationFrame(loop);
}

function startFireEffect() {
  setupCanvas();
  initDots();
  running = true;
  lastFpsUpdate = performance.now();
  frameCount = 0;
  fps = 0;
  loop();
}


startFireEffect();