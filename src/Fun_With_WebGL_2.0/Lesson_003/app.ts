import { GLInstance } from "./utils/gl";
import { Shader, ShaderUtil } from "./utils/Shaders";
import vShaderSrc from "./shaders/vertex.vs.glsl?raw";
import fShaderSrc from "./shaders/fragment.fs.glsl?raw";
import { RenderLoop } from "./utils/RenderLoop";
import { WebGL2Context } from "./utils/types";
import { Modal } from "./utils/Modal";

window.addEventListener("load", () => {
  // WebGL2 context
  const gl = GLInstance("canvas").fSetSize(500, 500).fClear();
  // .....................................
  // SHADER STEPS
  const gShader = new TestShader(gl);
  // .....................................

  //............................................
  //Set Up Data Buffers
  const mesh = gl.fCreateMeshVAO(
    "dots",
    null,
    [0, 0, 0, 0.1, 0.1, 0, 0.1, -0.1, 0, -0.1, -0.1, 0, -0.1, 0.1, 0]
  );
  mesh.drawMode = gl.POINTS; //Most often the draw mode will be triangles, but in this instance we need Points

  //There is many instances when we want a single mesh object shared between many
  //modals, for example trees. One mesh with many transforms technically.
  const gModal = new Modal(mesh);
  const gPSizeStep = 3,
    gAngleStep = (Math.PI / 180.0) * 90;

  let gPointSize = 0,
    gAngle = 0;

  function onRender(dt: number) {
    gl.fClear();
    gShader
      .activate()
      .set(
        Math.sin((gPointSize += gPSizeStep * dt)) * 10.0 + 30.0, //Setting Point Size
        (gAngle += gAngleStep * dt) //Setting Angle
      )
      .renderModal(gModal);
  }
  new RenderLoop(onRender).start();
});

class TestShader extends Shader {
  constructor(gl: WebGL2Context) {
    super(gl, vShaderSrc, fShaderSrc); //Call the base class constructor which will setup most of what we need

    //Our shader uses custom uniforms, this is the time to get its location for future use.
    this.uniformLoc.uPointSize = gl.getUniformLocation(
      this.program,
      "uPointSize"
    );
    this.uniformLoc.uAngle = gl.getUniformLocation(this.program, "uAngle");

    gl.useProgram(null); //Done setting up shader
  }
  //Simple function that passes in Angle and PointSize uniform data to the shader program.
  set(size: number, angle: number) {
    if (this.uniformLoc.uPointSize) {
      this.gl.uniform1f(this.uniformLoc.uPointSize, size);
    }
    if (this.uniformLoc.uAngle) {
      this.gl.uniform1f(this.uniformLoc.uAngle, angle);
    }
    return this;
  }
}
