import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";

window.addEventListener("load", () => {
  helloPoint2();
});

const updateSize = (canvas: HTMLCanvasElement) => {
  const { clientWidth, clientHeight } = canvas;
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

const helloPoint2 = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`canvas is not retrieve`);
  }
  // update Canvas size
  updateSize(canvas);

  /**
   * WebGL Rendering Context
   */
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  /**
   * Shaders
   */
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  /**
   * Program
   */
  const program = createProgram(gl, vertexShader, fragmentShader);

  /**
   * Attributes Locations
   */
  const a_Position = gl.getAttribLocation(program, "a_Position");
  const a_PointSize = gl.getAttribLocation(program, "a_PointSize");
  if (a_Position < 0) {
    throw new Error(`Failed to get the storage location of a_Position`);
  }
  if (a_PointSize < 0) {
    throw new Error(`Failed to get the storage location of a_PointSize`);
  }
  gl.vertexAttrib3f(a_Position, 0, 0, 0);
  gl.vertexAttrib1f(a_PointSize, 10);

  draw(gl, program, gl.POINTS, 3);
};

type DrawFunType = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  mode: number,
  count: number
) => void;

const draw: DrawFunType = (gl: WebGLRenderingContext, program, mode, count) => {
  gl.useProgram(program);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.clearStencil(0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  gl.drawArrays(mode, 0, count);
};
