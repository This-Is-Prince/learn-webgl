import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "./utils/webgl-utils";
import { Mat4, m4 } from "./utils/m4";
import { BoxGeometry } from "./geometry/BoxGeometry";
import { MeshBasicMaterial } from "./material/MeshBasicMaterial";

/**
 * Canvas
 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const updateCanvasSize = (canvas: HTMLCanvasElement) => {
  const { clientHeight, clientWidth } = canvas;
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};
updateCanvasSize(canvas);

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
 * Attributes Location
 */
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

/**
 * Attributes Buffer
 */
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const geometry = new BoxGeometry(1, 1, 1);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(geometry.attributes.position),
  gl.STATIC_DRAW
);
let length = geometry.attributes.position.length;
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
const material = new MeshBasicMaterial();
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Uint8Array(material.attributes.color),
  gl.STATIC_DRAW
);

/**
 * Uniform Location
 */
const modelMatrixUniformLocation = gl.getUniformLocation(
  program,
  "modelMatrix"
);
const viewMatrixUniformLocation = gl.getUniformLocation(program, "viewMatrix");
const projectionMatrixUniformLocation = gl.getUniformLocation(
  program,
  "projectionMatrix"
);

const drawScene = () => {
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(
    colorAttributeLocation,
    3,
    gl.UNSIGNED_BYTE,
    true,
    0,
    0
  );

  let width = canvas.width / 2;
  let height = canvas.height / 2;
  let projectionMatrix = m4.orthographicProjection(
    -width,
    width,
    height,
    -height,
    400,
    -400
  );
  let modelMatrix = m4.translate(m4.identity(), 0, 0, 0);
  modelMatrix = m4.xRotate(modelMatrix, 180);
  modelMatrix = m4.yRotate(modelMatrix, 45);
  modelMatrix = m4.zRotate(modelMatrix, 45);
  let viewMatrix: Mat4 = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  gl.uniformMatrix4fv(
    modelMatrixUniformLocation,
    false,
    m4.mat4x4To1x16(modelMatrix)
  );
  gl.uniformMatrix4fv(
    viewMatrixUniformLocation,
    false,
    m4.mat4x4To1x16(viewMatrix)
  );
  gl.uniformMatrix4fv(
    projectionMatrixUniformLocation,
    false,
    m4.mat4x4To1x16(projectionMatrix)
  );

  gl.drawArrays(gl.TRIANGLES, 0, length);
};
drawScene();
