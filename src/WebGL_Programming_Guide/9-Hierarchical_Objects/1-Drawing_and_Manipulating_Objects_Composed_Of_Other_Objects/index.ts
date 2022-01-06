import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import {
  createProgram,
  createShader,
} from "../../9-Hierarchical_Objects/utils";
import { Matrix4, Vector3 } from "../../9-Hierarchical_Objects/matrix4";
import { initBuffer } from "./utils/initbuffer";
import { draw } from "./utils/draw";
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
   * u_NormalMatrix
   */
  const u_NormalMatrix = gl.getUniformLocation(program, "u_NormalMatrix");
  const normalMatrix = new Matrix4();

  /**
   * u_ProjectionMatrix
   */
  const u_ProjectionMatrix = gl.getUniformLocation(
    program,
    "u_ProjectionMatrix"
  );
  const perspectiveMatrix = new Matrix4();
  perspectiveMatrix.setPerspective(50, canvas.width / canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, perspectiveMatrix.elements);

  /**
   * u_ViewMatrix
   */
  const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  const viewMatrix = new Matrix4();
  viewMatrix.lookAt(
    new Vector3(20, 10, 30),
    new Vector3(0, 0, 0),
    new Vector3(0, 1, 0)
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  /**
   * Model Matrix
   */
  const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
  const modelMatrix = new Matrix4();

  window.addEventListener("keydown", function (ev) {
    keydown(
      ev,
      gl,
      indices.length,
      modelMatrix,
      u_ModelMatrix,
      normalMatrix,
      u_NormalMatrix
    );
  });

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  draw(
    gl,
    indices.length,
    g_arm1Angle,
    g_joint1Angle,
    modelMatrix,
    u_ModelMatrix,
    normalMatrix,
    u_NormalMatrix
  );
};

let ANGLE_STEP = 3.0;
let g_arm1Angle = 90;
let g_joint1Angle = 0;

const keydown: KeyDown = (
  ev,
  gl,
  n,
  modelMatrix,
  u_ModelMatrix,
  normalMatrix,
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
  draw(
    gl,
    n,
    g_arm1Angle,
    g_joint1Angle,
    modelMatrix,
    u_ModelMatrix,
    normalMatrix,
    u_NormalMatrix
  );
};

type KeyDown = (
  ev: KeyboardEvent,
  gl: WebGLRenderingContext,
  n: number,
  modelMatrix: Matrix4,
  u_ModelMatrix: WebGLUniformLocation | null,
  normalMatrix: Matrix4,
  u_NormalMatrix: WebGLUniformLocation | null
) => void;
