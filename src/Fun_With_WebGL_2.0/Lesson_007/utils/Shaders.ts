import { StandardAttribLoc, StandardUniformLoc, WebGL2Context } from "../lib";
import { Modal } from "../Modal/Modal";
import { Indices, Vertices } from "../primitives/Mesh";
import {
  NORMAL_LOCATION,
  NORMAL_NAME,
  POSITION_LOCATION,
  POSITION_NAME,
  UV_LOCATION,
  UV_NAME,
} from "./Constants";

class Shader {
  public gl!: WebGL2Context;
  public program!: WebGLProgram;
  public attribLocs!: StandardAttribLoc;
  public uniformLocs!: StandardUniformLoc;
  constructor(gl: WebGL2Context, vShaderSrc: string, fShaderSrc: string) {
    this.program = ShaderUtils.createProgramFromText(
      gl,
      vShaderSrc,
      fShaderSrc,
      true
    )!;

    if (this.program) {
      this.gl = gl;
      this.gl.useProgram(this.program);

      this.attribLocs = ShaderUtils.getStandardAttribLocation(
        this.gl,
        this.program
      );
      this.uniformLocs = ShaderUtils.getStandardUniformLocation(
        this.gl,
        this.program
      );
    } else {
      console.error(`unable to create shader program from text`);
    }
  }

  // Methods
  activate(): Shader {
    this.gl.useProgram(this.program);
    return this;
  }

  deactivate(): Shader {
    this.gl.useProgram(null);
    return this;
  }

  dispose(): Shader {
    if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
      this.gl.useProgram(null);
    }
    this.gl.deleteProgram(this.program);
    return this;
  }

  setPerspectiveMatrix(matData: Float32Array): Shader {
    this.gl.uniformMatrix4fv(this.uniformLocs.perspective, false, matData);
    return this;
  }

  setModalMatrix(matData: Float32Array): Shader {
    this.gl.uniformMatrix4fv(this.uniformLocs.modalMatrix, false, matData);
    return this;
  }

  setCameraMatrix(matData: Float32Array): Shader {
    this.gl.uniformMatrix4fv(this.uniformLocs.cameraMatrix, false, matData);
    return this;
  }

  preRender() {}

  renderModal(modal: Modal): Shader {
    this.setModalMatrix(modal.transform.getViewMatrix());
    this.gl.bindVertexArray(modal.mesh.vao);

    const { attributes, drawMode } = modal.mesh;
    if (attributes.indices && attributes.indices instanceof Indices) {
      this.gl.drawElements(
        drawMode,
        attributes.indices.count,
        this.gl.UNSIGNED_SHORT,
        0
      );
    } else if (attributes.vertices && attributes.vertices instanceof Vertices) {
      this.gl.drawArrays(drawMode, 0, attributes.vertices.count);
    }

    this.gl.bindVertexArray(null);

    return this;
  }
}

class ShaderUtils {
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

    gl.bindAttribLocation(program, POSITION_LOCATION, POSITION_NAME);
    gl.bindAttribLocation(program, NORMAL_LOCATION, NORMAL_NAME);
    gl.bindAttribLocation(program, UV_LOCATION, UV_NAME);

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
    const vertexShader = ShaderUtils.createShader(
      gl,
      vertexShaderSource,
      gl.VERTEX_SHADER
    ) as WebGLShader;
    if (!vertexShader) {
      console.error(`unable to create vertex shader`);
      return null;
    }
    const fragmentShader = ShaderUtils.createShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    ) as WebGLShader;
    if (!fragmentShader) {
      console.error(`unable to create fragment shader`);
      gl.deleteShader(vertexShader);
      return null;
    }
    return ShaderUtils.createProgram(
      gl,
      vertexShader,
      fragmentShader,
      doValidate
    );
  }

  static getStandardAttribLocation(
    gl: WebGL2Context,
    program: WebGLProgram
  ): StandardAttribLoc {
    const position = gl.getAttribLocation(program, POSITION_NAME);
    if (position < 0) {
      console.error(`unable to get ${POSITION_NAME} attribute location`);
    }

    const norm = gl.getAttribLocation(program, NORMAL_NAME);
    if (norm < 0) {
      console.error(`unable to get ${NORMAL_NAME} attribute location`);
    }

    const uv = gl.getAttribLocation(program, UV_NAME);
    if (uv < 0) {
      console.error(`unable to get ${UV_NAME} attribute location`);
    }

    return {
      position,
      norm,
      uv,
    };
  }

  static getStandardUniformLocation(
    gl: WebGL2Context,
    program: WebGLProgram
  ): StandardUniformLoc {
    const perspective = gl.getUniformLocation(program, "uPMatrix");
    if (!perspective) {
      console.error(`unable to get "uPMatrix" uniform location`);
    }

    const modalMatrix = gl.getUniformLocation(program, "uMVMatrix");
    if (!modalMatrix) {
      console.error(`unable to get "uMVMatrix" uniform location`);
    }

    const cameraMatrix = gl.getUniformLocation(program, "uCameraMatrix");
    if (!cameraMatrix) {
      console.error(`unable to get "uCameraMatrix" uniform location`);
    }

    const mainTexture = gl.getUniformLocation(program, "uMainTex");
    if (!mainTexture) {
      console.error(`unable to get "uMainTex" uniform location`);
    }
    return {
      perspective,
      modalMatrix,
      cameraMatrix,
      mainTexture,
    };
  }
}
export { Shader, ShaderUtils };
