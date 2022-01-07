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
  HelloTriangle();
});

const HelloTriangle = () => {
  // Canvas
  const canvas = getCanvasElement("canvas");

  // WebGLRenderingContext
  const gl = getWebGLContext(canvas);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));
  window.addEventListener("resize", () => {
    resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));
    draw(gl, gl.TRIANGLES, n);
  });

  // Initialize Shaders
  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  // Set vertex buffers
  const n = initVertexBuffers(gl, program);
  draw(gl, gl.TRIANGLES, n);
};

const draw = (gl: WebGLRenderingContext, mode: number, n: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(mode, 0, n);
};

const initVertexBuffers = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
) => {
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const n = 3;
  const a_Position = getAttribLocation(gl, program, "a_Position");
  initArrayBuffer({ attribute: a_Position, data: vertices, gl, size: 2 });
  return n;
};
