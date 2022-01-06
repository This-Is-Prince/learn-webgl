type InitBuffer = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  size: number,
  type: number,
  data: Float32Array,
  attribName: string
) => void;

const initBuffer: InitBuffer = (gl, program, size, type, data, attribName) => {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error(`buffer is not created`);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, attribName);
  if (attribute < 0) {
    throw new Error(`can't find the attribute - ${attribName}`);
  }
  gl.vertexAttribPointer(attribute, size, type, false, 0, 0);
  gl.enableVertexAttribArray(attribute);
};
export { initBuffer };
