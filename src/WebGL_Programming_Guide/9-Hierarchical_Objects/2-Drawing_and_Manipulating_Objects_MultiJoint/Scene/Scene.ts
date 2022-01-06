import { Matrix4 } from "../../matrix4";
import { Mesh } from "../Mesh/Mesh";

interface MatrixInfos {
  [key: string]: MatrixInfo;
}
interface MatrixInfo {
  matrix: Matrix4;
  matrixLocation: WebGLUniformLocation;
}

class Scene {
  public children: Mesh[];
  public modelMatrix: Matrix4;
  constructor() {
    this.children = [];
    this.modelMatrix = new Matrix4();
  }
  draw(gl: WebGLRenderingContext, { model, normal }: MatrixInfos) {
    this.children.forEach((mesh, index) => {
      const { scale, position, rotation } = mesh;
      {
        const { x, y, z } = scale;
        if (index === 0) {
          model.matrix.setScale(x, y, z);
        } else {
          model.matrix.scale(x, y, z);
        }
      }
      {
        const {
          angle,
          direction: { x, y, z },
        } = rotation;
        model.matrix.rotate(angle, x, y, z);
      }
      {
        const { x, y, z } = position;
        model.matrix.translate(x, y, z);
      }
      normal.matrix.setInverseOf(model.matrix);
      normal.matrix.transpose();
      gl.uniformMatrix4fv(normal.matrixLocation, false, normal.matrix.elements);
      gl.uniformMatrix4fv(model.matrixLocation, false, model.matrix.elements);
      gl.drawElements(gl.TRIANGLES, mesh.count, gl.FLOAT, 0);
    });
  }
}
export { Scene };
