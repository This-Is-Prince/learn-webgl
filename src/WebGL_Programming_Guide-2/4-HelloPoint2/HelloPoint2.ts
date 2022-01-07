import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import {
  getAttribLocation,
  getCanvasElement,
  getWebGLContext,
  initShaders,
  resizeDrawingBuffer,
} from "../utils";

window.addEventListener("load", () => {
  HelloPoint2();
});
const HelloPoint2 = () => {
  // Canvas
  const canvas = getCanvasElement("canvas");

  // WebGLRendering Context
  const gl = getWebGLContext(canvas);

  // Set the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Resize Drawing Buffer
  resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));

  // on Resize , resize drawing buffer and draw again
  window.addEventListener("resize", () => {
    // Resize Drawing Buffer
    resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));
    // Draw a Point
    draw(gl);
  });

  // Initialize Shaders
  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);

  // use this program
  gl.useProgram(program);

  // Get the storage location of attribute variable
  const a_Position = getAttribLocation(gl, program, "a_Position");
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  // Draw a point
  draw(gl);
};
const draw = (gl: WebGLRenderingContext) => {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Draw vertices
  gl.drawArrays(gl.POINTS, 0, 1);
};
