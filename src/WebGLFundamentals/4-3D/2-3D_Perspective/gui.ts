import * as dat from "dat.gui";

/**
 * GUI
 */
const gui = new dat.GUI();
let controllers: dat.GUIController[] = [];
const parameters = {
  width: 100,
  height: 150,
  thicknessOfRung: 30,
  depth: 30,
  translate: { tx: 45, ty: 150, tz: 0 },
  scale: { sx: 1, sy: 1, sz: 1 },
  rotate: { rx: 40, ry: 25, rz: 325 },
  fudgeFactor: 1,
};
const createControllers = (
  gl: WebGLRenderingContext,
  drawScene: (gl: WebGLRenderingContext) => void
) => {
  controllers.forEach((controller) => {
    if (controller) {
      gui.remove(controller);
    }
  });
  controllers = [];
  controllers.push(
    gui
      .add(parameters, "fudgeFactor")
      .min(0)
      .max(5)
      .step(0.01)
      .onChange(() => {
        drawScene(gl);
      }),
    gui
      .add(parameters.translate, "tx")
      .min(0)
      .max(gl.canvas.width - parameters.width)
      .step(1)
      .name("translateX")
      .onChange(() => {
        drawScene(gl);
      }),
    gui
      .add(parameters.translate, "ty")
      .min(0)
      .max(gl.canvas.height - parameters.height)
      .step(1)
      .name("translateY")
      .onChange(() => {
        drawScene(gl);
      }),
    gui
      .add(parameters.translate, "tz")
      .min(-400 + parameters.depth)
      .max(400 - parameters.depth)
      .step(1)
      .name("translateZ")
      .onChange(() => {
        drawScene(gl);
      }),
    gui
      .add(parameters.scale, "sx")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("scaleX")
      .onChange(() => {
        drawScene(gl);
      }),
    gui
      .add(parameters.scale, "sy")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("scaleY")
      .onChange(() => {
        drawScene(gl);
      }),
    gui
      .add(parameters.scale, "sz")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("scaleZ")
      .onChange(() => {
        drawScene(gl);
      }),
    gui
      .add(parameters.rotate, "rx")
      .min(0)
      .max(360)
      .step(1)
      .name("rotateX")
      .onChange(() => {
        drawScene(gl);
      }),
    gui
      .add(parameters.rotate, "ry")
      .min(0)
      .max(360)
      .step(1)
      .name("rotateY")
      .onChange(() => {
        drawScene(gl);
      }),
    gui
      .add(parameters.rotate, "rz")
      .min(0)
      .max(360)
      .step(1)
      .name("rotateZ")
      .onChange(() => {
        drawScene(gl);
      })
  );
};

export { createControllers, parameters };
