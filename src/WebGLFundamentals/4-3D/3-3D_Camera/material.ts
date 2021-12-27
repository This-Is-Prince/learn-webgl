const setColors = (gl: WebGLRenderingContext) => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
      100, 100, 100, 100, 100, 100, 100, 100, 100, 200, 200, 200, 200, 200, 200,
      200, 200, 200,
    ]),
    gl.STATIC_DRAW
  );
};

export { setColors };
