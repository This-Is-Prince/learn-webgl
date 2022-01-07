type CreateShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
) => WebGLShader;
/**
 *
 * @param gl WebGLRenderingContext (webgl context)
 * @param type type of shader (fragment, vertex)
 * @param source shader source in string form
 * @returns WebGLShader
 */
const createShader: CreateShader = (gl, type, source) => {
  const shader = gl.createShader(type) as WebGLShader;
  if (!shader) {
    throw new Error("unable to create shader");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const shaderInfoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`unable to compile shader :- ${shaderInfoLog}`);
  }
  return shader;
};

type CreateProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => WebGLProgram;
/**
 *
 * @param gl WebGLRenderingContext (webgl context)
 * @param vertexShader vertexShader
 * @param fragmentShader fragmentShader
 * @returns WebGLProgram
 */
const createProgram: CreateProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram() as WebGLProgram;
  if (!program) {
    throw new Error("unable to create program");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const programInfoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(`unable to link program :- ${programInfoLog}`);
  }
  return program;
};

type InitShaders = (
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
) => WebGLProgram;

/**
 *
 * @param gl WebGLRenderingContext (webgl context)
 * @param vertexShaderSource vertex shader source in string form
 * @param fragmentShaderSource fragment shader source in string form
 * @returns WebGLProgram
 */

const initShaders: InitShaders = (
  gl,
  vertexShaderSource,
  fragmentShaderSource
) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = createProgram(gl, vertexShader, fragmentShader);
  return program;
};

type GetWebGLContext = (canvas: HTMLCanvasElement) => WebGLRenderingContext;
/**
 *
 * @param canvas HTMLCanvasElement (html canvas element)
 * @returns WebGLRenderingContext (webgl context)
 */
const getWebGLContext: GetWebGLContext = (canvas) => {
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  if (!gl) {
    throw new Error("webgl is not supported");
  }
  return gl;
};

type GetCanvasElement = (id: string) => HTMLCanvasElement;
/**
 *
 * @param id canvas element id
 * @returns HTMLCanvasElement (canvas element)
 */
const getCanvasElement: GetCanvasElement = (id) => {
  let canvas = document.getElementById(id) as HTMLCanvasElement;
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = id;
    document.body.appendChild(canvas);
  }
  return canvas;
};

type UpdateCanvasResolution = (
  canvas: HTMLCanvasElement,
  pixelRatio: number
) => void;
/**
 *
 * @param canvas HTMLCanvasELement (canvas element)
 * @param pixelRatio (pixel ratio for resolution)
 */
const updateCanvasResolution: UpdateCanvasResolution = (canvas, pixelRatio) => {
  const { clientWidth, clientHeight } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

export {
  initShaders,
  getWebGLContext,
  getCanvasElement,
  updateCanvasResolution,
};
