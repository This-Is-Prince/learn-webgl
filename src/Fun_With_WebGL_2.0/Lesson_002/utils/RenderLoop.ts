class RenderLoop {
  public callBack!: Function;
  public fps!: number;
  public isActive!: boolean;
  public msLastFrame!: number;
  public msFpsLimit!: number;
  public run!: FrameRequestCallback;

  constructor(callback: Function, fps?: number) {
    this.msLastFrame = performance.now(); //The time in Milliseconds of the last frame.
    this.callBack = callback; //What function to call for each frame
    this.isActive = false; //Control the On/Off state of the render loop
    this.fps = 0; //Save the value of how fast the loop is going.

    let run: FrameRequestCallback;
    if (fps && fps > 0) {
      //Build a run method that limits the framerate
      this.msFpsLimit = 1000 / fps; //Calc how many milliseconds per frame in one second of time.

      run = () => {
        //Calculate Delta time between frames and the FPS currently.
        const msCurrent = performance.now();
        const msDelta = msCurrent - this.msLastFrame;
        const deltaTime = msDelta / 1000.0; //What fraction of a single second is the delta time

        if (msDelta >= this.msFpsLimit) {
          //Now execute frame since the time has elapsed.
          this.msLastFrame = msCurrent;
          this.callBack(deltaTime);
        }

        if (this.isActive) {
          window.requestAnimationFrame(this.run);
        }
      };
    } else {
      //Else build a run method thats optimized as much as possible.
      run = () => {
        //Calculate Delta time between frames and the FPS currently.
        const msCurrent = performance.now(); //Gives you the whole number of how many milliseconds since the dawn of time :)
        const deltaTime = (msCurrent - this.msLastFrame) / 1000.0; //ms between frames, Then / by 1 second to get the fraction of a second.

        //Now execute frame since the time has elapsed.
        this.msLastFrame = msCurrent;
        this.callBack(deltaTime);
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
