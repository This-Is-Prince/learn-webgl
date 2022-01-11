import { RTN, WebGL2Context } from "./types";

// ---------------------------------------
// Global Constants
// ---------------------------------------
const ATTR_POSITION_NAME = "a_position";
const ATTR_POSITION_LOC = 0;
const ATTR_NORMAL_NAME = "a_norm";
const ATTR_NORMAL_LOC = 1;
const ATTR_UV_NAME = "a_uv";
const ATTR_UV_LOC = 2;

// ---------------------------------------
// Custom GL Context Object
// ---------------------------------------
const GLInstance = (canvasID: string) => {
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
   * WebGL2Context
   */
  const gl = canvas.getContext("webgl2") as WebGL2Context;

  // ................................................
  // Setup custom properties
  gl.mMeshCache = {}; // Cache all the mesh structs, easy to unload buffers if they all exist in one place.

  // ................................................
  // Setup GL, Set all the default configurations we need.
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // ................................................
  // Methods
  gl.fClear = function () {
    this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
    return this;
  };

  // Create and fill our Array Buffer.
  gl.fCreateArrayBuffer = function (srcData, isStatic = true) {
    const buffer = this.createBuffer() as WebGLBuffer;
    this.bindBuffer(this.ARRAY_BUFFER, buffer);
    this.bufferData(
      this.ARRAY_BUFFER,
      srcData,
      isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW
    );
    this.bindBuffer(this.ARRAY_BUFFER, null);
    return buffer;
  };

  // Turns arrays into GL buffers, then setup a VAO that will predefine the buffers to standard shader attributes.
  gl.fCreateMeshVAO = function (
    name,
    indexArray,
    verticesArray,
    normalArray,
    uvArray
  ) {
    const rtn: RTN = {
      drawMode: this.TRIANGLES,
    };
    // Create and bind vao
    rtn.vao = this.createVertexArray() as WebGLVertexArrayObject;
    this.bindVertexArray(rtn.vao); // Bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.

    // ................................................
    // Set up vertices
    if (verticesArray !== undefined && verticesArray !== null) {
      rtn.verticesBuffer = this.createBuffer() as WebGLBuffer;
      rtn.vertexComponentLen = 3;
      rtn.vertexCount = verticesArray.length / rtn.vertexComponentLen;

      this.bindBuffer(this.ARRAY_BUFFER, rtn.verticesBuffer);
      this.bufferData(
        this.ARRAY_BUFFER,
        new Float32Array(verticesArray),
        this.STATIC_DRAW
      );
      this.enableVertexAttribArray(ATTR_POSITION_LOC);
      this.vertexAttribPointer(ATTR_POSITION_LOC, 3, this.FLOAT, false, 0, 0);
    }

    //.......................................................
    //Setup normals
    if (normalArray !== undefined && normalArray != null) {
      rtn.normalBuffer = this.createBuffer() as WebGLBuffer;
      this.bindBuffer(this.ARRAY_BUFFER, rtn.normalBuffer);
      this.bufferData(
        this.ARRAY_BUFFER,
        new Float32Array(normalArray),
        this.STATIC_DRAW
      );
      this.enableVertexAttribArray(ATTR_NORMAL_LOC);
      this.vertexAttribPointer(ATTR_NORMAL_LOC, 3, this.FLOAT, false, 0, 0);
    }

    //.......................................................
    //Setup UV
    if (uvArray !== undefined && uvArray != null) {
      rtn.uvBuffer = this.createBuffer() as WebGLBuffer;
      this.bindBuffer(this.ARRAY_BUFFER, rtn.uvBuffer);
      this.bufferData(
        this.ARRAY_BUFFER,
        new Float32Array(uvArray),
        this.STATIC_DRAW
      );
      this.enableVertexAttribArray(ATTR_UV_LOC);
      this.vertexAttribPointer(ATTR_UV_LOC, 2, this.FLOAT, false, 0, 0); //UV only has two floats per component
    }

    //.......................................................
    //Setup Index.
    if (indexArray !== undefined && indexArray != null) {
      rtn.indexBuffer = this.createBuffer() as WebGLBuffer;
      rtn.indexCount = indexArray.length;
      this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.indexBuffer);
      this.bufferData(
        this.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indexArray),
        this.STATIC_DRAW
      );
      this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
    }

    //Clean up
    this.bindVertexArray(null); //Unbind the VAO, very Important. always unbind when your done using one.
    this.bindBuffer(this.ARRAY_BUFFER, null); //Unbind any buffers that might be set

    this.mMeshCache[name] = rtn;
    return rtn;
  };

  // ................................................
  // Setters - Getters

  // Set the size of the canvas html element and the rendering view port
  gl.fSetSize = function (w, h) {
    // Set the size of canvas, on chrome we need to set it 3 ways to make it work perfectly.
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.canvas.width = w;
    this.canvas.height = h;

    // When updating the canvas size, must reset the viewport of the canvas
    // else the resolution webgl renders at will not change
    this.viewport(0, 0, w, h);
    return this;
  };
  return gl;
};
export {
  GLInstance,
  ATTR_POSITION_NAME,
  ATTR_POSITION_LOC,
  ATTR_NORMAL_NAME,
  ATTR_NORMAL_LOC,
  ATTR_UV_NAME,
  ATTR_UV_LOC,
};
