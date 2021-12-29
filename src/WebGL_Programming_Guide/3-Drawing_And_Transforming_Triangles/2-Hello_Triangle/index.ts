import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";

window.addEventListener("load", () => {
  helloTriangle();
});

const updateCanvasSize = (canvas: HTMLCanvasElement, pixelRatio: number) => {
  const { clientWidth, clientHeight } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

const helloTriangle = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  updateCanvasSize(canvas, Math.min(window.devicePixelRatio, 2));

  /**
   * WebGLRendering Context
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

  /**
   * Vertices
   */
  // for gl.TRIANGLES
  //   const vertices = new Float32Array([
  //     // left triangle
  //     -0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  //     // right triangle
  //     0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
  //   ]);

  // for gl.TRIANGLES_STRIP
  //   const vertices = new Float32Array([
  //     -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
  //   ]);
  const vertices = new Float32Array([
    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
  ]);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.useProgram(program);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Using gl.TRIANGLES
  //   gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);
  // Using gl.TRIANGLES_STRIP
  //   gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length/2);
  // Using gl.TRIANGLES_FAN
  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
};
