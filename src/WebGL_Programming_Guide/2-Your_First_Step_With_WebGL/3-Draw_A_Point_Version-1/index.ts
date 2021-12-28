import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";

window.addEventListener("load", () => {
  helloPoint1();
});

type CreateShaderFunType = (
  gl: WebGLRenderingContext,
  shaderType: number,
  shaderSource: string
) => WebGLShader;
type CreateProgramFunType = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentSHader: WebGLShader
) => WebGLProgram;

const createShader: CreateShaderFunType = (gl, shaderType, shaderSource) => {
  const shader = gl.createShader(shaderType) as WebGLShader;
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const shaderInfoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader is not compiled : ${shaderInfoLog}`);
  }
  return shader;
};

const createProgram: CreateProgramFunType = (
  gl,
  vertexShader,
  fragmentShader
) => {
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const programInfoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(programInfoLog);
    throw new Error(`program is not linked : ${programInfoLog}`);
  }
  return program;
};

const helloPoint1 = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`can't retrieve canvas`);
  }
  const { clientHeight, clientWidth } = canvas;
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;

  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  if (!gl) {
    throw new Error(`webgl is not supported`);
  }
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.clearStencil(0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
};
