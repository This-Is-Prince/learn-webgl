import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import {
  getAttribLocation,
  getCanvasElement,
  getWebGLContext,
  initShaders,
  resizeDrawingBuffer,
} from "../utils";

interface Point2D {
  x: number;
  y: number;
}

window.addEventListener("load", () => {
  ClickedPoints();
});
const ClickedPoints = () => {
  // Canvas
  const canvas = getCanvasElement("canvas");

  // WebGLRenderingContext
  const gl = getWebGLContext(canvas);
  // Resize Drawing Buffer
  resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));
  window.addEventListener("resize", () => {
    resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));
    drawPoints(gl, a_Position, points);
  });
  gl.clearColor(0, 0, 0, 1);

  // initialize shaders
  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  // attribute location
  const a_Position = getAttribLocation(gl, program, "a_Position");
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

  // Points
  const points: Point2D[] = [];
  canvas.addEventListener("click", function (ev) {
    const { clientX, clientY } = ev;
    const x = (clientX / this.clientWidth) * 2 - 1;
    const y = -((clientY / this.clientHeight) * 2 - 1);
    points.push({ x, y });
    drawPoints(gl, a_Position, points);
  });
  drawPoints(gl, a_Position, points);
};

type DrawPoints = (
  gl: WebGLRenderingContext,
  attribLoc: number,
  points: Point2D[]
) => void;
const drawPoints: DrawPoints = (gl, attribLoc, points) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  points.forEach(({ x, y }) => {
    gl.vertexAttrib2f(attribLoc, x, y);
    gl.drawArrays(gl.POINTS, 0, 1);
  });
};
