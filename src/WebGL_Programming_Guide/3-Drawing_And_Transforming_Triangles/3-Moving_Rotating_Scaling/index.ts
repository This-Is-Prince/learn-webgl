import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";
import * as dat from "dat.gui";

/**
 * GUI
 */
const gui = new dat.GUI();

window.addEventListener("load", () => {
  transformTriangle();
});

const updateCanvasResolution = (
  canvas: HTMLCanvasElement,
  pixelRatio: number
) => {
  const { clientWidth, clientHeight } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

const degreeToRadian = (degree: number) => {
  return Math.PI * (degree / 180);
};

type TranslatedTriangle = (
  gl: WebGLRenderingContext,
  u_Translation: WebGLUniformLocation | null,
  translation: { x: number; y: number; z: number }
) => void;

const translatedTriangle: TranslatedTriangle = (
  gl,
  u_Translation,
  { x, y, z }
) => {
  gl.uniform4f(u_Translation, x, y, z, 0.0);
};

type RotatedTriangle = (
  gl: WebGLRenderingContext,
  u_Angle_In_Radian: WebGLUniformLocation | null,
  angle: number
) => void;
const rotatedTriangle: RotatedTriangle = (gl, u_Angle_In_Radian, angle) => {
  gl.uniform1f(u_Angle_In_Radian, angle);
};

const transformTriangle = () => {
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
   * a_Position Location
   */
  const a_Position = gl.getAttribLocation(program, "a_Position");
  const vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  /**
   * u_Translation Location
   */
  const u_Translation = gl.getUniformLocation(program, "u_Translation");
  const u_Angle_In_Radian = gl.getUniformLocation(program, "u_Angle_In_Radian");

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Translated Triangle
  // translatedTriangle(gl, u_Translation, { x: 0.5, y: 0.5, z: 0 });

  // Rotated Triangle
  const rotation = {
    angle: 90,
  };
  rotatedTriangle(gl, u_Angle_In_Radian, degreeToRadian(rotation.angle));
  gui
    .add(rotation, "angle")
    .min(0)
    .max(360)
    .step(1)
    .onChange(() => {
      rotatedTriangle(gl, u_Angle_In_Radian, degreeToRadian(rotation.angle));
    });

  // gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
  webGL = gl;
  length = vertices.length;
  tick();
};
let webGL: WebGLRenderingContext;
let length: number;

const tick = () => {
  if (webGL) {
    webGL.clear(webGL.COLOR_BUFFER_BIT);
    webGL.drawArrays(webGL.TRIANGLES, 0, length);
  }
  requestAnimationFrame(tick);
};
