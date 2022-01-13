import { GL } from "./utils/GL";
import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { ShaderUtil } from "./utils/Shaders";
import { RenderLoop } from "./utils/RenderLoop";

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
  const uAngle = gl.getUniformLocation(program, "uAngle");
  gl.useProgram(null);

  const vertices = new Float32Array([0, 0, 0]);
  const vertexBuffer = gl.fCreateArrayBuffer(vertices);
  const vertexCount = vertices.length / 3;

  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.enableVertexAttribArray(aPositionLoc);
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.drawArrays(gl.POINTS, 0, vertexCount);

  const PointSizeStep = 3,
    AngleStep = Math.PI * 0.5;
  let pointSize = 0,
    angle = 0;
  function onRender(dt: number) {
    pointSize += PointSizeStep * dt;
    angle += AngleStep * dt;
    gl.uniform1f(uPointSizeLoc, Math.sin(pointSize) * 10 + 30);
    gl.uniform1f(uAngle, angle);

    gl.fClearScreen();
    gl.drawArrays(gl.POINTS, 0, vertexCount);
  }
  new RenderLoop(onRender).start();
});
