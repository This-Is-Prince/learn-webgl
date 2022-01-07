import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import {
  getCanvasElement,
  getWebGLContext,
  initShaders,
  updateCanvasResolution,
} from "../utils";

window.addEventListener("load", () => {
  HelloPoint1();
});
const HelloPoint1 = () => {
  /**
   * Canvas
   */
  const canvas = getCanvasElement("canvas");
  updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));

  /**
   * WebGLRenderingContext
   */
  const gl = getWebGLContext(canvas);

  /**
   * Initialize Shaders
   */
  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
};
