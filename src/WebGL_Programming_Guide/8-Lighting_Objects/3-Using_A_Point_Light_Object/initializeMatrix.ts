import { Matrix4 } from "../matrix4";

interface MatrixData {
  uniformMatrix: WebGLUniformLocation;
  matrix: Matrix4;
}

type InitMatrix = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string
) => MatrixData;

const initMatrix: InitMatrix = (gl, program, name) => {
  const uniformMatrix = gl.getUniformLocation(
    program,
    name
  ) as WebGLUniformLocation;
  if (!uniformMatrix) {
    throw new Error(`can't get ${name} location`);
  }
  const matrix = new Matrix4();
  gl.uniformMatrix4fv(uniformMatrix, false, matrix.elements());
  return { uniformMatrix, matrix };
};
type InitMatrices = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  names: string[]
) => MatrixData[];
const initMatrices: InitMatrices = (gl, program, names) => {
  return names.map((name) => {
    return initMatrix(gl, program, name);
  });
};

export { initMatrices };
