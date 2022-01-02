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
  const vertices = new Float32Array([
    // First Vertex
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    // Second Vertex
    -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
    // Third Vertex
    -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,
    // Fourth Vertex
    1.0, -1.0, 1.0, 1.0, 1.0, 0.0,
    // Fifth Vertex
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0,
    // Six Vertex
    1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
    // Seventh Vertex
    -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,
    // Eight Vertex
    -1.0, -1.0, -1.0, 0.0, 0.0, 0.0,
  ]);

  const indices = new Uint8Array([
    // Front
    0, 1, 2, 0, 2, 3,
    // Right
    0, 3, 4, 0, 4, 5,
    // Up
    0, 5, 6, 0, 6, 1,
    // Left
    1, 6, 7, 1, 7, 2,
    // Down
    7, 4, 3, 7, 3, 2,
    // Back
    4, 7, 6, 4, 6, 5,
  ]);

  /**
   * Buffer
   */
  const verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  /**
   * a_Position
   */
  const a_Position = gl.getAttribLocation(program, "a_Position");

  /**
   * a_Color
   */
  const a_Color = gl.getAttribLocation(program, "a_Color");

  /**
   * u_ModelMatrix
   */
  const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
  const modelMatrix = new Matrix4();
  modelMatrix.translate(0, 0, -5);

  canvas.addEventListener("mousemove", function (ev) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let { x, y } = ev;
    const { clientHeight, clientWidth } = this;
    x = (x / clientWidth) * 2 - 1;
    y = (y / clientHeight) * 2 - 1;
    x *= 360;
    y *= 360;
    modelMatrix.setRotate(x, "Y");
    modelMatrix.rotate(y, "X");
    modelMatrix.translate(0, 0, -5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements());
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
  });

  /**
   * u_ViewMatrix
   */
  const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  const viewMatrix = new Matrix4();
  const eye: Point3 = { x: 0, y: 0, z: 5 },
    at: Point3 = { x: 0, y: 0, z: -100 },
    up: Point3 = { x: 0, y: 1, z: 0 };
  viewMatrix.setLookAt(eye, at, up);

  /**
   * u_ProjectionMatrix
   */
  const u_ProjectionMatrix = gl.getUniformLocation(
    program,
    "u_ProjectionMatrix"
  );
  const projectionMatrix = new Matrix4();
  projectionMatrix.setPerspectiveProjection(
    30,
    gl.canvas.width / gl.canvas.height,
    1.0,
    100
  );

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset(1.0, 1.0);
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
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements());

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
};
