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
  switch (name) {
    case "u_NormalMatrix":
      break;
    case "u_ModelMatrix":
      matrix.setRotate(90, "Y");
      break;
    case "u_ProjectionMatrix":
      matrix.setPerspectiveProjection(
        30,
        gl.canvas.width / gl.canvas.height,
        0.1,
        100
      );
      break;
    case "u_ViewMatrix":
      matrix.setLookAt(
        { x: 3, y: 3, z: 7 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }
      );
      break;
  }
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
