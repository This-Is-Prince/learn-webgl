type CompileShaderFunType = (
  gl: WebGLRenderingContext,
  shaderType: number,
  shaderSource: string
) => WebGLShader;

/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
 * @param {string} shaderSource The GLSL source code for the shader.
 *
 * @returns {!WebGLShader} The shader.
 */
const compileShader: CompileShaderFunType = (gl, shaderType, shaderSource) => {
  // Create a shader object
  const shader = gl.createShader(shaderType) as WebGLShader;

  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check if it compiled
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader: " + gl.getShaderInfoLog(shader);
  }
  return shader;
};

type CreateProgramAndLinkShaderFunType = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => WebGLProgram;

/**
 *
 * @param {!WebGLRenderingContext} gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @returns {WebGLProgram} A Program.
 */

const createProgramAndLinkShader: CreateProgramAndLinkShaderFunType = (
  gl,
  vertexShader,
  fragmentShader
) => {
  // Create a program.
  const program = gl.createProgram() as WebGLProgram;

  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link the program.
  gl.linkProgram(program);

  // Check if it linked.
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    // Something went wrong with the link
    throw "program failed to link:" + gl.getProgramInfoLog(program);
  }
  return program;
};
