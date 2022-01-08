import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import {
  getAttribLocation,
  getCanvasElement,
  getUniformLocation,
  getWebGLContext,
  initArrayBuffer,
  initShaders,
  resizeDrawingBuffer,
} from "../utils";
import { Matrix4 } from "../matrix4";

window.addEventListener("load", () => {
  RotatedTriangle_Matrix();
});

const RotatedTriangle_Matrix = () => {
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
    draw(gl, n);
  });
  gl.clearColor(0, 0, 0, 1);

  /**
   * initialize shaders
   */
  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  /**
   * Initialize buffers
   */
  const n = initVertexBuffers(gl, program);

  // u_ModelMatrix
  const u_ModelMatrix = getUniformLocation(gl, program, "u_ModelMatrix");
  const ANGLE = 45;
  const radian = (Math.PI * ANGLE) / 180;
  const cosB = Math.cos(radian);
  const sinB = Math.sin(radian);

  const modelMatrix = new Float32Array([
    // First column
    cosB,
    sinB,
    0.0,
    0.0,
    // second column
    -sinB,
    cosB,
    0.0,
    0.0,
    // third column
    0.0,
    0.0,
    1.0,
    0.0,
    // fourth column
    0.0,
    0.0,
    0.0,
    1.0,
  ]);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

  draw(gl, n);
};
const draw = (gl: WebGLRenderingContext, n: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
};

const initVertexBuffers = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
): number => {
  // Vertices
  const vertices = new Float32Array([
    // First vertex
    0.0, 0.5,
    // First vertex
    -0.5, -0.5,
    // First vertex
    0.5, -0.5,
  ]);
  const n = 3;

  // a_Position
  const a_Position = getAttribLocation(gl, program, "a_Position");
  initArrayBuffer({ attribute: a_Position, size: 2, data: vertices, gl });

  return n;
};
