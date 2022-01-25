import { WebGL2Context } from "../lib";
import { Mesh } from "../primitives/Mesh";
import { NORMAL_LOCATION, POSITION_LOCATION, UV_LOCATION } from "./Constants";

class GL {
  private constructor() {}
  static getCanvas(canvasID: string): HTMLCanvasElement {
    let canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = canvasID;
      document.body.appendChild(canvas);
    }
    return canvas;
  }
  static getGLInstance(canvasID: string): WebGL2Context {
    // canvas
    const canvas = GL.getCanvas(canvasID);

    // context
    const gl = canvas.getContext("webgl2") as WebGL2Context;
    if (!gl) {
      console.error(`webgl2 is not supported`);
    }

    // Custom Properties
    gl.meshes = {};

    // Setting clear color
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Methods
    gl.fClearScreen = function () {
      this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
      return this;
    };

    gl.fCreateArrayBuffer = function (srcData, isStatic = true) {
      const buffer = this.createBuffer() as WebGLBuffer;
      if (!buffer) {
        console.error(`unable to create buffer.`);
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

    gl.fCreateMesh = function (name, indices, vertices, normals, uv) {
      const mesh = new Mesh(
        this.TRIANGLES,
        this.createVertexArray() as WebGLVertexArrayObject
      );
      if (!mesh.vao) {
        console.error(`unable to create vao for ${name}`);
      }

      if (vertices !== undefined && vertices !== null) {
        const buffer = this.createBuffer() as WebGLBuffer;
        const totalComponent = 3;
        const count = vertices.length / totalComponent;

        if (!buffer) {
          console.error(`vertices buffer is not created for ${name}`);
        }

        this.bindBuffer(this.ARRAY_BUFFER, buffer);
        this.bufferData(
          this.ARRAY_BUFFER,
          new Float32Array(vertices),
          this.STATIC_DRAW
        );
        this.enableVertexAttribArray(POSITION_LOCATION);
        this.vertexAttribPointer(
          POSITION_LOCATION,
          totalComponent,
          this.FLOAT,
          false,
          0,
          0
        );

        mesh.setVertices(buffer, count, totalComponent);
      }

      if (normals !== undefined && normals !== null) {
        const buffer = this.createBuffer() as WebGLBuffer;

        if (!buffer) {
          console.error(`normals buffer is not created for ${name}`);
        }
        this.bindBuffer(this.ARRAY_BUFFER, buffer);
        this.bufferData(
          this.ARRAY_BUFFER,
          new Float32Array(normals),
          this.STATIC_DRAW
        );
        this.enableVertexAttribArray(NORMAL_LOCATION);
        this.vertexAttribPointer(NORMAL_LOCATION, 3, this.FLOAT, false, 0, 0);

        mesh.setNormals(buffer);
      }

      if (uv !== undefined && uv !== null) {
        const buffer = this.createBuffer() as WebGLBuffer;
        if (!buffer) {
          console.error(`uv buffer is not created for ${name}`);
        }
        this.bindBuffer(this.ARRAY_BUFFER, buffer);
        this.bufferData(
          this.ARRAY_BUFFER,
          new Float32Array(uv),
          this.STATIC_DRAW
        );
        this.enableVertexAttribArray(UV_LOCATION);
        this.vertexAttribPointer(UV_LOCATION, 2, gl.FLOAT, false, 0, 0);
        mesh.setUv(buffer);
      }

      if (indices !== undefined && indices !== null) {
        const buffer = this.createBuffer() as WebGLBuffer;
        if (!buffer) {
          console.error(`indices buffer is not created for ${name}`);
        }
        this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, buffer);
        this.bufferData(
          this.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
        this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
        mesh.setIndices(buffer, indices.length);
      }

      this.bindVertexArray(null);
      this.bindBuffer(this.ARRAY_BUFFER, null);

      this.meshes[name] = mesh;
      return mesh;
    };

    gl.fSetSize = function (w, h) {
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";
      this.canvas.width = w;
      this.canvas.height = h;

      this.viewport(0, 0, w, h);
      return this;
    };

    gl.fFitScreen = function (wp, hp) {
      return this.fSetSize(
        window.innerWidth * (wp || 1),
        window.innerHeight * (hp || 1)
      );
    };
    return gl;
  }
}

export { GL };
