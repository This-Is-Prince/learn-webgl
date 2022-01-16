import { MeshData, WebGL2Context } from "../lib";
import { attributes } from "./Constants";

class GL {
  private constructor() {}
  static getGLInstance(canvasID: string) {
    /**
     * Canvas
     */
    let canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = canvasID;
      document.body.appendChild(canvas);
    }
    /**
     * GL
     */
    const gl = canvas.getContext("webgl2") as WebGL2Context;

    // Custom Properties
    gl.meshesData = {};

    // Setting clear color
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    /**
     * Methods
     */
    /**
     * Clear the screen with specified color
     * @returns WebGL2Context
     */
    gl.fClearScreen = function () {
      this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
      return this;
    };

    gl.fCreateArrayBuffer = function (srcData, isStatic = true) {
      const buffer = this.createBuffer() as WebGLBuffer;
      if (!buffer) {
        console.error(`Error unable to create buffer `);
      }
      this.bindBuffer(this.ARRAY_BUFFER, buffer);
      this.bufferData(
        this.ARRAY_BUFFER,
        srcData,
        isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW
      );
      this.bindBuffer(this.ARRAY_BUFFER, null);
      return buffer;
    };

    gl.fCreateMeshVAO = function (name, indices, vertices, normals, uv) {
      const mesh: MeshData = {
        drawMode: this.TRIANGLES,
        vao: this.createVertexArray() as WebGLVertexArrayObject,
      };
      if (!mesh.vao) {
        console.error(`vao is not created`);
      }
      this.bindVertexArray(mesh.vao);

      const {
        normal: { location: norLoc },
        position: { location: posLoc },
        uv: { location: uvLoc },
      } = attributes;

      if (vertices !== undefined && vertices !== null) {
        mesh.verticesBuffer = this.createBuffer() as WebGLBuffer;
        if (!mesh.verticesBuffer) {
          console.error(`verticesBuffer is not created`);
        }
        mesh.vertexComponentLen = 3;
        mesh.vertexCount = vertices.length / mesh.vertexComponentLen;

        this.bindBuffer(this.ARRAY_BUFFER, mesh.verticesBuffer);
        this.bufferData(
          this.ARRAY_BUFFER,
          new Float32Array(vertices),
          this.STATIC_DRAW
        );
        this.enableVertexAttribArray(posLoc);
        this.vertexAttribPointer(posLoc, 3, this.FLOAT, false, 0, 0);
      }

      if (normals !== undefined && normals !== null) {
        mesh.normalsBuffer = this.createBuffer() as WebGLBuffer;
        if (!mesh.normalsBuffer) {
          console.error(`normalsBuffer is not created`);
        }
        this.bindBuffer(this.ARRAY_BUFFER, mesh.normalsBuffer);
        this.bufferData(
          this.ARRAY_BUFFER,
          new Float32Array(normals),
          this.STATIC_DRAW
        );
        this.enableVertexAttribArray(norLoc);
        this.vertexAttribPointer(norLoc, 3, gl.FLOAT, false, 0, 0);
      }

      if (uv !== undefined && uv !== null) {
        mesh.uvBuffer = this.createBuffer() as WebGLBuffer;
        if (!mesh.uvBuffer) {
          console.error(`uvBuffer is not created`);
        }
        this.bindBuffer(this.ARRAY_BUFFER, mesh.uvBuffer);
        this.bufferData(
          this.ARRAY_BUFFER,
          new Float32Array(uv),
          gl.STATIC_DRAW
        );
        this.enableVertexAttribArray(uvLoc);
        this.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
      }

      if (indices !== undefined && indices !== null) {
        mesh.indicesBuffer = this.createBuffer() as WebGLBuffer;
        if (!mesh.indicesBuffer) {
          console.error(`indicesBuffer is not created`);
        }
        mesh.indexCount = indices.length;
        this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, mesh.indicesBuffer);
        this.bufferData(
          this.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
        this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
      }

      this.bindVertexArray(null);
      this.bindBuffer(this.ARRAY_BUFFER, null);

      this.meshesData[name] = mesh;
      return mesh;
    };

    /**
     * Setters / Getters
     */
    /**
     * Setting size of canvas width, height
     * @param w number width of canvas
     * @param h number height of canvas
     * @returns WebGl2Context
     */
    gl.fSetSize = function (w, h) {
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";
      this.canvas.width = w;
      this.canvas.height = h;

      this.viewport(0, 0, w, h);
      return this;
    };
    return gl;
  }
}

export { GL };
