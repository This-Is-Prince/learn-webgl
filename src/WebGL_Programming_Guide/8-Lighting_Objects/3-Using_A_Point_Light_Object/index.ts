import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { initializeApp, updateCanvasResolution } from "./initializeApp";
import { vertices, colors, indices, normals } from "./vertexData";
import { initArrayBuffer } from "./initializeBuffer";
import { initMatrices } from "./initializeMatrix";
import { Vector3 } from "../matrix4";

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
  const {
    "0": { matrix: normalMatrix, uniformMatrix: u_NormalMatrix },
    "1": { matrix: modelMatrix, uniformMatrix: u_ModelMatrix },
  } = initMatrices(gl, program, [
    "u_NormalMatrix",
    "u_ModelMatrix",
    "u_ProjectionMatrix",
    "u_ViewMatrix",
  ]);

  /**
   * Light
   */
  const u_AmbientLightColor = gl.getUniformLocation(
    program,
    "u_AmbientLightColor"
  );
  gl.uniform3f(u_AmbientLightColor, 0.2, 0.2, 0.2);
  const u_PointLightColor = gl.getUniformLocation(program, "u_PointLightColor");
  gl.uniform3f(u_PointLightColor, 1.0, 1.0, 1.0);
  const u_PointLightVector = gl.getUniformLocation(
    program,
    "u_PointLightVector"
  );
  const dir = new Vector3(0.0, 3.0, 4.0);
  dir.normalize();
  gl.uniform3f(u_PointLightVector, dir.x, dir.y, dir.z);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements());

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  let angle = 0;
  let prevTime = Date.now();

  const tick = () => {
    // const currTime = Date.now();
    // const diff = currTime - prevTime;
    // prevTime = currTime;
    // angle += 36 * diff * 0.001;
    // modelMatrix.setRotate(angle, "Y");
    // modelMatrix.rotate(angle, "X");
    // angle %= 360;

    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements());

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    requestAnimationFrame(tick);
  };
  tick();
};
