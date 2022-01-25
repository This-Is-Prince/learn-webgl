import { WebGL2Context } from "../lib";
import { Modal } from "../Modal/Modal";
import { POSITION_LOCATION } from "../utils/Constants";
import { Mesh } from "./Mesh";

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
    const COLOR_LOCATION = 4;
    const mesh = new Mesh(gl.LINES, gl.createVertexArray()!);
    if (!mesh.vao) {
      console.error(`unable to create vao for grid`);
    }
    gl.bindVertexArray(mesh.vao);

    const totalComponent = 4;
    const count = vertices.length / totalComponent;
    const stride = Float32Array.BYTES_PER_ELEMENT * totalComponent;

    const buffer = gl.createBuffer()!;
    if (!buffer) {
      console.error(`unable to create buffer for grid`);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(POSITION_LOCATION);
    gl.vertexAttribPointer(POSITION_LOCATION, 3, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(COLOR_LOCATION);
    gl.vertexAttribPointer(
      COLOR_LOCATION,
      1,
      gl.FLOAT,
      false,
      stride,
      Float32Array.BYTES_PER_ELEMENT * 3
    );
    mesh.setVertices(buffer, count, totalComponent);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.meshes["grid"] = mesh;

    return mesh;
  }
}
export { GridAxis };
