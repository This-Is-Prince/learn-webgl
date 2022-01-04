type InitArrayBuffer = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  size: number,
  data: Float32Array,
  type: number,
  attribName: string
) => void;

const initArrayBuffer: InitArrayBuffer = (
  gl,
  program,
  size,
  data,
  type,
  attribName
) => {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error(`buffer is not created for attribute - ${attribName}`);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const attribute = gl.getAttribLocation(program, attribName);
  if (attribute < 0) {
    throw new Error(`can't get location of attribute - ${attribName} `);
  }
  gl.vertexAttribPointer(attribute, size, type, false, 0, 0);
  gl.enableVertexAttribArray(attribute);
};

export { initArrayBuffer };
