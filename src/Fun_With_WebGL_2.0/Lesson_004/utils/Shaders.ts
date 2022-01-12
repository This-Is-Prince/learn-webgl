import { WebGL2Context } from "../lib";

/**
 * ShaderUtil (shader utility functions described in this class as a static)
 */
class ShaderUtil {
  private constructor() {}
  /**
   * Get Shader Source From DOM Element
   * @param elementID string (element id, that element have shader source.)
   * @returns string | null
   */
  static getShaderSourceFromDOM(elementID: string) {
    const element = document.getElementById(elementID) as HTMLElement;
    if (!element) {
      console.error(`unable to find element with id :- ${elementID}`);
      return null;
    }
    if (element.textContent === "") {
      console.error(
        `unable to find shader source in specified element with id :- ${elementID}`
      );
      return null;
    }
    return element.textContent;
  }

  /**
   * Create Shader With Specified type and source
   * @param gl WebGL2Context (webgl2 context)
   * @param source string (shader source code)
   * @param type number (type of shader, (fragment,vertex))
   * @returns WebGLShader | null
   */
  static createShader(gl: WebGL2Context, source: string, type: number) {
    const shader = gl.createShader(type) as WebGLShader;
    if (!shader) {
      console.error(`unable to create shader with type :- ${type}`);
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`unable to compile shader, ${gl.getShaderInfoLog(shader)}`);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  /**
   * Delete Specified Shaders
   * @param gl WebGL2Context (webgl2 context)
   * @param vertexShader WebGLShader (vertex shader)
   * @param fragmentShader WebGLShader (fragment shader)
   */
  static deleteShaders(
    gl: WebGL2Context,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }

  /**
   * Create Program from specified shaders and validate them
   * @param gl WebGL2Context (webgl2 context)
   * @param vertexShader WebGLShader
   * @param fragmentShader WebGLShader
   * @param doValidate boolean
   * @returns WebGLProgram | null
   */
  static createProgram(
    gl: WebGL2Context,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    doValidate: boolean
  ) {
    const program = gl.createProgram() as WebGLProgram;
    if (!program) {
      console.error(`unable to create program!!!!`);
      return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`unable to link program, ${gl.getProgramInfoLog(program)}`);
      gl.deleteProgram(program);
      return null;
    }

    if (doValidate) {
      gl.validateProgram(program);
      if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error(`validation error, ${gl.getProgramInfoLog(program)}`);
        gl.deleteProgram(program);
        return null;
      }
    }
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    ShaderUtil.deleteShaders(gl, vertexShader, fragmentShader);
    return program;
  }
}
export { ShaderUtil };
