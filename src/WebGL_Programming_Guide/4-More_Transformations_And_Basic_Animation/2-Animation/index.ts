import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";
import { Matrix4 } from "../1-Translate_And_Then_Rotate/matrix4";

window.addEventListener("load", () => {
  animation();
});

const updateCanvasResolution = (
  canvas: HTMLCanvasElement,
  pixelRatio: number
) => {
  const { clientWidth, clientHeight } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

const animation = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));

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
   * a_Position Location
   */
  const a_Position = gl.getAttribLocation(program, "a_Position");
  const positionBuffer = gl.createBuffer();
  const vertices = [0, 0.5, -0.5, -0.5, 0.5, -0.5];
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  /**
   * u_ModelMatrix Location
   */
  const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");

  /**
   * Matrix
   */
  const modelMatrix = new Matrix4();

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.useProgram(program);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  const ANGLE_STEP = 45;
  let currAngle = 0;
  let prevTime = Date.now();
  const tick = () => {
    let currTime = Date.now();
    let elapsed = currTime - prevTime;
    prevTime = currTime;

    currAngle = (currAngle + (ANGLE_STEP * elapsed) / 1000) % 360;

    modelMatrix.setRotate(currAngle, "Z");

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements());
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
    // Next Frame
    window.requestAnimationFrame(tick);
  };
  tick();
};
