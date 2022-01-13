import { WebGL2Context } from "../lib";

class GL {
  private constructor() {}
  static getGLInstance(canvasID: string) {
    /**
     * Canvas
     */
    let canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = canvasID;
      document.body.appendChild(canvas);
    }
    /**
     * GL
     */
    const gl = canvas.getContext("webgl2") as WebGL2Context;

    // Setting clear color
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    /**
     * Methods
     */
    /**
     * Clear the screen with specified color
     * @returns WebGL2Context
     */
    gl.fClearScreen = function () {
      this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
      return this;
    };

    gl.fCreateArrayBuffer = function (srcData, isStatic = true) {
      const buffer = this.createBuffer() as WebGLBuffer;
      if (!buffer) {
        console.error(`Error unable to create buffer `);
      }
      this.bindBuffer(this.ARRAY_BUFFER, buffer);
      this.bufferData(
        this.ARRAY_BUFFER,
        srcData,
        isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW
      );
      this.bindBuffer(this.ARRAY_BUFFER, null);
      return buffer;
    };

    /**
     * Setters / Getters
     */
    /**
     * Setting size of canvas width, height
     * @param w number width of canvas
     * @param h number height of canvas
     * @returns WebGl2Context
     */
    gl.fSetSize = function (w, h) {
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";
      this.canvas.width = w;
      this.canvas.height = h;

      this.viewport(0, 0, w, h);
      return this;
    };
    return gl;
  }
}

export { GL };
