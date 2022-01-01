import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";

window.addEventListener("load", () => {
  toward3D();
});

const updateCanvasResolution = (
  canvas: HTMLCanvasElement,
  pixelRatio: number
) => {
  const { clientHeight, clientWidth } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

const toward3D = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`canvas is not retrieve`);
  }
  updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));

  /**
   * WebGL Rendering Context
   */
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  if (!gl) {
    throw new Error(`webgl is not supported`);
  }
};
