import { Matrix4 } from "../../matrix4";

type DrawBox = (
  gl: WebGLRenderingContext,
  n: number,
  modelMatrix: Matrix4,
  u_ModelMatrix: WebGLUniformLocation | null,
  normalMatrix: Matrix4,
  u_NormalMatrix: WebGLUniformLocation | null
) => void;

const drawBox: DrawBox = (
  gl,
  n,
  modelMatrix,
  u_ModelMatrix,
  normalMatrix,
  u_NormalMatrix
) => {
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
};

export { drawBox };
