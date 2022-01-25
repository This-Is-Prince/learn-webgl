import { GL } from "./utils/GL";
import { RenderLoop } from "./utils/RenderLoop";
import { Primitives } from "./primitives/Primitives";
import { Camera, CameraController } from "./Camera/Camera";
import { GridAxisShader } from "./utils/Shaders_Extra";

window.addEventListener("load", () => {
  /**
   * Context for drawing
   */
  const gl = GL.getGLInstance("canvas").fFitScreen(0.95, 0.9).fClearScreen();
  const gCamera = new Camera(gl);
  gCamera.transform.position.set(0, 1, 3);
  new CameraController(gl, gCamera);

  const gGridShader = new GridAxisShader(gl, gCamera.projectionMatrix);
  const gGridModal = Primitives.GridAxis.createModal(gl, true);

  function onRender(_dt: number) {
    gCamera.updateViewMatrix();
    gl.fClearScreen();
    gGridShader
      .activate()
      .setCameraMatrix(gCamera.viewMatrix)
      .renderModal(gGridModal.preRender());
  }
  new RenderLoop(onRender).start();
});
