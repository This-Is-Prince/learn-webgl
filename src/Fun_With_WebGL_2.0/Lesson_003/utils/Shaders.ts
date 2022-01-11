import {
  ATTR_POSITION_NAME,
  ATTR_POSITION_LOC,
  ATTR_NORMAL_NAME,
  ATTR_NORMAL_LOC,
  ATTR_UV_NAME,
  ATTR_UV_LOC,
} from "./gl";
import { Modal } from "./Modal";
import { AttributeLocation, UniformLocation, WebGL2Context } from "./types";

class Shader {
  public program!: WebGLProgram;
  public gl!: WebGL2Context;
  public attribLoc!: AttributeLocation;
  public uniformLoc!: UniformLocation;

  constructor(
    gl: WebGL2Context,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    this.program = ShaderUtil.shaderProgram(
      gl,
      vertexShaderSource,
      fragmentShaderSource,
      true
    ) as WebGLProgram;
    if (this.program !== null) {
      this.gl = gl;
      gl.useProgram(this.program);
      this.attribLoc = ShaderUtil.getStandardAttribLocations(gl, this.program);
      this.uniformLoc = {};
    }
  }
  // -------------------------------------------------
  // Methods
  activate() {
    this.gl.useProgram(this.program);
    return this;
  }
  deactivate() {
    this.gl.useProgram(null);
    return this;
  }

  // function helps clear up resources when shader is no longer needed.
  dispose() {
    if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
      this.gl.useProgram(null);
    }
    this.gl.deleteProgram(this.program);
  }
  //...................................................
  //RENDER RELATED METHODS

  //Setup custom properties
  preRender() {} //abstract method, extended object may need need to do some things before rendering.

  //Handle rendering a modal
  renderModal(modal: Modal) {
    this.gl.bindVertexArray(modal.mesh.vao); //Enable VAO, this will set all the predefined attributes for the shader

    if (modal.mesh.indexCount) {
      this.gl.drawElements(
        modal.mesh.drawMode,
        modal.mesh.indexCount,
        this.gl.UNSIGNED_SHORT,
        0
      );
    } else {
      this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vertexCount);
    }

    this.gl.bindVertexArray(null);

    return this;
  }
}

class ShaderUtil {
  /**
   *
   * @param gl WebGL2Context (webgl2 context)
   * @param src string (shader source code)
   * @param type number (type of shader)
   * @returns
   */
  static createShader(gl: WebGL2Context, src: string, type: number) {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error(`unable to create shader...`);
      return null;
    }
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    // Get Error data if shader failed compiling
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        `Error compiling shader : ${src},  ${gl.getShaderInfoLog(shader)}`
      );
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  /**
   *
   * @param gl WebGL2Context (webgl2 context)
   * @param vShader WebGLShader (vertex shader)
   * @param fShader WebGLShader (fragment shader)
   * @param doValidate boolean (do validation)
   * @returns
   */
  static createProgram(
    gl: WebGL2Context,
    vShader: WebGLShader,
    fShader: WebGLShader,
    doValidate: boolean
  ) {
    // Link shaders together
    const prog = gl.createProgram();
    if (!prog) {
      console.error(`unable to create program...`);
      return null;
    }
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);

    // Force predefined locations for specific attributes. If the attribute isn't used in the shader its location will default to -1
    gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
    gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
    gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME);
    gl.linkProgram(prog);

    // Check if successful
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(
        `Error creating shader program. ${gl.getProgramInfoLog(prog)}`
      );
      gl.deleteProgram(prog);
      return null;
    }

    // Only do this for additional debugging.
    if (doValidate) {
      gl.validateProgram(prog);
      if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
        console.error(
          `Error validating program. ${gl.getProgramInfoLog(prog)}`
        );
        gl.deleteProgram(prog);
        return null;
      }
    }

    // Can delete the shaders since the program has been made.
    gl.detachShader(prog, vShader); // TODO, detaching might cause issues on some browsers, Might only need to delete.
    gl.detachShader(prog, fShader);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);

    return prog;
  }

  // -------------------------------------------------
  // Helper functions
  // -------------------------------------------------

  /**
   *
   * @param gl WebGL2Context (webgl2 context)
   * @param vShaderSrc string (vertex shader source code)
   * @param fShaderSrc string (fragment shader source code)
   * @param doValidate boolean (do validation)
   * @returns WebGLProgram | null
   */
  static shaderProgram(
    gl: WebGL2Context,
    vShaderSrc: string,
    fShaderSrc: string,
    doValidate: boolean
  ) {
    const vShader = ShaderUtil.createShader(gl, vShaderSrc, gl.VERTEX_SHADER);
    if (!vShader) {
      return null;
    }
    const fShader = ShaderUtil.createShader(gl, fShaderSrc, gl.FRAGMENT_SHADER);
    if (!fShader) {
      gl.deleteShader(vShader);
      return null;
    }

    return ShaderUtil.createProgram(gl, vShader, fShader, doValidate);
  }

  // -------------------------------------------------
  // Setters / Getters
  // -------------------------------------------------

  // Get the locations of standard Attributes that we will mostly be using. Location will = -1 if attribute is not found.
  /**
   *
   * @param gl WebGL2Context (webgl2 context)
   * @param program WebGLProgram
   * @returns
   */
  static getStandardAttribLocations(
    gl: WebGL2Context,
    program: WebGLProgram
  ): AttributeLocation {
    return {
      position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
      norm: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
      uv: gl.getAttribLocation(program, ATTR_UV_NAME),
    };
  }
}

export { ShaderUtil, Shader };
