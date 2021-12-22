// /**
//  * Canvas
//  */
// const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// /**
//  * WebGLRenderingContext
//  */
// const gl = canvas.getContext("webgl");

// /**
//  * Create Shader
//  */

// function createShader(gl: WebGLRenderingContext, type: number, source: string) {
//   const shader = gl.createShader(type) as WebGLShader;
//   gl.shaderSource(shader, source);
//   gl.compileShader(shader);

//   const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean;
//   if (success) {
//     return shader;
//   }
//   console.log(gl.getShaderInfoLog(shader));
//   gl.deleteShader(shader);
// }

// /**
//  * Create Program
//  */

// function createProgram(
//   gl: WebGLRenderingContext,
//   vertexShader: WebGLShader,
//   fragmentShader: WebGLShader
// ) {
//   const program = gl.createProgram() as WebGLProgram;
//   gl.attachShader(program, vertexShader);
//   gl.attachShader(program, fragmentShader);
//   gl.linkProgram(program);

//   const success = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
//   if (success) {
//     return program;
//   }
//   console.log(gl.getProgramInfoLog(program));
//   gl.deleteProgram(program);
// }

// if (gl === null) {
//   alert("WebGL not supported in your browser");
//   throw new Error("WebGL not supported in your browser");
// }

// // Clear the canvas
// gl.clearColor(0, 0, 0, 0);
// gl.clear(gl.COLOR_BUFFER_BIT);

// let { clientWidth, clientHeight } = gl.canvas;
// const pixelRatio = Math.min(window.devicePixelRatio, 2);
// clientHeight = (clientHeight * pixelRatio) | 0;
// clientWidth = (clientWidth * pixelRatio) | 0;
// gl.canvas.width = clientWidth;
// gl.canvas.height = clientHeight;
// gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// const vertexShaderSource = (
//   document.getElementById("vertex-shader-2d") as HTMLScriptElement
// ).text;
// const fragmentShaderSource = (
//   document.getElementById("fragment-shader-2d") as HTMLScriptElement
// ).text;

// const vertexShader = createShader(
//   gl,
//   gl.VERTEX_SHADER,
//   vertexShaderSource
// ) as WebGLShader;
// const fragmentShader = createShader(
//   gl,
//   gl.FRAGMENT_SHADER,
//   fragmentShaderSource
// ) as WebGLShader;

// const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;
// gl.useProgram(program);

// const resolutionUniformLocation = gl.getUniformLocation(
//   program,
//   "u_resolution"
// );

// // set the resolution
// gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
// gl.enableVertexAttribArray(positionAttributeLocation);

// const positionBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// const size = 2;
// const type = gl.FLOAT;
// const normalize = false;
// const stride = 0;
// let offset = 0;
// gl.vertexAttribPointer(
//   positionAttributeLocation,
//   size,
//   type,
//   normalize,
//   stride,
//   offset
// );

// const colorUniformLocation = gl.getUniformLocation(program, "u_color");

// // Returns a random integer from 0 to (range - 1);
// const randomInt = (range: number) => {
//   return Math.floor(Math.random() * range);
// };

// const drawRectangles = (howMuch: number) => {
//   // Draw 50 random rectangles in random colors
//   for (let i = 0; i < howMuch; i++) {
//     setRectangle(
//       gl,
//       randomInt(300),
//       randomInt(300),
//       randomInt(300),
//       randomInt(300)
//     );

//     gl.uniform4f(
//       colorUniformLocation,
//       Math.random(),
//       Math.random(),
//       Math.random(),
//       1
//     );

//     gl.drawArrays(gl.TRIANGLES, 0, 6);
//   }
// };

// // Fills the buffer with the values that define a rectangle.
// const setRectangle = (
//   gl: WebGLRenderingContext,
//   x: number,
//   y: number,
//   width: number,
//   height: number
// ) => {
//   const x1 = x;
//   const x2 = x + width;
//   const y1 = y;
//   const y2 = y + height;
//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
//     gl.STATIC_DRAW
//   );
// };
// drawRectangles(50);

/**
 * ========================= Revise ===========================
 */
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";

/**
 * Canvas
 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const pixelRatio = Math.min(window.devicePixelRatio, 2);
canvas.width = (canvas.clientWidth * pixelRatio) | 0;
canvas.height = (canvas.clientHeight * pixelRatio) | 0;

/**
 * WebGL Rendering Context
 */
const gl = canvas.getContext("webgl");
// Check if webgl exist or not
if (!gl) {
  throw new Error("webgl is not supported");
}

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

/**
 * Create Shader Fun
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
    const shaderLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader is not compiled : ${shaderLog}`);
  }

  return shader;
};

/**
 * Create Program Fun
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
    const programLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`program is not created : ${programLog}`);
  }

  return program;
};

/**
 * Creating Shaders
 */
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);

/**
 * Creating the program
 */
const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

// location of attribute we created in vertex shader
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// location of uniform we created in vertex shader
const resolutionUniformLocation = gl.getUniformLocation(
  program,
  "u_resolution"
);
gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

// location of uniform we created in fragment shader
const colorUniformLocation = gl.getUniformLocation(program, "u_color");

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

const drawRectangles = (howMany: number) => {
  const width = canvas.width;
  const height = canvas.height;
  for (let i = 0; i < howMany; i++) {
    setRectangle(
      gl,
      randomInt(Math.random() * width),
      randomInt(Math.random() * height),
      randomInt(300),
      randomInt(300)
    );
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      0.75
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
};
const randomInt = (range: number) => {
  return Math.floor(Math.random() * range);
};

/**
 * Set Rectangle Fun
 */
type SetRectangleFunType = (
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) => void;

const setRectangle: SetRectangleFunType = (gl, x, y, width, height) => {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y2, x2, y1]),
    gl.STATIC_DRAW
  );
};

drawRectangles(50);
