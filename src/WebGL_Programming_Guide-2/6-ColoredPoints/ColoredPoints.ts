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
interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

window.addEventListener("load", () => {
  ColoredPoints();
});

const ColoredPoints = () => {
  // Canvas
  const canvas = getCanvasElement("canvas");

  // WebGLRenderingContext
  const gl = getWebGLContext(canvas);
  resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));
  gl.clearColor(0, 0, 0, 1);
  window.addEventListener("resize", () => {
    resizeDrawingBuffer(gl, Math.min(window.devicePixelRatio, 2));
    drawPoints(gl, points, a_Position, colors, a_Color);
  });

  // initialize shaders
  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  // points
  const points: Point2D[] = [];
  const colors: Color[] = [];

  canvas.addEventListener("click", function (ev) {
    const { clientX, clientY } = ev;
    const { clientWidth, clientHeight } = this;
    const x = (clientX / clientWidth) * 2 - 1;
    const y = -((clientY / clientHeight) * 2 - 1);
    points.push({ x, y });
    colors.push({
      r: Math.random(),
      g: Math.random(),
      b: Math.random(),
      a: 1.0,
    });
    drawPoints(gl, points, a_Position, colors, a_Color);
  });

  // a_Position location
  const a_Position = getAttribLocation(gl, program, "a_Position");

  // a_Color location
  const a_Color = getAttribLocation(gl, program, "a_Color");

  // u_Color location
  //   const u_Color = getUniformLocation(gl, program, "u_Color");

  drawPoints(gl, points, a_Position, colors, a_Color);
};

type DrawPoints = (
  gl: WebGLRenderingContext,
  points: Point2D[],
  pointAttribLoc: number,
  colors: Color[],
  colorAttribLoc: number
) => void;
const drawPoints: DrawPoints = (
  gl,
  points,
  pointAttribLoc,
  colors,
  colorAttribLoc
) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  points.forEach(({ x, y }, index) => {
    const { r, g, b, a } = colors[index];
    gl.vertexAttrib4f(colorAttribLoc, r, g, b, a);
    gl.vertexAttrib2f(pointAttribLoc, x, y);
    gl.drawArrays(gl.POINTS, 0, 1);
  });
};
