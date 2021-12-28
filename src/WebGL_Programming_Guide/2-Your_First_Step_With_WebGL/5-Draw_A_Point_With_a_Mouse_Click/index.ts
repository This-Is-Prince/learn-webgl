import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";

window.addEventListener("load", () => {
  clickedPoints();
});
const updateCanvasSize = (canvas: HTMLCanvasElement) => {
  const { clientHeight, clientWidth } = canvas;
  //   const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const pixelRatio = 1;
  canvas.width = (pixelRatio * clientWidth) | 0;
  canvas.height = (pixelRatio * clientHeight) | 0;
};

const clickedPoints = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`canvas is not retrieved`);
  }
  updateCanvasSize(canvas);

  /**
   * WebGL Rendering Context
   */
  const gl = canvas.getContext("webgl");
  if (!gl) {
    throw new Error(`webgl is not supported`);
  }

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
  const a_PointSize = gl.getAttribLocation(program, "a_PointSize");
  gl.vertexAttrib1f(a_PointSize, 10);
  const positions: number[] = [0, 0];

  canvas.addEventListener("click", function (event) {
    let { x, y } = event;
    let { width, height } = this;
    x = (x / width) * 2 - 1;
    y = -((y / height) * 2 - 1);
    positions.push(x, y);
    draw(gl, a_Position, positions);
  });

  gl.useProgram(program);
  gl.viewport(0, 0, canvas.width, canvas.height);
  draw(gl, a_Position, positions);
};

const draw = (
  gl: WebGLRenderingContext,
  a_Position: number,
  positions: number[]
) => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (let i = 0; i < positions.length; i += 2) {
    gl.vertexAttrib3f(a_Position, positions[i], positions[i + 1], 0);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
};
