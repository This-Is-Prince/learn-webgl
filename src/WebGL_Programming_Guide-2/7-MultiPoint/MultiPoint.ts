import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import {
  getAttribLocation,
  getCanvasElement,
  getWebGLContext,
  initArrayBuffer,
  initShaders,
  resizeDrawingBuffer,
} from "../utils";

window.addEventListener("load", () => {
  MultiPoint();
});
const MultiPoint = () => {
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
    draw(gl, gl.POINTS, n);
  });
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  /**
   * initialize Shaders
   */
  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  // set the positions of vertices
  const n = initVertexBuffers(gl, program);
  draw(gl, gl.POINTS, n);
};

type Draw = (gl: WebGLRenderingContext, mode: number, n: number) => void;
/**
 *
 * @param gl WebGLRenderingContext
 * @param n no. of vertices being drawn
 */
const draw: Draw = (gl, mode, n) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(mode, 0, n);
};

type InitVertexBuffers = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
) => number;
/**
 *
 * @param gl WebGLRenderingContext
 * @param program WebGLProgram
 * @returns n no. of vertices being drawn
 */
const initVertexBuffers: InitVertexBuffers = (gl, program) => {
  // vertices coordinates
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  // total vertices
  const n = 3;

  // position location of a_Position
  const a_Position = getAttribLocation(gl, program, "a_Position");

  // init buffer for a_Position
  initArrayBuffer({ gl, attribute: a_Position, data: vertices, size: 2 });

  // return total vertices
  return n;
};
