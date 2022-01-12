import { MeshData, WebGL2Context } from "../lib";
import { AttributesLocation } from "../utils/Constants";

class GridAxis {
  static createMesh(gl: WebGL2Context) {
    const vertices: number[] = [];
    const size = 1.8;
    const division = 10;
    const step = size / division;
    const half = size / 2;

    let pos = 0;
    for (let i = 0; i <= division; i++) {
      // Vertically
      pos = -half + i * step;
      vertices.push(pos);
      vertices.push(half);
      vertices.push(0);
      vertices.push(1);

      vertices.push(pos);
      vertices.push(-half);
      vertices.push(0);
      vertices.push(1);

      // Horizontally
      pos = half - i * step;
      vertices.push(-half);
      vertices.push(pos);
      vertices.push(0);
      vertices.push(2);

      vertices.push(half);
      vertices.push(pos);
      vertices.push(0);
      vertices.push(2);
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
    gl.enableVertexAttribArray(AttributesLocation.Position);
    gl.enableVertexAttribArray(attrColorLoc);

    gl.vertexAttribPointer(
      AttributesLocation.Position,
      3,
      gl.FLOAT,
      false,
      strideLen,
      0
    );
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
