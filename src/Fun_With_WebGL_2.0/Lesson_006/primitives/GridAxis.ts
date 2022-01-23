import { MeshData, WebGL2Context } from "../lib";
import { Modal } from "../Modal/Modal";
import { attributes } from "../utils/Constants";

class GridAxis {
  static createModal(gl: WebGL2Context, incAxis: boolean) {
    return new Modal(GridAxis.createMesh(gl, incAxis));
  }
  static createMesh(gl: WebGL2Context, incAxis: boolean) {
    const vertices: number[] = [];

    const size = 2;
    const div = 10.0;
    const step = size / div;
    const half = size / 2;

    let p = 0;
    for (let i = 0; i <= div; i++) {
      // vertical line
      p = -half + i * step;
      vertices.push(p);
      vertices.push(half);
      vertices.push(0);
      vertices.push(0);

      vertices.push(p);
      vertices.push(-half);
      vertices.push(0);
      vertices.push(1);

      // horizontal line
      p = half - i * step;
      vertices.push(-half);
      vertices.push(p);
      vertices.push(0);
      vertices.push(0);

      vertices.push(half);
      vertices.push(p);
      vertices.push(0);
      vertices.push(1);
    }

    if (incAxis) {
      //x axis
      vertices.push(-1.1); //x1
      vertices.push(0); //y1
      vertices.push(0); //z1
      vertices.push(1); //c2

      vertices.push(1.1); //x2
      vertices.push(0); //y2
      vertices.push(0); //z2
      vertices.push(1); //c2

      //y axis
      vertices.push(0); //x1
      vertices.push(-1.1); //y1
      vertices.push(0); //z1
      vertices.push(2); //c2

      vertices.push(0); //x2
      vertices.push(1.1); //y2
      vertices.push(0); //z2
      vertices.push(2); //c2

      //z axis
      vertices.push(0); //x1
      vertices.push(0); //y1
      vertices.push(-1.1); //z1
      vertices.push(3); //c2

      vertices.push(0); //x2
      vertices.push(0); //y2
      vertices.push(1.1); //z2
      vertices.push(3); //c2
    }

    const attrColorLoc = 4;
    const mesh: MeshData = {
      drawMode: gl.LINES,
      vao: gl.createVertexArray() as WebGLVertexArrayObject,
    };
    mesh.vertexComponentLen = 4;
    mesh.vertexCount = vertices.length / mesh.vertexComponentLen;
    const strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen;

    mesh.verticesBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindVertexArray(mesh.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const {
      position: { location: posLoc },
    } = attributes;
    gl.enableVertexAttribArray(posLoc);
    gl.enableVertexAttribArray(attrColorLoc);

    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, strideLen, 0);
    gl.vertexAttribPointer(
      attrColorLoc,
      1,
      gl.FLOAT,
      false,
      strideLen,
      Float32Array.BYTES_PER_ELEMENT * 3
    );

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.meshesData["grid"] = mesh;
    return mesh;
  }
}
export { GridAxis };
