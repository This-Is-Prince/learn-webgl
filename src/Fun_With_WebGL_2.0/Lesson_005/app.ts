import { GL } from "./utils/GL";
import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { ShaderUtil } from "./utils/Shaders";

window.addEventListener("load", () => {
  /**
   * Context for drawing
   */
  const gl = GL.getGLInstance("canvas").fSetSize(500, 500).fClearScreen();

  const program = ShaderUtil.createProgramFromText(
    gl,
    vertexShaderSource,
    fragmentShaderSource,
    true
  ) as WebGLProgram;
  if (!program) {
    console.error(`unable to create program`);
  }

  gl.useProgram(program);
  const aPositionLoc = gl.getAttribLocation(program, "a_position");
  const uPointSizeLoc = gl.getUniformLocation(program, "uPointSize");
  gl.useProgram(null);
  const vertices = new Float32Array([0, 0, 0, 0.5, 0.5, 0]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.useProgram(program);
  gl.uniform1f(uPointSizeLoc, 50.0);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.enableVertexAttribArray(aPositionLoc);
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.drawArrays(gl.POINTS, 0, 2);
});
