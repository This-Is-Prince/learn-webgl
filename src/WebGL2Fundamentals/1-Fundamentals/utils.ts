class ShaderUtils {
  private constructor() {}

  static createShader(
    gl: WebGL2RenderingContext,
    type: number,
    source: string
  ): WebGLShader {
    const shader = gl.createShader(type) as WebGLShader;
    if (!shader) {
      throw new Error(`Unable to create shader....`);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const shaderInfoLog = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Unable to compile shader, ${shaderInfoLog}`);
    }
    return shader;
  }

  static createProgram(
    gl: WebGL2RenderingContext,
    vShader: WebGLShader,
    fShader: WebGLShader
  ): WebGLProgram {
    const program = gl.createProgram() as WebGLProgram;
    if (!program) {
      throw new Error(`Unable to create program....`);
    }
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const programInfoLog = gl.getProgramInfoLog(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteProgram(program);
      throw new Error(`Unable to link program, ${programInfoLog}`);
    }
    return program;
  }

  static getProgramFromText(
    gl: WebGL2RenderingContext,
    vSource: string,
    fSource: string
  ): WebGLProgram {
    const vertex = ShaderUtils.createShader(gl, gl.VERTEX_SHADER, vSource);
    const fragment = ShaderUtils.createShader(gl, gl.FRAGMENT_SHADER, fSource);
    const program = ShaderUtils.createProgram(gl, vertex, fragment);
    return program;
  }

  static getContext(id: string): WebGL2RenderingContext {
    let canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = id;
      document.body.appendChild(canvas);
    }
    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    if (!gl) {
      throw new Error(`webgl2 is not supported`);
    }
    return gl;
  }

  static setSize(gl: WebGL2RenderingContext, width: number, height: number) {
    if (width < 0 || height < 0) {
      throw new Error(`width or height can't be negative`);
    }
    gl.canvas.style.width = width + "px";
    gl.canvas.style.height = height + "px";
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}
export { ShaderUtils };
