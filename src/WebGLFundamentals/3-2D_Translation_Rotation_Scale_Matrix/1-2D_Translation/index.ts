import * as dat from "dat.gui";
import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";

/**
 * Dat GUI
 */
const gui = new dat.GUI();

let translationX: dat.GUIController;
let translationY: dat.GUIController;
const createControllers = (gui: dat.GUI) => {
  if (translationX) {
    gui.remove(translationX);
  }
  if (translationY) {
    gui.remove(translationY);
  }
  translationX = gui
    .add(rectParams.translation, "x")
    .min(0)
    .max(canvas.width - rectParams.width)
    .step(1)
    .onChange(() => {
      drawScene();
    });
  translationY = gui
    .add(rectParams.translation, "y")
    .min(0)
    .max(canvas.height - rectParams.height)
    .step(1)
    .onChange(() => {
      drawScene();
    });
};

/**
 * Create Shader
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
    throw new Error(`shader is not compiled : ${shaderInfoLog}`);
  }

  return shader;
};

/**
 * Create Program
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
    throw new Error(`program is not created : ${programInfoLog}`);
  }
  return program;
};

/**
 * Set Rectangles
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
  const y1 = y;
  const x2 = x + width;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
};

/**
 * Window Events
 */
// Resize
window.addEventListener("resize", () => {
  updateCanvasSize(canvas);
  createControllers(gui);
  drawScene();
});

/**
 * Canvas
 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

/**
 * Update Canvas Size
 */
const updateCanvasSize = (canvas: HTMLCanvasElement) => {
  const { clientHeight, clientWidth } = canvas;
  let pixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};
updateCanvasSize(canvas);

/**
 * WebGL Rendering Context
 */
const gl = canvas.getContext("webgl");
if (!gl) {
  throw new Error("webgl is not supported");
}

// shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);

// Program
const program = createProgram(gl, vertexShader, fragmentShader);

// a_position attribute location
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// lookup uniforms
const resolutionUniformLocation = gl.getUniformLocation(
  program,
  "u_resolution"
);
const colorUniformLocation = gl.getUniformLocation(program, "u_color");

// Buffer for position
const positionBuffer = gl.createBuffer();

// bind buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const rectParams = {
  translation: { x: 0, y: 0 },
  width: 100,
  height: 30,
};
createControllers(gui);

const color = [Math.random(), Math.random(), Math.random(), 1];

const drawScene = () => {
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const { height, translation, width } = rectParams;
  setRectangle(gl, translation.x, translation.y, width, height);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
  gl.uniform4fv(colorUniformLocation, color);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
};
drawScene();
