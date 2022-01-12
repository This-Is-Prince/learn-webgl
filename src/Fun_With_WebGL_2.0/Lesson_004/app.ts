import { WebGL2 } from "./utils/gl";
import { Shader } from "./utils/Shaders";
import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { WebGL2Context } from "./lib";
import { Modal } from "./Modal/Modal";
import { Primitives } from "./Primitives/Primitives";
import { RenderLoop } from "./utils/RenderLoop";

window.addEventListener("load", () => {
  const gl = WebGL2.getContext("canvas")._SetSize(500, 500)._ClearScreen();
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
  new RenderLoop(onRender).start();
  function onRender() {
    gl._ClearScreen();
    gShader.activate().renderModal(gModal);
  }
});

class TestShader extends Shader {
  constructor(gl: WebGL2Context, colorArray: number[]) {
    super(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(this.program);
    const uColor = gl.getUniformLocation(this.program, "uColor");
    gl.uniform3fv(uColor, colorArray);
    gl.useProgram(null);
  }
}
