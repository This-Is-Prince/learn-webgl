const setFGeometry = (gl: WebGLRenderingContext) => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -100, 100, 0, -100, -100, 0, 100, 100, 0, 100, 100, 0, -100, -100, 0, 100,
      -100, 0,
    ]),
    gl.STATIC_DRAW
  );
};
export { setFGeometry };
