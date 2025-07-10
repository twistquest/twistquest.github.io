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
    this.scale = 4;
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
    this.width = Math.min(320, Math.round(window.innerWidth / this.scale));
    this.height = Math.min(240, Math.round(window.innerHeight / this.scale));

    this.canvas = document.getElementById('frame');
    if (!this.canvas) {
      console.error('Canvas with id "frame" not found');
      return false;
    }

    this.canvas.width = this.width * this.scale;
    this.canvas.height = this.height * this.scale;
    this.ctx = this.canvas.getContext('2d');
    
    if (!this.ctx) {
      console.error('Unable to get 2D context');
      return false;
    }

    this.dots = new Array(this.width * this.height);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const index = y * this.width + x;
        this.dots[index] = y === this.height - 1 ? 35 : 0;
      }
    }

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

  enableEffect() {
    this.effectEnabled = true;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const index = y * this.width + x;
        this.dots[index] = y === this.height - 1 ? 35 : 0;
      }
    }
  }

  update() {
    if (!this.ctx || !this.isRunning) return;

    this.updateFPS();

    if (!this.effectEnabled) {
      requestAnimationFrame(() => this.update());
      return;
    }

    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let x = 0; x < this.width; x++) {
      for (let y = 1; y < this.height; y++) {
        const drift = Math.round(Math.random() * 3);
        const currentIndex = y * this.width + x;
        const sourceIndex = currentIndex - this.width - drift + 1;
        
        if (sourceIndex >= 0 && sourceIndex < this.dots.length) {
          this.dots[currentIndex] = this.dots[sourceIndex] - (drift & 2);
        }

        const intensity = Math.max(0, this.dots[currentIndex]);
        if (intensity > 0) {
          this.ctx.fillStyle = palette[Math.min(intensity, palette.length - 1)];
          this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
        }
      }
    }

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

const fireEffect = new FireEffect();
fireEffect.start();