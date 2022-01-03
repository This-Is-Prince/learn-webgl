import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";
import { Matrix4, Point3, Vector3 } from "../matrix4";

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

  const colors = new Float32Array([
    // v0-v1-v2-v3 front
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    // v0-v3-v4-v5 right
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    // v0-v5-v6-v1 up
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    // v1-v6-v7-v2 left
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    // v7-v4-v3-v2 down
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    // v4-v7-v6-v5 back
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
  ]);
  const vertices = new Float32Array([
    // v0-v1-v2-v3 front
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
    // v0-v3-v4-v5 right
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
    // v0-v5-v6-v1 up
    1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
    // v1-v6-v7-v2 left
    -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
    // v7-v4-v3-v2 down
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
    // v4-v7-v6-v5 back
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
  ]);

  const normals = new Float32Array([
    // Normal
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

  /**
   * a_Position
   */
  const positionBuffer = gl.createBuffer();
  const a_Position = gl.getAttribLocation(program, "a_Position");
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  /**
   * a_Color
   */
  const colorBuffer = gl.createBuffer();
  const a_Color = gl.getAttribLocation(program, "a_Color");
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  /**
   * a_Normal
   */
  const normalBuffer = gl.createBuffer();
  const a_Normal = gl.getAttribLocation(program, "a_Normal");
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

  //   canvas.addEventListener("mousemove", function (ev) {
  //     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //     let { x, y } = ev;
  //     const { clientHeight, clientWidth } = this;
  //     x = (x / clientWidth) * 2 - 1;
  //     y = (y / clientHeight) * 2 - 1;
  //     x *= 360;
  //     y *= 360;
  //     modelMatrix.setRotate(x, "Y");
  //     modelMatrix.rotate(y, "X");
  //     modelMatrix.translate(0, 0, -5);
  //     gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements());
  //     gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
  //   });

  /**
   * Light
   */
  const u_LightColor = gl.getUniformLocation(program, "u_LightColor");
  const u_LightDirection = gl.getUniformLocation(program, "u_LightDirection");
  const dir = new Vector3(0.5, 3.0, 4.0);
  dir.normalize();

  /**
   * u_ViewMatrix
   */
  const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  const viewMatrix = new Matrix4();
  const eye: Point3 = { x: 3, y: 3, z: 7 },
    at: Point3 = { x: 0, y: 0, z: 0 },
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
    canvas.width / canvas.height,
    0.1,
    100
  );

  /**
   * u_MVPMatrix
   */
  const u_MVPMatrix = gl.getUniformLocation(program, "u_MVPMatrix");
  const mvpMatrix = new Matrix4();
  mvpMatrix.setPerspectiveProjection(
    30,
    canvas.width / canvas.height,
    0.1,
    100
  );
  mvpMatrix.lookAt(eye, at, up);

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Normal);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements());
  gl.uniformMatrix4fv(u_MVPMatrix, false, mvpMatrix.elements());
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements());

  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  gl.uniform3fv(u_LightDirection, [dir.x, dir.y, dir.z]);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
};
