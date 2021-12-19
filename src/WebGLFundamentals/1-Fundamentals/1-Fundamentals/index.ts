/**
 * Canvas
 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

/**
 * WebGLRenderingContext
 */
const gl = canvas.getContext("webgl");
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

if (gl !== null) {
  const vertexShaderSource = (
    document.getElementById("vertex-shader-2d") as HTMLScriptElement
  ).text;
  const fragmentShaderSource = (
    document.getElementById("fragment-shader-2d") as HTMLScriptElement
  ).text;
  const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
  ) as WebGLShader;
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  ) as WebGLShader;
  const program = createProgram(
    gl,
    vertexShader,
    fragmentShader
  ) as WebGLProgram;
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
}
