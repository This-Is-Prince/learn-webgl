import { WebGL2Context } from "../lib";

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
      return null;
    }
    return ShaderUtil.createProgram(
      gl,
      vertexShader,
      fragmentShader,
      doValidate
    );
  }
}

export { ShaderUtil };
