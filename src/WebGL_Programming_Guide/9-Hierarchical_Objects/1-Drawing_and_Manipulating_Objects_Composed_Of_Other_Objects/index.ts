import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import {
  createProgram,
  createShader,
} from "../../9-Hierarchical_Objects/utils";
import { Matrix4, Vector3 } from "../../9-Hierarchical_Objects/matrix4";
const vertices = new Float32Array([
  // v0-v1-v2-v3 front
  1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5,
  // v0-v3-v4-v5 right
  1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5,
  // v0-v5-v6-v1 up
  1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5,
  // v1-v6-v7-v2 left
  -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5,
  // v7-v4-v3-v2 down
  -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5,
  // v4-v7-v6-v5 back
  1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5,
]);

// Normal
const normals = new Float32Array([
  // v0-v1-v2-v3 front
  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
  // v0-v3-v4-v5 right
  1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
  // v0-v5-v6-v1 up
  0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
  // v1-v6-v7-v2 left
  -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
  // v7-v4-v3-v2 down
  0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
  // v4-v7-v6-v5 back
  0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
]);

// Indices of the vertices
const indices = new Uint8Array([
  // front
  0, 1, 2, 0, 2, 3,
  // right
  4, 5, 6, 4, 6, 7,
  // up
  8, 9, 10, 8, 10, 11,
  // left
  12, 13, 14, 12, 14, 15,
  // down
  16, 17, 18, 16, 18, 19,
  // back
  20, 21, 22, 20, 22, 23,
]);

window.addEventListener("load", () => {
  start();
});

const updateCanvasResolution = (gl: WebGLRenderingContext) => {
  const { clientHeight, clientWidth } = gl.canvas;
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  gl.canvas.width = (clientWidth * pixelRatio) | 0;
  gl.canvas.height = (clientHeight * pixelRatio) | 0;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};
const start = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`can't get canvas element`);
  }

  /**
   * WebGL Rendering Context
   */
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  if (!gl) {
    throw new Error(`webgl is not supported`);
  }
  updateCanvasResolution(gl);

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

  gl.useProgram(program);
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  /**
   * Buffers
   */
  // a_Position
  initBuffer(gl, program, 3, gl.FLOAT, vertices, "a_Position");
  // a_Normal
  initBuffer(gl, program, 3, gl.FLOAT, normals, "a_Normal");

  /**
   * Normal Matrix
   */
  const u_NormalMatrix = gl.getUniformLocation(program, "u_NormalMatrix");

  /**
   * MVP
   */
  const u_MvpMatrix = gl.getUniformLocation(program, "u_MvpMatrix");

  const viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(50, canvas.width / canvas.height, 0.1, 100);
  viewProjMatrix.lookAt(
    new Vector3(20, 10, 30),
    new Vector3(0, 0, 0),
    new Vector3(0, 1, 0)
  );

  window.addEventListener("keydown", function (ev) {
    keydown(
      ev,
      gl,
      indices.length,
      viewProjMatrix,
      u_MvpMatrix,
      u_NormalMatrix
    );
  });

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  draw(gl, indices.length, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
};

let ANGLE_STEP = 3.0;
let g_arm1Angle = 90;
let g_joint1Angle = 0;

const keydown: KeyDown = (
  ev,
  gl,
  n,
  viewProjMatrix,
  u_MvpMatrix,
  u_NormalMatrix
) => {
  switch (ev.key) {
    case "ArrowUp":
      if (g_joint1Angle < 135) {
        g_joint1Angle += ANGLE_STEP;
      }
      break;
    case "ArrowDown":
      if (g_joint1Angle > -135) {
        g_joint1Angle -= ANGLE_STEP;
      }
      break;
    case "ArrowRight":
      g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
      break;
    case "ArrowLeft":
      g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
      break;
    default:
      return;
  }
  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
};

let g_modelMatrix = new Matrix4(),
  g_mvpMatrix = new Matrix4();

const draw: Draw = (gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Arm1
  let arm1Length = 10.0;
  g_modelMatrix.setTranslate(0, -12, 0);
  g_modelMatrix.rotate(g_arm1Angle, 0, 1, 0);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

  // Arm2
  g_modelMatrix.translate(0, arm1Length, 0);
  g_modelMatrix.rotate(g_joint1Angle, 0, 0, 1);
  g_modelMatrix.scale(1.3, 1, 1.3);
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
};

const g_normalMatrix = new Matrix4();
const drawBox: DrawBox = (
  gl,
  n,
  viewProjMatrix,
  u_MvpMatrix,
  u_NormalMatrix
) => {
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
};

type DrawBox = (
  gl: WebGLRenderingContext,
  n: number,
  modelMatrix: Matrix4,
  u_ModelMatrix: WebGLUniformLocation | null,
  u_NormalMatrix: WebGLUniformLocation | null
) => void;
type Draw = (
  gl: WebGLRenderingContext,
  n: number,
  modelMatrix: Matrix4,
  u_ModelMatrix: WebGLUniformLocation | null,
  u_NormalMatrix: WebGLUniformLocation | null
) => void;

type KeyDown = (
  ev: KeyboardEvent,
  gl: WebGLRenderingContext,
  n: number,
  modelMatrix: Matrix4,
  u_ModelMatrix: WebGLUniformLocation | null,
  u_NormalMatrix: WebGLUniformLocation | null
) => void;

type InitBuffer = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  size: number,
  type: number,
  data: Float32Array,
  attribName: string
) => void;
const initBuffer: InitBuffer = (gl, program, size, type, data, attribName) => {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error(`buffer is not created`);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, attribName);
  if (attribute < 0) {
    throw new Error(`can't find the attribute - ${attribName}`);
  }
  gl.vertexAttribPointer(attribute, size, type, false, 0, 0);
  gl.enableVertexAttribArray(attribute);
};
