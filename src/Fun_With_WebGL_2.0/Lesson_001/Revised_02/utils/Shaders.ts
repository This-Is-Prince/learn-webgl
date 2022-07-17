import { WebGL2Context } from "./types";

class ShaderUtil {
  static createShader(gl: WebGL2Context, src: string, type: number) {
    const shader = gl.createShader(type)!;
    if (!shader) {
      console.error("Error creating shader.");
    }
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    // Get Error data if shader failed compiling
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "Error compiling shader : " + src,
        gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  static createProgram(
    gl: WebGL2Context,
    vShader: WebGLShader,
    fShader: WebGLShader,
    doValidate: boolean
  ) {
    // Link shaders together
    const prog = gl.createProgram()!;
    if (!prog) {
      console.error("Error creating program.");
    }
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);

    // Check if successful
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(
        "Error creating shader program.",
        gl.getProgramInfoLog(prog)
      );
      gl.deleteProgram(prog);
      return null;
    }

    // Only do this for additional debugging.
    if (doValidate) {
      gl.validateProgram(prog);
      if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
        console.error("Error validating program", gl.getProgramInfoLog(prog));
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
}

export { ShaderUtil };
