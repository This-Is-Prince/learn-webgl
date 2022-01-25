import { WebGL2Context } from "../lib";
import { Shader } from "./Shaders";
import vertexShaderSource from "../shaders/GridAxisShaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "../shaders/GridAxisShaders/fragment.fs.glsl?raw";

class GridAxisShader extends Shader {
  constructor(gl: WebGL2Context, pMatrix: Float32Array) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    //Standard Uniforms
    this.setPerspectiveMatrix(pMatrix);

    //Custom Uniforms
    const uColor = gl.getUniformLocation(this.program, "uColor");
    gl.uniform3fv(
      uColor,
      new Float32Array([0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1])
    );

    //Cleanup
    gl.useProgram(null);
  }
}

export { GridAxisShader };
