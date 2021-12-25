const setColors = (gl: WebGLRenderingContext, size: number) => {
  const colors = new Uint8Array(size * 3);
  for (let i = 0; i < size * 3; i++) {
    colors[i] = (Math.random() * 256) | 0;
  }
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
};
export { setColors };
