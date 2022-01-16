import { GL } from "./utils/GL";
import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { Shader } from "./utils/Shaders";
import { RenderLoop } from "./utils/RenderLoop";
import { WebGL2Context } from "./lib";
import { Modal } from "./Modal/Modal";

window.addEventListener("load", () => {
  /**
   * Context for drawing
   */
  const gl = GL.getGLInstance("canvas").fSetSize(500, 500).fClearScreen();

  const gShader = new TestShader(gl);

  const mesh = gl.fCreateMeshVAO(
    "dots",
    null,
    [0, 0, 0, 0.1, 0.1, 0, 0.1, -0.1, 0, -0.1, -0.1, 0, -0.1, 0.1, 0]
  );
  mesh.drawMode = gl.POINTS;

  const gModal = new Modal(mesh);

  const PointSizeStep = 3,
    AngleStep = Math.PI * 0.5;
  let pointSize = 0,
    angle = 0;
  function onRender(dt: number) {
    gl.fClearScreen();
    gShader
      .activate()
      .set(
        Math.sin((pointSize += PointSizeStep * dt)) * 10.0 + 30.0,
        (angle += AngleStep * dt)
      )
      .renderModal(gModal);
  }
  new RenderLoop(onRender).start();
});

class TestShader extends Shader {
  constructor(gl: WebGL2Context) {
    super(gl, vertexShaderSource, fragmentShaderSource);
    this.uniformLoc.uPointSize = gl.getUniformLocation(
      this.program,
      "uPointSize"
    ) as WebGLUniformLocation;
    this.uniformLoc.uAngle = gl.getUniformLocation(
      this.program,
      "uAngle"
    ) as WebGLUniformLocation;

    gl.useProgram(null);
  }

  set(size: number, angle: number) {
    this.gl.uniform1f(this.uniformLoc.uPointSize, size);
    this.gl.uniform1f(this.uniformLoc.uAngle, angle);
    return this;
  }
}
