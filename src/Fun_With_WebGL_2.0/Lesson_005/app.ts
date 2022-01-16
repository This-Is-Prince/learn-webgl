import { GL } from "./utils/GL";
import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { Shader } from "./utils/Shaders";
import { RenderLoop } from "./utils/RenderLoop";
import { WebGL2Context } from "./lib";
import { Modal } from "./Modal/Modal";
import { Primitives } from "./primitives/Primitives";

window.addEventListener("load", () => {
  /**
   * Context for drawing
   */
  const gl = GL.getGLInstance("canvas").fSetSize(500, 500).fClearScreen();

  const gShader = new TestShader(
    gl,
    [
      // Gray
      0.8, 0.8, 0.8,
      // Red
      1, 0, 0,
      // Green
      0, 1, 0,
      // Blue
      0, 0, 1,
    ]
  );

  const gModal = new Modal(Primitives.GridAxis.createMesh(gl));

  function onRender(_dt: number) {
    gl.fClearScreen();
    gShader.activate().renderModal(gModal);
  }
  new RenderLoop(onRender).start();
});

class TestShader extends Shader {
  constructor(gl: WebGL2Context, colors: number[]) {
    super(gl, vertexShaderSource, fragmentShaderSource);
    this.uniformLoc.uPointSize = gl.getUniformLocation(
      this.program,
      "uPointSize"
    ) as WebGLUniformLocation;
    this.uniformLoc.uAngle = gl.getUniformLocation(
      this.program,
      "uAngle"
    ) as WebGLUniformLocation;

    const uColor = gl.getUniformLocation(this.program, "uColor");
    gl.uniform3fv(uColor, colors);

    gl.useProgram(null);
  }

  set(size: number, angle: number) {
    this.gl.uniform1f(this.uniformLoc.uPointSize, size);
    this.gl.uniform1f(this.uniformLoc.uAngle, angle);
    return this;
  }
}
