import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { createProgram, createShader } from "../utils";

window.addEventListener("load", () => {
  // multiAttributeSize();
  // multiAttributeSize_Interleaved();
  multiAttributeColor();
});

const updateCanvasResolution = (
  canvas: HTMLCanvasElement,
  pixelRatio: number
) => {
  const { clientHeight, clientWidth } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

const multiAttributeColor = () => {
  /**
   * Canvas
   */
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));

  /**
   * WebGL Rendering Context
   */
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  if (!gl) {
    throw new Error(`webgl is not supported`);
  }

  /**
   * Shaders
   */
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  /**
   * Program
   */
  const program = createProgram(gl, vertexShader, fragmentShader);

  /**
   * a_Position Location
   */
  const vertexSizeBuffer = gl.createBuffer();
  const a_Position = gl.getAttribLocation(program, "a_Position");
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
  const verticesSizes = new Float32Array([
    0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0, 0.0, 1.0,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

  /**
   * a_PointSize Location
   */
  const a_Color = gl.getAttribLocation(program, "a_Color");

  gl.useProgram(program);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.width);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
  const FSIZE = verticesSizes.BYTES_PER_ELEMENT;

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);

  gl.drawArrays(gl.TRIANGLES, 0, verticesSizes.length / 5);
};

// const multiAttributeSize_Interleaved = () => {
//   /**
//    * Canvas
//    */
//   const canvas = document.getElementById("canvas") as HTMLCanvasElement;
//   updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));

//   /**
//    * WebGL Rendering Context
//    */
//   const gl = canvas.getContext("webgl") as WebGLRenderingContext;
//   if (!gl) {
//     throw new Error(`webgl is not supported`);
//   }

//   /**
//    * Shaders
//    */
//   const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
//   const fragmentShader = createShader(
//     gl,
//     gl.FRAGMENT_SHADER,
//     fragmentShaderSource
//   );

//   /**
//    * Program
//    */
//   const program = createProgram(gl, vertexShader, fragmentShader);

//   /**
//    * a_Position Location
//    */
//   const vertexSizeBuffer = gl.createBuffer();
//   const a_Position = gl.getAttribLocation(program, "a_Position");
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
//   const verticesSizes = new Float32Array([
//     0, 0.5, 10, -0.5, -0.5, 20, 0.5, -0.5, 30,
//   ]);
//   gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

//   /**
//    * a_PointSize Location
//    */
//   const a_PointSize = gl.getAttribLocation(program, "a_PointSize");

//   gl.useProgram(program);
//   gl.viewport(0, 0, gl.canvas.width, gl.canvas.width);
//   gl.clearColor(0, 0, 0, 1);
//   gl.clear(gl.COLOR_BUFFER_BIT);

//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
//   const FSIZE = verticesSizes.BYTES_PER_ELEMENT;

//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
//   gl.enableVertexAttribArray(a_Position);

//   gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
//   gl.enableVertexAttribArray(a_PointSize);

//   gl.drawArrays(gl.POINTS, 0, verticesSizes.length / 3);
// };

// const multiAttributeSize = () => {
//   /**
//    * Canvas
//    */
//   const canvas = document.getElementById("canvas") as HTMLCanvasElement;
//   updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));

//   /**
//    * WebGL Rendering Context
//    */
//   const gl = canvas.getContext("webgl") as WebGLRenderingContext;
//   if (!gl) {
//     throw new Error(`webgl is not supported`);
//   }

//   /**
//    * Shaders
//    */
//   const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
//   const fragmentShader = createShader(
//     gl,
//     gl.FRAGMENT_SHADER,
//     fragmentShaderSource
//   );

//   /**
//    * Program
//    */
//   const program = createProgram(gl, vertexShader, fragmentShader);

//   /**
//    * a_Position Location
//    */
//   const a_Position = gl.getAttribLocation(program, "a_Position");
//   const positionBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//   const vertices = [0, 0.5, -0.5, -0.5, 0.5, -0.5];
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//   /**
//    * a_PointSize Location
//    */
//   const a_PointSize = gl.getAttribLocation(program, "a_PointSize");
//   const pointBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
//   const verticesSize = [10, 20, 35];
//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array(verticesSize),
//     gl.STATIC_DRAW
//   );

//   gl.useProgram(program);
//   gl.viewport(0, 0, gl.canvas.width, gl.canvas.width);
//   gl.clearColor(0, 0, 0, 1);
//   gl.clear(gl.COLOR_BUFFER_BIT);

//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_Position);

//   gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
//   gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_PointSize);

//   gl.drawArrays(gl.POINTS, 0, verticesSize.length);
// };
