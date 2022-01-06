import { Matrix4 } from "../../matrix4";
import { drawBox } from "./drawBox";

type Draw = (
  gl: WebGLRenderingContext,
  n: number,
  g_arm1Angle: number,
  g_joint1Angle: number,
  modelMatrix: Matrix4,
  u_ModelMatrix: WebGLUniformLocation | null,
  normalMatrix: Matrix4,
  u_NormalMatrix: WebGLUniformLocation | null
) => void;

const draw: Draw = (
  gl,
  n,
  g_arm1Angle,
  g_joint1Angle,
  modelMatrix,
  u_ModelMatrix,
  normalMatrix,
  u_NormalMatrix
) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Arm1
  let arm1Length = 10.0;
  modelMatrix.setTranslate(0, -12, 0);
  modelMatrix.rotate(g_arm1Angle, 0, 1, 0);
  drawBox(gl, n, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);

  // Arm2
  modelMatrix.translate(0, arm1Length, 0);
  modelMatrix.rotate(g_joint1Angle, 0, 0, 1);
  modelMatrix.scale(1.3, 1, 1.3);
  drawBox(gl, n, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);
};

export { draw };
