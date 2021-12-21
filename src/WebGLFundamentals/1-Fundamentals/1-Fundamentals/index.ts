/**
 * Canvas
 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

/**
 * WebGLRenderingContext
 */
const gl = canvas.getContext("webgl");

/**
 * Create Shader
 */

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean;
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 * Create Program
 */

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

if (gl === null) {
  alert("WebGL not supported in your browser");
  throw new Error("WebGL not supported in your browser");
}

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

let { clientWidth, clientHeight } = gl.canvas;
const pixelRatio = Math.min(window.devicePixelRatio, 2);
clientHeight = (clientHeight * pixelRatio) | 0;
clientWidth = (clientWidth * pixelRatio) | 0;
gl.canvas.width = clientWidth;
gl.canvas.height = clientHeight;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

const vertexShaderSource = (
  document.getElementById("vertex-shader-2d") as HTMLScriptElement
).text;
const fragmentShaderSource = (
  document.getElementById("fragment-shader-2d") as HTMLScriptElement
).text;

const vertexShader = createShader(
  gl,
  gl.VERTEX_SHADER,
  vertexShaderSource
) as WebGLShader;
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
) as WebGLShader;

const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;
gl.useProgram(program);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);

const resolutionUniformLocation = gl.getUniformLocation(
  program,
  "u_resolution"
);

// set the resolution
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// three 2d points
// const positions = [0, 0, 0, 0.5, 0.7, 0];
const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const size = 2;
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
let offset = 0;
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  offset
);

// draw
const primitiveType = gl.TRIANGLES;
offset = 0;
const count = 6;
gl.drawArrays(primitiveType, offset, count);
