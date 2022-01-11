import { GLInstance } from "./utils/gl";
import { ShaderUtil } from "./utils/Shaders";
import vShaderSrc from "./shaders/vertex.vs.glsl?raw";
import fShaderSrc from "./shaders/fragment.fs.glsl?raw";
import { RenderLoop } from "./utils/RenderLoop";

window.addEventListener("load", () => {
  // WebGL2 context
  const gl = GLInstance("canvas").fSetSize(500, 500).fClear();
  // Shader Program
  const shaderProg = ShaderUtil.shaderProgram(
    gl,
    vShaderSrc,
    fShaderSrc,
    true
  ) as WebGLProgram;

  // 4. Get location of Uniforms and Attributes.
  gl.useProgram(shaderProg);
  const aPositionLoc = gl.getAttribLocation(shaderProg, "a_position");
  const uPointSizeLoc = gl.getUniformLocation(shaderProg, "uPointSize");
  const uAngleLoc = gl.getUniformLocation(shaderProg, "uAngle");
  gl.useProgram(null);

  // .....................................
  // Set Up Data Buffers
  const aryVertex = new Float32Array([0, 0, 0]);
  const bufVertex = gl.fCreateArrayBuffer(aryVertex);
  const gVertCnt = aryVertex.length / 3;

  // .....................................
  // Set Up For Drawing
  gl.useProgram(shaderProg); // Activate the shader
  gl.uniform1f(uPointSizeLoc, 50.0); // Store data to the shader's uniform variable uPointSize

  // how its down without VAOs
  gl.bindBuffer(gl.ARRAY_BUFFER, bufVertex); // Tell gl which buffer we want to use at the moment
  gl.enableVertexAttribArray(aPositionLoc); // Enable the position attribute in the shader
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0); // Set which buffer the attribute will pull its data from
  gl.bindBuffer(gl.ARRAY_BUFFER, null); // Done setting up the buffer

  const gPSizeStep = 3,
    gAngleStep = (Math.PI / 180.0) * 90;

  let gPointSize = 0,
    gAngle = 0;

  function onRender(dt: number) {
    gPointSize += gPSizeStep * dt;
    const size = Math.sin(gPointSize) * 10.0 + 30.0;
    gl.uniform1f(uPointSizeLoc, size);

    gAngle += gAngleStep * dt;
    gl.uniform1f(uAngleLoc, gAngle);

    gl.fClear();
    gl.drawArrays(gl.POINTS, 0, gVertCnt);
  }
  new RenderLoop(onRender).start();
});
