import { Matrix4 } from "../../matrix4";
import { createProgram, createShader } from "../../utils";
import { PerspectiveCamera } from "../Camera/PerspectiveCamera";
import { Scene } from "../Scene/Scene";

interface RendererParam {
  canvas: HTMLCanvasElement;
  vertexShaderSource: string;
  fragmentShaderSource: string;
}

class Renderer {
  private canvas: HTMLCanvasElement;
  public gl: WebGLRenderingContext;
  private perspectiveMatrixLocation: WebGLUniformLocation;
  private perspectiveMatrix: Matrix4;
  private viewMatrixLocation: WebGLUniformLocation;
  private viewMatrix: Matrix4;
  private modelMatrixLocation: WebGLUniformLocation;
  private modelMatrix: Matrix4;
  private normalMatrixLocation: WebGLUniformLocation;
  private normalMatrix: Matrix4;
  public program: WebGLProgram;

  constructor(param: RendererParam) {
    if (!param.canvas) {
      throw new Error(`can't get canvas element`);
    }
    this.canvas = param.canvas;
    this.gl = this.canvas.getContext("webgl") as WebGLRenderingContext;
    if (!this.gl) {
      throw new Error(`webgl is not supported`);
    }

    /**
     * Create Program
     */
    const vertexShader = createShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      param.vertexShaderSource
    );
    const fragmentShader = createShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      param.fragmentShaderSource
    );
    this.program = createProgram(this.gl, vertexShader, fragmentShader);

    /**
     * Create Matrix
     */
    this.perspectiveMatrixLocation = this.gl.getUniformLocation(
      this.program,
      "perspectiveMatrix"
    ) as WebGLUniformLocation;
    this.perspectiveMatrix = new Matrix4();

    this.viewMatrixLocation = this.gl.getUniformLocation(
      this.program,
      "viewMatrix"
    ) as WebGLUniformLocation;
    this.viewMatrix = new Matrix4();

    this.modelMatrixLocation = this.gl.getUniformLocation(
      this.program,
      "modelMatrix"
    ) as WebGLUniformLocation;
    this.modelMatrix = new Matrix4();

    this.normalMatrixLocation = this.gl.getUniformLocation(
      this.program,
      "normalMatrix"
    ) as WebGLUniformLocation;
    this.normalMatrix = new Matrix4();
    this.gl.useProgram(this.program);
  }

  setPixelRatio(ratio: number) {
    const { clientWidth, clientHeight } = this.canvas;
    this.canvas.width = (clientWidth * ratio) | 0;
    this.canvas.height = (clientHeight * ratio) | 0;
  }
  setSize(width: number, height: number) {
    this.gl.viewport(0, 0, width, height);
  }
  setClearColor(r: number, g: number, b: number, a: number) {
    if (r > 1 || g > 1 || b > 1 || a > 1 || r < 0 || g < 0 || b < 0 || a < 0) {
      throw new Error(`color component must be btw 0 and 1`);
    }
    this.gl.clearColor(r, g, b, a);
  }
  render(camera: PerspectiveCamera, scene: Scene) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const { aspect, far, fov, near, position, target, up } = camera;

    this.viewMatrix.setLookAt(position, target, up);
    this.perspectiveMatrix.setPerspective(fov, aspect, near, far);

    this.gl.uniformMatrix4fv(
      this.perspectiveMatrixLocation,
      false,
      this.perspectiveMatrix.elements
    );
    this.gl.uniformMatrix4fv(
      this.viewMatrixLocation,
      false,
      this.viewMatrix.elements
    );
    scene.draw(this.gl, {
      model: {
        matrix: this.modelMatrix,
        matrixLocation: this.modelMatrixLocation,
      },
      normal: {
        matrix: this.normalMatrix,
        matrixLocation: this.normalMatrixLocation,
      },
    });
  }
}

export { Renderer };
