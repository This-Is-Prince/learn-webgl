import { StandardAttribLoc, StandardUniformLoc, WebGL2Context } from "../lib";
import { Modal } from "../Modal/Modal";
import { attributes } from "./Constants";

class Shader {
  public program!: WebGLProgram;
  public gl!: WebGL2Context;
  public attribLoc!: StandardAttribLoc;
  public uniformLoc!: StandardUniformLoc;

  constructor(
    gl: WebGL2Context,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    this.program = ShaderUtil.createProgramFromText(
      gl,
      vertexShaderSource,
      fragmentShaderSource,
      true
    ) as WebGLProgram;
    if (!this.program) {
      console.error(`unable to create shader program from text`);
    }
    if (this.program) {
      this.gl = gl;
      this.gl.useProgram(this.program);
      this.attribLoc = ShaderUtil.getStandardAttribLocation(
        this.gl,
        this.program
      );
      this.uniformLoc = ShaderUtil.getStandardUniformLocation(
        this.gl,
        this.program
      );
    }
  }

  //...................................................
  //Methods
  activate() {
    this.gl.useProgram(this.program);
    return this;
  }
  deactivate() {
    this.gl.useProgram(null);
    return this;
  }

  setPerspective(matData: Float32Array) {
    this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData);
    return this;
  }
  setModalMatrix(matData: Float32Array) {
    this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData);
    return this;
  }
  setCameraMatrix(matData: Float32Array) {
    this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData);
    return this;
  }

  //function helps clean up resources when shader is no longer needed.
  dispose() {
    //unbind the program if its currently active
    if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program)
      this.gl.useProgram(null);
    this.gl.deleteProgram(this.program);
  }

  //...................................................
  //RENDER RELATED METHODS

  //Setup custom properties
  preRender() {} //abstract method, extended object may need need to do some things before rendering.

  //Handle rendering a modal
  renderModal(modal: Modal) {
    this.setModalMatrix(modal.transform.getViewMatrix()); //Set the transform, so the shader knows where the modal exists in 3d space
    this.gl.bindVertexArray(modal.mesh.vao); //Enable VAO, this will set all the predefined attributes for the shader

    const { indexCount, vertexCount, drawMode } = modal.mesh;
    if (indexCount)
      this.gl.drawElements(drawMode, indexCount, this.gl.UNSIGNED_SHORT, 0);
    else if (vertexCount) {
      this.gl.drawArrays(drawMode, 0, vertexCount);
    }

    this.gl.bindVertexArray(null);

    return this;
  }
}

class ShaderUtil {
  static createShader(gl: WebGL2Context, source: string, type: number) {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error(`Error creating shader with type : ${type}`);
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        `Error compiling shader : ${source} ${gl.getShaderInfoLog(shader)}`
      );
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  static createProgram(
    gl: WebGL2Context,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    doValidate: boolean
  ) {
    const program = gl.createProgram();
    if (!program) {
      console.error(`Error creating program.`);
      return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    const {
      normal: { location: norLoc, name: norName },
      position: { location: posLoc, name: posName },
      uv: { location: uvLoc, name: uvName },
    } = attributes;
    gl.bindAttribLocation(program, posLoc, posName);
    gl.bindAttribLocation(program, norLoc, norName);
    gl.bindAttribLocation(program, uvLoc, uvName);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        `Error creating shader program, ${gl.getProgramInfoLog(program)}`
      );
      gl.deleteProgram(program);
      return null;
    }
    if (doValidate) {
      gl.validateProgram(program);
      if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error(
          `Error validating program, ${gl.getProgramInfoLog(program)}`
        );
        gl.deleteProgram(program);
        return null;
      }
    }

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  }

  static createProgramFromText(
    gl: WebGL2Context,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    doValidate: boolean
  ) {
    const vertexShader = ShaderUtil.createShader(
      gl,
      vertexShaderSource,
      gl.VERTEX_SHADER
    ) as WebGLShader;
    if (!vertexShader) {
      console.error(`unable to create vertex shader`);
      return null;
    }
    const fragmentShader = ShaderUtil.createShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    ) as WebGLShader;
    if (!fragmentShader) {
      console.error(`unable to create fragment shader`);
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

  static getStandardAttribLocation(gl: WebGL2Context, program: WebGLProgram) {
    const {
      normal: { name: norName },
      position: { name: posName },
      uv: { name: uvName },
    } = attributes;
    return {
      position: gl.getAttribLocation(program, posName),
      norm: gl.getAttribLocation(program, norName),
      uv: gl.getAttribLocation(program, uvName),
    };
  }

  static getStandardUniformLocation(
    gl: WebGL2Context,
    program: WebGLProgram
  ): StandardUniformLoc {
    return {
      perspective: gl.getUniformLocation(program, "uPMatrix")!,
      modalMatrix: gl.getUniformLocation(program, "uMVMatrix")!,
      cameraMatrix: gl.getUniformLocation(program, "uCameraMatrix")!,
      mainTexture: gl.getUniformLocation(program, "uMainTex")!,
    };
  }
}

export { ShaderUtil, Shader };
