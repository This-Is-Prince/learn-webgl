import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import * as m3 from "../../0-Helpers/m3";

/**
 * Canvas
 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const pixelRatio = Math.min(window.devicePixelRatio, 2);
const { clientWidth, clientHeight } = canvas;
const width = (clientWidth * pixelRatio) | 0;
const height = (clientHeight * pixelRatio) | 0;
canvas.width = width;
canvas.height = height;

/**
 * WebGL Rendering Context
 */
const gl = canvas.getContext("webgl");
if (!gl) {
  throw new Error("webgl is not supported");
}

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, width, height);

/**
 * Create Shader Function
 */
type CreateShaderFunType = (
  gl: WebGLRenderingContext,
  shaderType: number,
  shaderSource: string
) => WebGLShader;
const createShader: CreateShaderFunType = (gl, shaderType, shaderSource) => {
  const shader = gl.createShader(shaderType) as WebGLShader;
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const shaderInfoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader is not compiled ${shaderInfoLog}`);
  }
  return shader;
};

/**
 * Create Program Function
 */
type CreateProgramFunType = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => WebGLProgram;
const createProgram: CreateProgramFunType = (
  gl,
  vertexShader,
  fragmentShader
) => {
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!success) {
    const programInfoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`program can't be linked ${programInfoLog}`);
  }
  return program;
};

/**
 * SetGeometry Function
 */
const setGeometry = (gl: WebGLRenderingContext) => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -150, -100, 150, -100, -150, 100, 150, -100, -150, 100, 150, 100,
    ]),
    gl.STATIC_DRAW
  );
};

/**
 * SetColors Function
 */
const setColors = (gl: WebGLRenderingContext) => {
  const r1 = Math.random();
  const b1 = Math.random();
  const g1 = Math.random();

  const r2 = Math.random();
  const b2 = Math.random();
  const g2 = Math.random();

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // first Color
      r1,
      b1,
      g1,
      1,
      // second Color
      r1,
      b1,
      g1,
      1,
      // third Color
      r1,
      b1,
      g1,
      1,
      // fourth Color
      r2,
      b2,
      g2,
      1,
      // fifth Color
      r2,
      b2,
      g2,
      1,
      // sixth Color
      r2,
      b2,
      g2,
      1,
    ]),
    gl.STATIC_DRAW
  );
};

/**
 * GLSL Shaders
 */
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);

/**
 * GLSL Program
 */
const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

// Position attribute location
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
setGeometry(gl);

// Color attribute location
const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
setColors(gl);

const matrixLocation = gl.getUniformLocation(program, "u_matrix");
const translation = [200, 150];
const angleInRadians = 0;
const scale = [1, 1];
let matrix = m3.projection(clientWidth, clientHeight);
matrix = m3.translate(matrix, translation[0], translation[1]);
matrix = m3.rotate(matrix, angleInRadians);
matrix = m3.scale(matrix, scale[0], scale[1]);

gl.uniformMatrix3fv(matrixLocation, false, matrix);

gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(colorAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 6);
