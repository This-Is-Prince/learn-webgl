import { createProgram, createShader } from "../utils";

const updateCanvasResolution = (gl: WebGLRenderingContext) => {
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const { clientHeight, clientWidth } = gl.canvas;
  gl.canvas.width = (clientWidth * pixelRatio) | 0;
  gl.canvas.height = (clientHeight * pixelRatio) | 0;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};

const initializeApp = (
  vertexShaderSource: string,
  fragmentShaderSource: string
) => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`canvas element is not present`);
  }

  /**
   * WebGLRendering Context
   */
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  if (!gl) {
    throw new Error("webgl is not present");
  }

  // Update Canvas Resolution
  updateCanvasResolution(gl);

  /**
   * Shaders
   */
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  /**
   * Program
   */
  const program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);
  return { program, gl };
};

export { initializeApp, updateCanvasResolution };
