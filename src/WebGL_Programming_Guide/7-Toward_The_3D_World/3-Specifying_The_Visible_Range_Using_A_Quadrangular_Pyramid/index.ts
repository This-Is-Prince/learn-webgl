import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";
import { Matrix4, Point3 } from "../matrix4";

window.addEventListener("load", () => {
  lookAtTriangles();
});

const updateCanvasResolution = (
  canvas: HTMLCanvasElement,
  pixelRatio: number
) => {
  const { clientHeight, clientWidth } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

const lookAtTriangles = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`canvas is not retrieve`);
  }
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
   * Vertices
   */
  const vertices = new Float32Array([
    // The Back Green Triangle
    // First vertex
    0.0, 0.6, -0.4, 0.4, 1.0, 0.4,
    // Second vertex
    -0.5, -0.4, -0.4, 0.4, 1.0, 0.4,
    // Third vertex
    0.5, -0.4, -0.4, 1.0, 0.4, 0.4,

    // The Middle Yellow Triangle
    // First vertex
    0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
    // Second vertex
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    // Third vertex
    0, -0.6, -0.2, 1.0, 1.0, 0.4,

    // The Front blue Triangle
    // First vertex
    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
    // Second vertex
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    // Third vertex
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ]);

  /**
   * Buffer
   */
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  /**
   * a_Position
   */
  const a_Position = gl.getAttribLocation(program, "a_Position");

  /**
   * a_Color
   */
  const a_Color = gl.getAttribLocation(program, "a_Color");

  /**
   * u_ProjectionMatrix
   */
  const u_ProjectionMatrix = gl.getUniformLocation(
    program,
    "u_ProjectionMatrix"
  );
  const projectionMatrix = new Matrix4();
  projectionMatrix.setOrthographicProjection(-1, 1, -1, 1, 0.0, 2.0);

  /**
   * u_ViewMatrix
   */
  const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  const viewMatrix = new Matrix4();
  const eye: Point3 = { x: 0, y: 0, z: 0 },
    at: Point3 = { x: 0, y: 0, z: -1 },
    up: Point3 = { x: 0, y: 1, z: 0 };
  viewMatrix.setLookAt(eye, at, up);

  document.addEventListener("keydown", function (ev) {
    switch (ev.key) {
      case "ArrowRight":
        break;
      case "ArrowLeft":
        break;
      case "ArrowUp":
        break;
      case "ArrowDown":
        break;
      default:
        return;
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements());
    gl.drawArrays(gl.TRIANGLES, 0, 9);
  });

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);

  const FSIZE = vertices.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements());
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements());
  gl.drawArrays(gl.TRIANGLES, 0, 9);
};
