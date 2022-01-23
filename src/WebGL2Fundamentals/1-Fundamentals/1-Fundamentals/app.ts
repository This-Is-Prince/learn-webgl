import { ShaderUtils } from "../utils";
import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";

window.addEventListener("load", () => {
  startFundamentals();
});

const startFundamentals = () => {
  // WebGL2
  const gl = ShaderUtils.getContext("canvas");

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  ShaderUtils.setSize(gl, 500, 500);

  // Program
  const program = ShaderUtils.getProgramFromText(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );

  gl.useProgram(program);
  const vertices = [0, 0, 0, 0.5, 0.5, 0];

  const a_position = gl.getAttribLocation(program, "a_position");

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
