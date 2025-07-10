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

class FireEffect {
  constructor() {
    this.scale = 4; // Pixel size (larger = chunkier fire, but faster performance)
    this.width = 0;
    this.height = 0;
    this.dots = [];
    this.ctx = null;
    this.canvas = null;
    this.isRunning = false;
    this.effectEnabled = true;
    
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;
    this.fpsHistory = [];
    this.maxFpsHistory = 10;
  }

  init() {
    this.canvas = document.getElementById('frame');
    if (!this.canvas) {
      console.error('Canvas with id "frame" not found');
      return false;
    }

    // Full screen grid (no min limits for better coverage)
    this.width = Math.ceil(window.innerWidth / this.scale);
    this.height = Math.ceil(window.innerHeight / this.scale);

    this.canvas.width = this.width * this.scale;
    this.canvas.height = this.height * this.scale;
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Unable to get 2D context');
      return false;
    }

    // Initialize dots array
    this.dots = new Array(this.width * this.height).fill(0);
    console.log('Canvas initialized with size:', this.canvas.width, 'x', this.canvas.height);

    return true;
  }

  updateFPS() {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastFrameTime;
    
    if (elapsed >= 1000) {
      const currentFps = this.frameCount / (elapsed / 1000);
      
      this.fpsHistory.push(currentFps);
      if (this.fpsHistory.length > this.maxFpsHistory) {
        this.fpsHistory.shift();
      }
      
      this.fps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
      
      if (this.fps < 30 && this.effectEnabled) {
        console.log(`FPS too low (${this.fps.toFixed(1)}), disabling fire effect`);
        this.disableEffect();
      }
      
      this.frameCount = 0;
      this.lastFrameTime = now;
    }
  }

  disableEffect() {
    this.effectEnabled = false;
    if (this.ctx) {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '16px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        'Fire effect disabled due to low FPS', 
        this.canvas.width / 2, 
        this.canvas.height / 2
      );
    }
  }

  enableEffect() {
    this.effectEnabled = true;
    this.resetFire();
  }

  resetFire() {
    // Reset bottom row to full intensity
    for (let x = 0; x < this.width; x++) {
      this.dots[(this.height - 1) * this.width + x] = 35;
    }
  }

  update() {
    if (!this.ctx || !this.isRunning) return;

    this.updateFPS();

    if (!this.effectEnabled) {
      requestAnimationFrame(() => this.update());
      return;
    }

    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Refuel the bottom row each frame to keep fire going
    this.resetFire();

    // Update fire: loop from bottom to top to avoid overwriting
    for (let y = this.height - 2; y >= 0; y--) {  // Start from second-to-bottom, go up
      for (let x = 0; x < this.width; x++) {
        const drift = Math.round(Math.random() * 3);
        const currentIndex = y * this.width + x;
        let sourceIndex = (y + 1) * this.width + x - drift + 1;  // Source from below with drift
        
        // Bounds check
        if (sourceIndex < 0 || sourceIndex >= this.dots.length) {
          sourceIndex = (y + 1) * this.width + x;  // Fallback to direct below
        }
        
        const decay = (drift & 2) + Math.random() * 2;  // Slight random decay for realism
        this.dots[currentIndex] = Math.max(0, this.dots[sourceIndex] - decay);

        const intensity = Math.floor(this.dots[currentIndex]);
        if (intensity > 0) {
          this.ctx.fillStyle = palette[Math.min(intensity, palette.length - 1)];
          this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
        }
      }
    }

    console.log('Frame updated - FPS:', this.fps.toFixed(1));  // Debug log

    requestAnimationFrame(() => this.update());
  }

  start() {
    if (this.init()) {
      this.isRunning = true;
      this.update();
    }
  }

  stop() {
    this.isRunning = false;
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const fireEffect = new FireEffect();
    fireEffect.start();
  });
} else {
  const fireEffect = new FireEffect();
  fireEffect.start();
}