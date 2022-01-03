import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";
import { Matrix4, Point3, Vector3 } from "../matrix4";

window.addEventListener("load", () => {
  lightedTranslatedRotatedCube();
});

const lightedTranslatedRotatedCube = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error("canvas element is not retrieve... ");
  }
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const { clientHeight, clientWidth } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;

  /**
   * WebGL Rendering Context
   */
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  if (!gl) {
    throw new Error(`webgl is not supported`);
  }

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

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
   * Vertices,Colors,Normals,Indices
   */
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
   * Buffers
   */
  gl.useProgram(program);
  initBuffer(gl, program, 3, vertices, "a_Position");
  initBuffer(gl, program, 3, colors, "a_Color");
  initBuffer(gl, program, 3, normals, "a_Normal");

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
    0.1,
    100
  );

  /**
   * u_ViewMatrix
   */
  const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  const viewMatrix = new Matrix4();
  viewMatrix.lookAt(
    { x: 3, y: 3, z: 7 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }
  );

  /**
   * u_ModelMatrix
   */
  const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
  const modelMatrix = new Matrix4();
  //   modelMatrix.setTranslate(0, 0.9, 0);
  //   modelMatrix.rotate(90, "Z");

  canvas.addEventListener("mousemove", function (ev) {
    let { x, y } = ev;
    const { clientHeight, clientWidth } = this;
    // x = (x / clientWidth) * 2 - 1;
    // y = (y / clientHeight) * 2 - 1;
    x /= clientWidth;
    y /= clientHeight;
    x *= 360;
    y *= 360;
    modelMatrix.setRotate(x, "Y");
    modelMatrix.rotate(y, "X");
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements());
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements());
  });

  /**
   * u_NormalMatrix
   */
  const u_NormalMatrix = gl.getUniformLocation(program, "u_NormalMatrix");
  const normalMatrix = new Matrix4();
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  /**
   * Lights
   */
  const u_AmbientLightColor = gl.getUniformLocation(
    program,
    "u_AmbientLightColor"
  );
  const u_DirectionalLightColor = gl.getUniformLocation(
    program,
    "u_DirectionalLightColor"
  );
  const u_DirectionalLightDirection = gl.getUniformLocation(
    program,
    "u_DirectionalLightDirection"
  );
  const dir = new Vector3(0.5, 3.0, 4.0);
  dir.normalize();

  gl.uniform3f(u_DirectionalLightColor, 1.0, 1.0, 1.0);
  gl.uniform3f(u_AmbientLightColor, 0.2, 0.2, 0.2);
  gl.uniform3fv(u_DirectionalLightDirection, [dir.x, dir.y, dir.z]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements());
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements());
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements());
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements());

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  let angle = 0;
  let prevTime = Date.now();
  const tick = () => {
    const currTime = Date.now();
    const diff = currTime - prevTime;
    prevTime = currTime;
    angle += 36 * diff * 0.001;
    modelMatrix.setRotate(angle, "X");
    angle %= 360;

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements());

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    requestAnimationFrame(tick);
  };
  tick();
};
type InitBuffer = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  size: number,
  data: Float32Array,
  attribName: string
) => void;

const initBuffer: InitBuffer = (gl, program, size, data, attribName) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const attribute = gl.getAttribLocation(program, attribName);
  if (attribute < 0) {
    throw new Error(`can't find attribute with name = ${attribName}`);
  }
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribute);
};
