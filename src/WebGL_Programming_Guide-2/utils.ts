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

type ResizeDrawingBuffer = (
  gl: WebGLRenderingContext,
  pixelRatio: number
) => void;
const resizeDrawingBuffer: ResizeDrawingBuffer = (gl, pixelRatio) => {
  const { clientWidth, clientHeight } = gl.canvas;
  gl.canvas.width = (clientWidth * pixelRatio) | 0;
  gl.canvas.height = (clientHeight * pixelRatio) | 0;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

type GetAttribLocation = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string
) => number;
/**
 *
 * @param gl WebGLRenderingContext (webgl context)
 * @param program WebGLProgram (program that holds vertex shader, where attribute variable define)
 * @param name string (attribute variable name)
 * @returns
 */
const getAttribLocation: GetAttribLocation = (gl, program, name) => {
  const attribute = gl.getAttribLocation(program, name);
  if (attribute < 0) {
    throw new Error(`unable to find the attribute with name -> ${name}`);
  }
  return attribute;
};

type GetUniformLocation = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string
) => WebGLUniformLocation;

/**
 *
 * @param gl WebGLRenderingContext (webgl context)
 * @param program WebGLProgram (program that holds vertex,fragment shader, where uniform variable define)
 * @param name string (uniform variable name)
 * @returns
 */
const getUniformLocation: GetUniformLocation = (gl, program, name) => {
  const uniform = gl.getUniformLocation(program, name) as WebGLUniformLocation;
  if (!uniform) {
    throw new Error(`unable to find the uniform with name -> ${name}`);
  }
  return uniform;
};

interface BufferParam {
  gl: WebGLRenderingContext;
  attribute: number;
  data: Float32Array;
  size?: number;
  type?: number;
  stride?: number;
  offset?: number;
}

type InitArrayBuffer = (param: BufferParam) => void;
const initArrayBuffer: InitArrayBuffer = ({
  gl,
  data,
  attribute,
  size = 3,
  type = gl.FLOAT,
  stride = 0,
  offset = 0,
}) => {
  // create a buffer object
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error(`unable to create buffer`);
  }
  // bind the buffer object to a buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // assign the buffer object to a attribute variable
  gl.vertexAttribPointer(attribute, size, type, false, stride, offset);
  // enable the assignment to attribute variable
  gl.enableVertexAttribArray(attribute);
};

export {
  initShaders,
  getWebGLContext,
  getCanvasElement,
  resizeDrawingBuffer,
  getAttribLocation,
  getUniformLocation,
  initArrayBuffer,
};
