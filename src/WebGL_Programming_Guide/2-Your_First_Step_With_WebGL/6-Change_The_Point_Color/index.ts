import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";

window.addEventListener("load", () => {
  coloredPoints();
});

const updateCanvasSize = (canvas: HTMLCanvasElement) => {
  const { clientWidth, clientHeight } = canvas;
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};
const coloredPoints = () => {
  /**
   * canvas
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
   * Position Location
   */
  const a_Position = gl.getAttribLocation(program, "a_Position");

  /**
   * PointSize Location
   */
  const a_PointSize = gl.getUniformLocation(program, "a_PointSize");

  /**
   * Color Location
   */
  const u_Color = gl.getUniformLocation(program, "u_Color");

  let positions = [[0, 0]];

  canvas.addEventListener("click", function (event) {
    let { clientX: x, clientY: y } = event;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    x = (x * pixelRatio) | 0;
    y = (y * pixelRatio) | 0;
    let { width, height } = this;
    x = (x / width) * 2 - 1;
    y = -((y / height) * 2 - 1);
    positions.push([x, y]);
    draw(gl, a_Position, u_Color, positions);
  });
  gl.useProgram(program);
  gl.uniform1f(a_PointSize, 10);
  gl.uniform4f(u_Color, 1, 0, 0, 1);
  draw(gl, a_Position, u_Color, positions);
};

const draw = (
  gl: WebGLRenderingContext,
  a_Position: number,
  u_Color: WebGLUniformLocation | null,
  positions: number[][]
) => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  positions.forEach((position) => {
    const red = position[0] * 0.5 + 0.5;
    const green = position[1] * 0.5 + 0.5;
    gl.uniform4f(u_Color, red, green, 0, 1);
    gl.vertexAttrib3f(a_Position, position[0], position[1], 0);
    gl.drawArrays(gl.POINTS, 0, 1);
  });
};
