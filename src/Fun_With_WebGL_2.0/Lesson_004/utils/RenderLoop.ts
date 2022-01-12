class RenderLoop {
  public run!: FrameRequestCallback;
  public msFpsLimit!: number;
  public msLastFrame!: number;
  public isActive!: boolean;
  constructor(public callback: FrameRequestCallback, public fps?: number) {
    this.msLastFrame = 0;
    this.isActive = false;

    if (fps && fps > 0) {
      this.msFpsLimit = 1000 / fps;
      this.run = (() => {
        const msCurrent = performance.now();
        const msDelta = msCurrent - this.msLastFrame;
        const deltaTime = msDelta / 1000;
        if (msDelta >= this.msFpsLimit) {
          this.msLastFrame = msCurrent;
          this.callback(deltaTime);
        }
        if (this.isActive) {
          window.requestAnimationFrame(this.run);
        }
      }).bind(this);
    } else {
      this.run = (() => {
        const msCurrent = performance.now();
        const deltaTime = (msCurrent - this.msLastFrame) / 1000;
        this.msLastFrame = msCurrent;
        this.callback(deltaTime);
        if (this.isActive) {
          window.requestAnimationFrame(this.run);
        }
      }).bind(this);
    }
  }
  start() {
    this.isActive = true;
    this.msLastFrame = performance.now();
    window.requestAnimationFrame(this.run);
    return this;
  }
  stop() {
    this.isActive = false;
  }
}

export { RenderLoop };
