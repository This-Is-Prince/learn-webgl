import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import {
  getCanvasElement,
  getWebGLContext,
  initShaders,
  resizeDrawingBuffer,
} from "../utils";

window.addEventListener("load", () => {
  HelloPoint1();
});
const HelloPoint1 = () => {
  /**
   * Canvas
   */
  const canvas = getCanvasElement("canvas");

  /**
   * WebGLRenderingContext
   */
  const gl = getWebGLContext(canvas);
  resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));
  window.addEventListener("resize", () => {
    resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));
    draw(gl);
  });

  /**
   * Initialize Shaders
   */
  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);
  gl.clearColor(0, 0, 0, 1);
  draw(gl);
};
const draw = (gl: WebGLRenderingContext) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
};
