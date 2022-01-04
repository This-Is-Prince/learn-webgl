import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";
import {
  colors,
  indices,
  normals,
  vertices,
} from "../../8-Lighting_Objects/3-Using_A_Point_Light_Object/vertexData";
import { Matrix4, Vector3 } from "../matrix4";

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
  window.addEventListener("resize", () => {
    updateCanvasResolution(gl);
    projectionMatrix.setPerspective(
      30,
      gl.canvas.width / gl.canvas.height,
      0.1,
      100
    );
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);
  });

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
  // a_Color
  initBuffer(gl, program, 3, gl.FLOAT, colors, "a_Color");
  // a_Normal
  initBuffer(gl, program, 3, gl.FLOAT, normals, "a_Normal");

  /**
   * Normal Matrix
   */
  const u_NormalMatrix = gl.getUniformLocation(program, "u_NormalMatrix");
  const normalMatrix = new Matrix4();

  /**
   * Projection Matrix
   */
  const u_ProjectionMatrix = gl.getUniformLocation(
    program,
    "u_ProjectionMatrix"
  );
  const projectionMatrix = new Matrix4();
  projectionMatrix.setPerspective(
    30,
    gl.canvas.width / gl.canvas.height,
    0.1,
    100
  );

  /**
   * Model Matrix
   */
  const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
  const modelMatrix = new Matrix4();
  modelMatrix.translate(0, 0, 0);

  /**
   * View Matrix
   */
  const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  const viewMatrix = new Matrix4();
  viewMatrix.setLookAt(
    new Vector3(0, 0, 10),
    new Vector3(0, 0, 0),
    new Vector3(0, 1, 0)
  );

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  /**
   * Light
   */
  //   u_AmbientLightColor
  const u_AmbientLightColor = gl.getUniformLocation(
    program,
    "u_AmbientLightColor"
  );
  gl.uniform3f(u_AmbientLightColor, 0.2, 0.2, 0.2);

  //   u_PointLightColor
  const u_PointLightColor = gl.getUniformLocation(program, "u_PointLightColor");
  gl.uniform3f(u_PointLightColor, 1.0, 1.0, 1.0);

  //   u_PointLightPosition
  const u_PointLightPosition = gl.getUniformLocation(
    program,
    "u_PointLightPosition"
  );
  const pointLightPosition = new Vector3(0.0, 0.0, 7.0);
  pointLightPosition.normalize();
  gl.uniform3f(
    u_PointLightPosition,
    pointLightPosition.x,
    pointLightPosition.y,
    pointLightPosition.z
  );

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  const tick = () => {
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
