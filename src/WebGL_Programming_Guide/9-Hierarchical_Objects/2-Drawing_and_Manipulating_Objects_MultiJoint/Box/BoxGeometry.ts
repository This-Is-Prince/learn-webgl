interface Attributes {
  position: Float32Array;
  normal: Float32Array;
  index: Uint8Array;
}

class BoxGeometry {
  public attributes: Attributes;
  constructor(public width = 1, public height = 1, public depth = 1) {
    const position = new Float32Array([
      // v0-v1-v2-v3 front
      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
      // v0-v3-v4-v5 right
      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
      // v0-v5-v6-v1 up
      1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
      // v1-v6-v7-v2 left
      -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
      // v7-v4-v3-v2 down
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
      // v4-v7-v6-v5 back
      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
    ]);
    const normal = new Float32Array([
      // v0-v1-v2-v3 front
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      // v0-v3-v4-v5 right
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
      // v0-v5-v6-v1 up
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      // v1-v6-v7-v2 left
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      // v7-v4-v3-v2 down
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
      // v4-v7-v6-v5 back
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    ]);
    const index = new Uint8Array([
      // front
      0, 1, 2, 0, 2, 3,
      // right
      4, 5, 6, 4, 6, 7,
      // up
      8, 9, 10, 8, 10, 11,
      // left
      12, 13, 14, 12, 14, 15,
      // down
      16, 17, 18, 16, 18, 19,
      // back
      20, 21, 22, 20, 22, 23,
    ]);
    this.attributes = { position, normal, index };
  }
  setAttributes(gl: WebGLRenderingContext, program: WebGLProgram) {
    const { index, normal, position } = this.attributes;
    this.initBuffer(gl, position, program, "position");
    this.initBuffer(gl, normal, program, "normal");

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
  }
  private initBuffer(
    gl: WebGLRenderingContext,
    data: Float32Array,
    program: WebGLProgram,
    attribName: string
  ) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const index = gl.getAttribLocation(program, attribName);

    if (index < 0) {
      throw new Error(`can't find attribute = ${attribName}`);
    }
    gl.vertexAttribPointer(index, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(index);
  }
}

export { BoxGeometry };
