class RenderLoop {
  public fps!: number;
  public isActive!: boolean;
  public callback!: Function;
  public msLastFrame!: number;
  public msFpsLimit!: number;
  public run!: FrameRequestCallback;

  constructor(callback: Function, fps?: number) {
    this.fps = 0;
    this.msLastFrame = 0;
    this.isActive = false;
    this.callback = callback;

    let run: FrameRequestCallback;
    if (fps && fps > 0) {
      this.msFpsLimit = 1000 / fps;

      run = () => {
        const msCurrent = performance.now();
        const msDelta = msCurrent - this.msLastFrame;
        const deltaTime = msDelta / 1000.0;

        if (msDelta >= this.msFpsLimit) {
          this.msLastFrame = msCurrent;
          this.callback(deltaTime);
        }

        if (this.isActive) {
          window.requestAnimationFrame(this.run);
        }
      };
    } else {
      run = () => {
        const msCurrent = performance.now();
        const deltaTime = (msCurrent - this.msLastFrame) / 1000.0;

        this.msLastFrame = msCurrent;
        this.callback(deltaTime);
        if (this.isActive) {
          window.requestAnimationFrame(this.run);
        }
      };
    }
    this.run = run.bind(this);
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
