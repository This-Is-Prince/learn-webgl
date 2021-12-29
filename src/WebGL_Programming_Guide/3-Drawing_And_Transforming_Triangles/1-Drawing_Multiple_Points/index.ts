import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";

window.addEventListener("load", () => {
  multiPoint();
});

const updateCanvasSize = (canvas: HTMLCanvasElement) => {
  const { clientWidth, clientHeight } = canvas;
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

const multiPoint = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  updateCanvasSize(canvas);

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
   * Locations
   */
  const a_Position = gl.getAttribLocation(program, "a_Position");

  const g_points = [
    {
      x: 0.5,
      y: -0.5,
    },
    {
      x: -0.5,
      y: -0.5,
    },
    {
      x: 0,
      y: 0.5,
    },
  ];

  gl.useProgram(program);
  gl.viewport(0, 0, canvas.width, canvas.height);
  draw(gl, a_Position, g_points);
};

const draw = (
  gl: WebGLRenderingContext,
  a_Position: number,
  g_points: { x: number; y: number }[]
) => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_points.forEach((point) => {
    gl.vertexAttrib3f(a_Position, point.x, point.y, 0);
    gl.drawArrays(gl.POINTS, 0, 1);
  });
};
