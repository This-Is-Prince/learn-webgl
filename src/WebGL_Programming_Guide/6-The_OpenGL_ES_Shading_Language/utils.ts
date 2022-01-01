type CreateShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
) => WebGLShader;
type CreateProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => WebGLProgram;

const createShader: CreateShader = (gl, type, source) => {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const shaderInfoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader is not compiled : ${shaderInfoLog}`);
  }
  return shader;
};

const createProgram: CreateProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const programInfoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`program is not linked : ${programInfoLog}`);
  }
  return program;
};

export { createProgram, createShader };
