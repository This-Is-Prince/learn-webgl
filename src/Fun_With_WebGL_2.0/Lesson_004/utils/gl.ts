import { MeshData, WebGL2Context } from "../lib";
import { AttributesLocation } from "./Constants";

class WebGL2 {
  private constructor() {}
  static getContext(canvasID: string): WebGL2Context {
    /**
     * Creating Canvas
     */
    let canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = canvasID;
      document.body.appendChild(canvas);
    }

    /**
     * Creating WebGL2Context
     */
    const gl = canvas.getContext("webgl2") as WebGL2Context;
    if (!gl) {
      console.error(`unable to get webgl2 context!!!!`);
    }

    /**
     * gl custom properties
     */
    // all meshes here
    gl.meshesData = {};

    /**
     * All the default configurations
     */
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    /**
     * All Methods
     */
    // clear canvas with specified color
    gl._ClearScreen = function () {
      this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
      return this;
    };

    // create array buffer
    gl._CreateArrayBuffer = function (srcData, isStatic = true) {
      // create buffer
      const buffer = this.createBuffer() as WebGLBuffer;
      // check is buffer created or not
      if (!buffer) {
        console.error(`unable to create buffer!!!!`);
      }
      // bind buffer to target so that webgl know that which kind of buffer it is (vertex data buffer or index data buffer)
      this.bindBuffer(this.ARRAY_BUFFER, buffer);
      // upload data to the buffer
      this.bufferData(
        gl.ARRAY_BUFFER,
        srcData,
        isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW
      );
      // unbind buffer because data is uploaded
      this.bindBuffer(this.ARRAY_BUFFER, null);
      return buffer;
    };

    // create VertexArrayObject that will predefine the buffers to standard shader attributes
    gl._CreateMeshVAO = function (
      name,
      indexArray,
      vertexArray,
      normalArray,
      uvArray
    ) {
      // Create MeshData object which holds mesh data
      const meshData: MeshData = {
        drawMode: this.TRIANGLES,
        vao: this.createVertexArray() as WebGLVertexArrayObject,
      };

      // bind vertex array
      this.bindVertexArray(meshData.vao);

      // Setup vertices
      if (vertexArray !== undefined) {
        meshData.verticesBuffer = this.createBuffer() as WebGLBuffer;
        meshData.vertexComponentLen = 3;
        meshData.vertexCount = vertexArray.length / meshData.vertexComponentLen;

        this.bindBuffer(this.ARRAY_BUFFER, meshData.verticesBuffer);
        this.bufferData(
          this.ARRAY_BUFFER,
          new Float32Array(vertexArray),
          this.STATIC_DRAW
        );
        this.enableVertexAttribArray(AttributesLocation.Position);
        this.vertexAttribPointer(
          AttributesLocation.Position,
          3,
          this.FLOAT,
          false,
          0,
          0
        );
      }

      // Setup normals
      if (normalArray !== undefined) {
        meshData.normalsBuffer = this.createBuffer() as WebGLBuffer;
        this.bindBuffer(this.ARRAY_BUFFER, meshData.normalsBuffer);
        this.bufferData(
          this.ARRAY_BUFFER,
          new Float32Array(normalArray),
          this.STATIC_DRAW
        );
        this.enableVertexAttribArray(AttributesLocation.Normal);
        this.vertexAttribPointer(
          AttributesLocation.Normal,
          3,
          this.FLOAT,
          false,
          0,
          0
        );
      }

      // Setup uv
      if (uvArray !== undefined) {
        meshData.uvBuffer = this.createBuffer() as WebGLBuffer;
        this.bindBuffer(this.ARRAY_BUFFER, meshData.uvBuffer);
        this.bufferData(
          this.ARRAY_BUFFER,
          new Float32Array(uvArray),
          this.STATIC_DRAW
        );
        this.enableVertexAttribArray(AttributesLocation.Uv);
        this.vertexAttribPointer(
          AttributesLocation.Uv,
          2,
          this.FLOAT,
          false,
          0,
          0
        );
      }

      // Setup Index
      if (indexArray !== undefined) {
        meshData.indexBuffer = this.createBuffer() as WebGLBuffer;
        meshData.indexCount = indexArray.length;
        this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, meshData.indexBuffer);
        this.bufferData(
          this.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indexArray),
          this.STATIC_DRAW
        );
        this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
      }

      // Clean up
      this.bindVertexArray(null);
      this.bindBuffer(gl.ARRAY_BUFFER, null);

      // stores meshData in  meshesData so that later we can cache
      this.meshesData[name] = meshData;
      return meshData;
    };

    /**
     * Setters and Getters
     */
    // set size, resolution of canvas
    gl._SetSize = function (w, h) {
      // Canvas element width, height
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";
      // Canvas resolution
      this.canvas.width = w;
      this.canvas.height = h;
      // Setting viewport
      this.viewport(0, 0, w, h);

      return this;
    };
    return gl;
  }
}

export { WebGL2 };
