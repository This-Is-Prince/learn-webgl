import { WebGL2Context } from "./types";

const GLInstance = (canvasID: string) => {
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
   * WebGL2Context
   */
  const gl = canvas.getContext("webgl2") as WebGL2Context;

  // ................................................
  // Setup GL, Set all the default configurations we need.
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // ................................................
  // Methods
  gl.fClear = function () {
    this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
    return this;
  };

  // Create and fill our Array Buffer.
  gl.fCreateArrayBuffer = function (srcData, isStatic = true) {
    const buffer = this.createBuffer() as WebGLBuffer;
    this.bindBuffer(this.ARRAY_BUFFER, buffer);
    this.bufferData(
      this.ARRAY_BUFFER,
      srcData,
      isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW
    );
    this.bindBuffer(this.ARRAY_BUFFER, null);
    return buffer;
  };

  // ................................................
  // Setters - Getters

  // Set the size of the canvas html element and the rendering view port
  gl.fSetSize = function (w, h) {
    // Set the size of canvas, on chrome we need to set it 3 ways to make it work perfectly.
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.canvas.width = w;
    this.canvas.height = h;

    // When updating the canvas size, must reset the viewport of the canvas
    // else the resolution webgl renders at will not change
    this.viewport(0, 0, w, h);
    return this;
  };
  return gl;
};
export { GLInstance };
