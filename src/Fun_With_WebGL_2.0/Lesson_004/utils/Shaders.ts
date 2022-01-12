import { StandardAttributesLocation, WebGL2Context } from "../lib";
import { AttributesLocation, AttributesName } from "./Constants";

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

    gl.bindAttribLocation(
      program,
      AttributesLocation.Position,
      AttributesName.Position
    );
    gl.bindAttribLocation(
      program,
      AttributesLocation.Normal,
      AttributesName.Normal
    );
    gl.bindAttribLocation(program, AttributesLocation.Uv, AttributesName.Uv);

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

  /**
   * Create Program From Text
   * @param gl WebGL2Context (webgl2 context)
   * @param vertexShaderText string (vertex shader source code)
   * @param fragmentShaderText string (fragment shader source code)
   * @param doValidate boolean
   * @returns WebGLProgram | null
   */
  static createProgramFromText(
    gl: WebGL2Context,
    vertexShaderText: string,
    fragmentShaderText: string,
    doValidate: boolean
  ) {
    const vertexShader = ShaderUtil.createShader(
      gl,
      vertexShaderText,
      gl.VERTEX_SHADER
    );
    if (!vertexShader) {
      return null;
    }
    const fragmentShader = ShaderUtil.createShader(
      gl,
      fragmentShaderText,
      gl.FRAGMENT_SHADER
    );
    if (!fragmentShader) {
      gl.deleteShader(vertexShader);
      return null;
    }
    return ShaderUtil.createProgram(
      gl,
      vertexShader,
      fragmentShader,
      doValidate
    );
  }

  /**
   * Create Program From DOM Element (get text from dom element)
   * @param gl WebGL2Context (webgl2 context)
   * @param vertexID string (element id, that have vertex shader source code)
   * @param fragmentID string (element id, that have fragment shader source code)
   * @param doValidate boolean
   * @returns WebGLProgram | null
   */
  static createProgramFromDOM(
    gl: WebGL2Context,
    vertexID: string,
    fragmentID: string,
    doValidate: boolean
  ) {
    const vertexShaderText = ShaderUtil.getShaderSourceFromDOM(vertexID);
    if (!vertexShaderText) {
      return null;
    }
    const fragmentShaderText = ShaderUtil.getShaderSourceFromDOM(fragmentID);
    if (!fragmentShaderText) {
      return null;
    }
    return ShaderUtil.createProgramFromText(
      gl,
      vertexShaderText,
      fragmentShaderText,
      doValidate
    );
  }

  /**
   * Get Locations of attributes through native functions
   * @param gl WebGL2Context (webgl2 context)
   * @param program WebGLProgram
   * @returns StandardAttributesLocation
   */
  static getStandardAttribLocation(
    gl: WebGL2Context,
    program: WebGLProgram
  ): StandardAttributesLocation {
    return {
      position: gl.getAttribLocation(program, AttributesName.Position),
      normal: gl.getAttribLocation(program, AttributesName.Normal),
      uv: gl.getAttribLocation(program, AttributesName.Uv),
    };
  }
}
export { ShaderUtil };
