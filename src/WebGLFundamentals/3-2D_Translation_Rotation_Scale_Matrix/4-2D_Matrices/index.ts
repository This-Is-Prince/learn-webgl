import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import * as dat from "dat.gui";

type Mat3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];
const m3 = {
  translation: (tx: number, ty: number): Mat3 => {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [tx, ty, 1],
    ];
  },
  rotation: (angleInRadians: number, clockWise?: boolean): Mat3 => {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    if (clockWise) {
      return [
        [c, s, 0],
        [-s, c, 0],
        [0, 0, 1],
      ];
    } else {
      return [
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1],
      ];
    }
  },
  scaling: (sx: number, sy: number): Mat3 => {
    return [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ];
  },
  multiply: (a: Mat3, b: Mat3): Mat3 => {
    const {
      "0": { "0": a00, "1": a01, "2": a02 },
      "1": { "0": a10, "1": a11, "2": a12 },
      "2": { "0": a20, "1": a21, "2": a22 },
    } = a;
    const {
      "0": { "0": b00, "1": b01, "2": b02 },
      "1": { "0": b10, "1": b11, "2": b12 },
      "2": { "0": b20, "1": b21, "2": b22 },
    } = b;

    return [
      [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
      ],
      [
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
      ],
      [
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
      ],
    ];
  },
};

/**
 * GUI
 */
const parameters = {
  width: 100,
  height: 150,
  thickness: 30,
  translation: { x: 0, y: 0 },
  scale: { x: 1, y: 1 },
  angle: 0,
};
let controllers: dat.GUIController[] = [];
const gui = new dat.GUI();
const createControllers = (gui: dat.GUI) => {
  controllers.forEach((controller) => {
    if (controller) {
      gui.remove(controller);
    }
  });
  controllers = [];

  controllers.push(
    gui
      .add(parameters.translation, "x")
      .min(0)
      .max(canvas.width - parameters.width)
      .step(1)
      .name("translationX")
      .onChange(drawScene),
    gui
      .add(parameters.translation, "y")
      .min(0)
      .max(canvas.height - parameters.height)
      .step(1)
      .name("translationY")
      .onChange(drawScene),
    gui
      .add(parameters.scale, "x")
      .min(-5)
      .max(5)
      .step(0.001)
      .name("scaleX")
      .onChange(drawScene),
    gui
      .add(parameters.scale, "y")
      .min(-5)
      .max(5)
      .step(0.001)
      .name("scaleY")
      .onChange(drawScene),
    gui
      .add(parameters, "angle")
      .min(0)
      .max(2 * Math.PI)
      .step(0.001)
      .onChange(drawScene)
  );
};

/**
 * Create Shader Function
 */
type CreateShaderFunType = (
  gl: WebGLRenderingContext,
  shaderType: number,
  shaderSource: string
) => WebGLShader;

const createShader: CreateShaderFunType = (gl, shaderType, shaderSource) => {
  const shader = gl.createShader(shaderType) as WebGLShader;
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const shaderInfoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader is not compiled : ${shaderInfoLog}`);
  }
  return shader;
};

/**
 * Create Program Fun Type
 */
type CreateProgramFunType = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => WebGLProgram;
const createProgram: CreateProgramFunType = (
  gl,
  vertexShader,
  fragmentShader
) => {
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const programInfoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`program is not created : ${programInfoLog}`);
  }
  return program;
};

/**
 * Window Events
 */
window.addEventListener("resize", () => {
  updateCanvasSize(canvas);
  createControllers(gui);
  drawScene();
});

type SetFGeometryFunType = (
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number,
  thickness: number
) => void;
const setFGeometry: SetFGeometryFunType = (
  gl,
  x,
  y,
  width,
  height,
  thickness
) => {
  const fVertices = [
    // -----left column
    // left triangle
    [x, y],
    [x + thickness, y],
    [x, y + height],
    // right triangle
    [x, y + height],
    [x + thickness, y],
    [x + thickness, y + height],

    // -----upper rung
    // left triangle
    [x + thickness, y],
    [x + width, y],
    [x + thickness, y + thickness],
    // right triangle
    [x + thickness, y + thickness],
    [x + width, y],
    [x + width, y + thickness],

    // -----middle rung
    // left triangle
    [x + thickness, y + thickness * 2],
    [x + width * (2 / 3), y + thickness * 2],
    [x + thickness, y + thickness * 3],
    // right triangle
    [x + thickness, y + thickness * 3],
    [x + width * (2 / 3), y + thickness * 2],
    [x + width * (2 / 3), y + thickness * 3],
  ];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
      fVertices.reduce((prevValue, currValue) => {
        prevValue.push(currValue[0]);
        prevValue.push(currValue[1]);
        return prevValue;
      }, [])
    ),
    gl.STATIC_DRAW
  );
};

/**
 * Canvas
 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const updateCanvasSize = (canvas: HTMLCanvasElement) => {
  const { clientWidth, clientHeight } = canvas;
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};
updateCanvasSize(canvas);

/**
 * WebGL Rendering Context
 */
const gl = canvas.getContext("webgl");
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
 * Location of attributes
 */
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

/**
 * Creating Buffer for attributes
 */
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const { width, height, thickness } = parameters;
setFGeometry(gl, 0, 0, width, height, thickness);

/**
 * Location of uniforms
 */
const resolutionUniformLocation = gl.getUniformLocation(
  program,
  "u_resolution"
);
const colorUniformLocation = gl.getUniformLocation(program, "u_color");
const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

/**
 * Draw Scene
 */
const drawScene = () => {
  // to tell GLSL how to change clipSpace values to pixels
  gl.viewport(0, 0, canvas.width, canvas.height);

  // it sets color for when you call glClear.
  // gl.clearColor(1.0, 1.0, 0, 1.0);
  gl.clearColor(0, 0, 0, 0);
  // it takes the color you specified above and fill canvas with that color
  gl.clear(gl.COLOR_BUFFER_BIT);
  // use this program
  gl.useProgram(program);

  /**
   * Binding Data to attribute
   */
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  /**
   * Compute the matrices
   */
  const { translation, angle, scale } = parameters;
  const translationMatrix = m3.translation(translation.x, translation.y);
  const rotationMatrix = m3.rotation(angle, true);
  const scaleMatrix = m3.scaling(scale.x, scale.y);
  // Multiply the matrices
  let matrix = m3.multiply(translationMatrix, rotationMatrix);
  matrix = m3.multiply(matrix, scaleMatrix);

  /**
   * Binding Data to uniform
   */
  gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
  gl.uniform4f(
    colorUniformLocation,
    Math.random(),
    Math.random(),
    Math.random(),
    1.0
  );
  gl.uniformMatrix3fv(
    matrixUniformLocation,
    false,
    matrix.reduce((prevValue: number[], currValue) => {
      prevValue.push(currValue[0]);
      prevValue.push(currValue[1]);
      prevValue.push(currValue[2]);
      return prevValue;
    }, [])
  );
  gl.drawArrays(gl.TRIANGLES, 0, 18);
};
drawScene();
// create all controllers
createControllers(gui);
