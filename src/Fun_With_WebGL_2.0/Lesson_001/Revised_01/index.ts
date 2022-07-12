import { GLInstance } from "./utils/gl";
import vShaderSrc from "./shaders/vertex.vs.glsl?raw";
import fShaderSrc from "./shaders/fragment.fs.glsl?raw";
import { ShaderUtil } from "./utils/Shaders";

window.addEventListener("load", function () {
  // .....................................
  // Get our extended GL Context Object
  const gl = GLInstance("canvas").fSetSize(500, 500).fClear();

  // .....................................
  // SHADER STEPS
  // 1. Get Vertex and Fragment Shader Text

  // 2. Compile text and validate
  const vShader = ShaderUtil.createShader(
    gl,
    vShaderSrc,
    gl.VERTEX_SHADER
  ) as WebGLShader;
  const fShader = ShaderUtil.createShader(
    gl,
    fShaderSrc,
    gl.FRAGMENT_SHADER
  ) as WebGLShader;

  // 3. Link the shaders together as a program.
  const shaderProg = ShaderUtil.createProgram(
    gl,
    vShader,
    fShader,
    true
  ) as WebGLProgram;

  // 4. Get location of Uniforms and Attributes.
  gl.useProgram(shaderProg);
  const aPositionLoc = gl.getAttribLocation(shaderProg, "a_position");
  const uPointSizeLoc = gl.getUniformLocation(shaderProg, "uPointSize");
  gl.useProgram(null);

  // .....................................
  // Set Up Data Buffers
  const aryVertex = new Float32Array([0, 0, 0, 0.5, 0.5, 0]);
  const bufVertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufVertex);
  gl.bufferData(gl.ARRAY_BUFFER, aryVertex, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // .....................................
  // Set Up For Drawing
  gl.useProgram(shaderProg); // Activate the shader
  gl.uniform1f(uPointSizeLoc, 50.0); // Store data to the shader's uniform variable uPointSize

  // how its down without VAOs
  gl.bindBuffer(gl.ARRAY_BUFFER, bufVertex); // Tell gl which buffer we want to use at the moment
  gl.enableVertexAttribArray(aPositionLoc); // Enable the position attribute in the shader
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0); // Set which buffer the attribute will pull its data from
  gl.bindBuffer(gl.ARRAY_BUFFER, null); // Done setting up the buffer

  gl.drawArrays(gl.POINTS, 0, 2); // Draw the points
});
