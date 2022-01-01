import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";

const updateCanvasResolution = (
  canvas: HTMLCanvasElement,
  pixelRatio: number
) => {
  const { clientWidth, clientHeight } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

window.addEventListener("load", () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));

  /**
   * WebGL Rendering Context
   */
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
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
   * Vertex Data
   */
  const vertices = new Float32Array([
    // first vertex
    -0.5, 0.5, 1.0, 0.0, 0.0,
    // second vertex
    -0.5, -0.5, 0.0, 1.0, 0.0,
    // third vertex
    0.5, 0.5, 0.0, 0.0, 1.0,
    // fourth vertex
    0.5, -0.5, 1.0, 1.0, 1.0,
  ]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  /**
   * a_Position Location
   */
  const a_Position = gl.getAttribLocation(program, "a_Position");

  /**
   * a_Color Location
   */
  const a_Color = gl.getAttribLocation(program, "a_Color");

  /**
   * u_MVPMatrix Location
   */
  const u_MVPMatrix = gl.getUniformLocation(program, "u_MVPMatrix");

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  const FSIZE = vertices.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);

  gl.uniformMatrix4fv(
    u_MVPMatrix,
    false,
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  );

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
