import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { initializeApp, updateCanvasResolution } from "./initializeApp";
import { vertices, colors, indices, normals } from "./vertexData";
import { initArrayBuffer } from "./initializeBuffer";
import { initMatrices } from "./initializeMatrix";

window.addEventListener("load", () => {
  pointLightCube();
});

const pointLightCube = () => {
  /**
   * Initialize App
   */
  const { gl, program } = initializeApp(
    vertexShaderSource,
    fragmentShaderSource
  );

  /**
   * Resize Events
   */
  window.addEventListener("resize", () => {
    updateCanvasResolution(gl);
  });

  /**
   * Initialize Array Buffers
   */
  initArrayBuffer(gl, program, 3, vertices, gl.FLOAT, "a_Position");
  initArrayBuffer(gl, program, 3, colors, gl.FLOAT, "a_Color");
  initArrayBuffer(gl, program, 3, normals, gl.FLOAT, "a_Normal");

  /**
   * Initialize Matrices
   */
  // ModelMatrix
  const matrixData = initMatrices(gl, program, [
    "u_NormalMatrix",
    "u_ModelMatrix",
    "u_ProjectionMatrix",
    "u_ViewMatrix",
  ]);
};
