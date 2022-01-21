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

  const gModal = new Modal(Primitives.GridAxis.createMesh(gl))
    .setScale(0.4, 0.4, 0.4)
    .setRotation(0, 0, 45)
    .setPosition(0.8, 0.8, 0);

  function onRender(dt: number) {
    gl.fClearScreen();
    const p = gModal.transform.position;
    const angle = Math.atan2(p.y, p.x) + 1 * dt;
    const radius = Math.sqrt(p.x * p.x + p.y * p.y);
    const scale = Math.max(0.2, Math.abs(Math.sin(angle)) * 1.2);

    gShader.activate().renderModal(
      gModal
        .setScale(scale, scale / 4, 1)
        .setPosition(radius * Math.cos(angle), radius * Math.sin(angle), 0)
        .addRotation(30 * dt, 60 * dt, 15 * dt)
        .preRender()
    );
  }
  new RenderLoop(onRender).start();
});

class TestShader extends Shader {
  constructor(gl: WebGL2Context, colors: number[]) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    const uColor = gl.getUniformLocation(this.program, "uColor");
    gl.uniform3fv(uColor, colors);

    gl.useProgram(null);
  }
}
