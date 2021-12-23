import ImageLoader from "../../0-Helpers/loaders/imageLoader";
import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";

/**
 * Image Loader
 */
const loader = new ImageLoader();
loader.load("../../../../static/images/dragon.jpg", (image) => {
  render(image);
});

/**
 * Create Shader
 */
type CreateShaderFunType = (
  gl: WebGLRenderingContext,
  shaderType: number,
  shaderSource: string
) => WebGLShader;
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

/**
 * Create Program
 */
type CreateProgramFunType = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => WebGLProgram;
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
    gl.deleteProgram(program);
    throw new Error(`program is not created : ${programInfoLog}`);
  }
  return program;
};

/**
 * set Rectangle Function
 */
type SetRectangleFunType = (
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) => void;
const setRectangle: SetRectangleFunType = (gl, x, y, width, height) => {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
};

/**
 * Render Function
 */
const render = (image: HTMLImageElement) => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const { clientWidth, clientHeight } = canvas;
  let pixelRatio = Math.min(window.devicePixelRatio);
  // pixelRatio = 1;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;

  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  setRectangle(gl, 0, 0, image.width, image.height);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW
  );

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  const textureSizeUniformLocation = gl.getUniformLocation(
    program,
    "u_textureSize"
  );

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
  gl.uniform2f(textureSizeUniformLocation, image.width, image.height);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};
