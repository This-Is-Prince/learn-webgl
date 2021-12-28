window.addEventListener("load", () => {
  helloCanvas();
});
const helloCanvas = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`can't retrieve canvas element.`);
  }
  const gl = canvas.getContext("webgl");
  if (!gl) {
    throw new Error(`webgl is not supported in your browser.`);
  }
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.clearStencil(0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
};
