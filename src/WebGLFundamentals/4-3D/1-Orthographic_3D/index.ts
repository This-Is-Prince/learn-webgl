import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import * as dat from "dat.gui";

type Mat4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];
const m4 = {
  orthographicProjection: (
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number
  ): Mat4 => {
    return [
      [2 / (right - left), 0, 0, 0],
      [0, 2 / (top - bottom), 0, 0],
      [0, 0, 2 / (near - far), 0],
      [
        (left + right) / (left - right),
        (bottom + top) / (bottom - top),
        (near + far) / (near - far),
        1,
      ],
    ];
  },
  projection: (width: number, height: number, depth: number): Mat4 => {
    return [
      [2 / width, 0, 0, 0],
      [0, -2 / height, 0, 0],
      [0, 0, 2 / depth, 0],
      [-1, 1, 0, 1],
    ];
  },
  identity: (): Mat3 => {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  },
  translation: (tx: number, ty: number, tz: number): Mat4 => {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [tx, ty, tz, 1],
    ];
  },
  xRotation: (angleInRadians: number): Mat4 => {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
      [1, 0, 0, 0],
      [0, c, s, 0],
      [0, -s, c, 0],
      [0, 0, 0, 1],
    ];
  },
  yRotation: (angleInRadians: number): Mat4 => {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
      [c, 0, -s, 0],
      [0, 1, 0, 0],
      [s, 0, c, 0],
      [0, 0, 0, 1],
    ];
  },
  zRotation: (angleInRadians: number): Mat4 => {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
      [c, s, 0, 0],
      [-s, c, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  },
  scaling: (sx: number, sy: number, sz: number): Mat4 => {
    return [
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1],
    ];
  },
  multiply: (a: Mat4, b: Mat4): Mat4 => {
    const {
      "0": { "0": a00, "1": a01, "2": a02, "3": a03 },
      "1": { "0": a10, "1": a11, "2": a12, "3": a13 },
      "2": { "0": a20, "1": a21, "2": a22, "3": a23 },
      "3": { "0": a30, "1": a31, "2": a32, "3": a33 },
    } = a;
    const {
      "0": { "0": b00, "1": b01, "2": b02, "3": b03 },
      "1": { "0": b10, "1": b11, "2": b12, "3": b13 },
      "2": { "0": b20, "1": b21, "2": b22, "3": b23 },
      "3": { "0": b30, "1": b31, "2": b32, "3": b33 },
    } = b;

    return [
      [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      ],
      [
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      ],
      [
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      ],
      [
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
      ],
    ];
  },
  translate: (m: Mat4, tx: number, ty: number, tz: number): Mat4 => {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },
  xRotate: (m: Mat4, angleInRadians: number) => {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },
  yRotate: (m: Mat4, angleInRadians: number) => {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },
  zRotate: (m: Mat4, angleInRadians: number) => {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },
  scale: (m: Mat4, sx: number, sy: number, sz: number) => {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
};

/**
 * GUI
 */
const degToRad = (degree: number) => {
  return Math.PI * (degree / 180);
};
const parameters = {
  width: 100,
  height: 150,
  thickness: 30,
  translation: { x: 45, y: 150, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  rotation: { x: 40, y: 25, z: 325 },
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
      .add(parameters.translation, "z")
      .min(0)
      .max(400)
      .step(1)
      .name("translationZ")
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
      .add(parameters.scale, "z")
      .min(-5)
      .max(5)
      .step(0.001)
      .name("scaleZ")
      .onChange(drawScene),
    gui
      .add(parameters.rotation, "x")
      .min(0)
      .max(360)
      .step(1)
      .name("rotateX")
      .onChange(drawScene),
    gui
      .add(parameters.rotation, "y")
      .min(0)
      .max(360)
      .step(1)
      .name("rotateY")
      .onChange(drawScene),
    gui
      .add(parameters.rotation, "z")
      .min(0)
      .max(360)
      .step(1)
      .name("rotateZ")
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
  z: number,
  width: number,
  height: number,
  thickness: number
) => void;
const setFGeometry: SetFGeometryFunType = (
  gl,
  x,
  y,
  z,
  width,
  height,
  thickness
) => {
  const fVertices = [
    // left column front
    [x, y, z],
    [x, y + height, z],
    [x + thickness, y, z],
    [x, y + height, z],
    [x + thickness, y + height, z],
    [x + thickness, y, z],

    // top rung front
    [x + thickness, y, z],
    [x + thickness, y + thickness, z],
    [x + width, y, z],
    [x + thickness, y + thickness, z],
    [x + width, y + thickness, z],
    [x + width, y, z],

    // middle rung front
    [x + thickness, y + thickness * 2, z],
    [x + thickness, y + thickness * 3, z],
    [x + width * (2 / 3), y + thickness * 2, z],
    [x + thickness, y + thickness * 3, z],
    [x + width * (2 / 3), y + thickness * 3, z],
    [x + width * (2 / 3), y + thickness * 2, z],

    // left column back
    [x, y, z + thickness],
    [x + thickness, y, z + thickness],
    [x, y + height, z + thickness],
    [x, y + height, z + thickness],
    [x + thickness, y, z + thickness],
    [x + thickness, y + height, z + thickness],

    // top rung back
    [x + thickness, y, z + thickness],
    [x + width, y, z + thickness],
    [x + thickness, y + thickness, z + thickness],
    [x + thickness, y + thickness, z + thickness],
    [x + width, y, z + thickness],
    [x + width, y + thickness, z + thickness],

    // middle rung back
    [x + thickness, y + thickness * 2, z + thickness],
    [x + width * (2 / 3), y + thickness * 2, z + thickness],
    [x + thickness, y + thickness * 3, z + thickness],
    [x + thickness, y + thickness * 3, z + thickness],
    [x + width * (2 / 3), y + thickness * 2, z + thickness],
    [x + width * (2 / 3), y + thickness * 3, z + thickness],

    // top
    [x, y, z],
    [x + width, y, z],
    [x + width, y, z + thickness],
    [x, y, z],
    [x + width, y, z + thickness],
    [x, y, z + thickness],

    // top rung right
    [x + width, y, z],
    [x + width, y + thickness, z],
    [x + width, y + thickness, z + thickness],
    [x + width, y, z],
    [x + width, y + thickness, z + thickness],
    [x + width, y, z + thickness],

    // under top rung
    [x + thickness, y + thickness, z],
    [x + thickness, y + thickness, z + thickness],
    [x + width, y + thickness, z + thickness],
    [x + thickness, y + thickness, z],
    [x + width, y + thickness, z + thickness],
    [x + width, y + thickness, z],

    // between top rung and middle
    [x + thickness, y + thickness, z],
    [x + thickness, y + thickness * 2, z + thickness],
    [x + thickness, y + thickness, z + thickness],
    [x + thickness, y + thickness, z],
    [x + thickness, y + thickness * 2, z],
    [x + thickness, y + thickness * 2, z + thickness],

    // top of middle rung
    [x + thickness, y + thickness * 2, z],
    [x + width * (2 / 3), y + thickness * 2, z + thickness],
    [x + thickness, y + thickness * 2, z + thickness],
    [x + thickness, y + thickness * 2, z],
    [x + width * (2 / 3), y + thickness * 2, z],
    [x + width * (2 / 3), y + thickness * 2, z + thickness],

    // right of middle rung
    [x + width * (2 / 3), y + thickness * 2, z],
    [x + width * (2 / 3), y + thickness * 3, z + thickness],
    [x + width * (2 / 3), y + thickness * 2, z + thickness],
    [x + width * (2 / 3), y + thickness * 2, z],
    [x + width * (2 / 3), y + thickness * 3, z],
    [x + width * (2 / 3), y + thickness * 3, z + thickness],

    // bottom of middle rung.
    [x + thickness, y + thickness * 3, z],
    [x + thickness, y + thickness * 3, z + thickness],
    [x + width * (2 / 3), y + thickness * 3, z + thickness],
    [x + thickness, y + thickness * 3, z],
    [x + width * (2 / 3), y + thickness * 3, z + thickness],
    [x + width * (2 / 3), y + thickness * 3, z],

    // right of bottom
    [x + thickness, y + thickness * 3, z],
    [x + thickness, y + height, z + thickness],
    [x + thickness, y + thickness * 3, z + thickness],
    [x + thickness, y + thickness * 3, z],
    [x + thickness, y + height, z],
    [x + thickness, y + height, z + thickness],

    // bottom
    [x, y + height, z],
    [x, y + height, z + thickness],
    [x + thickness, y + height, z + thickness],
    [x, y + height, z],
    [x + thickness, y + height, z + thickness],
    [x + thickness, y + height, z],

    // left side
    [x, y, z],
    [x, y, z + thickness],
    [x, y + height, z + thickness],
    [x, y, z],
    [x, y + height, z + thickness],
    [x, y + height, z],
  ];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
      fVertices.reduce((prevValue, currValue) => {
        prevValue.push(currValue[0]);
        prevValue.push(currValue[1]);
        prevValue.push(currValue[2]);
        return prevValue;
      }, [])
    ),
    gl.STATIC_DRAW
  );
};
const setColors = (gl: WebGLRenderingContext) => {
  const colors = new Uint8Array(16 * 2 * 3 * 3);
  for (let i = 0; i < 16; i++) {
    const r = Math.random() * 256;
    const g = Math.random() * 256;
    const b = Math.random() * 256;
    for (let j = 0; j < 6; j++) {
      colors[i * 6 * 3 + j * 3] = r;
      colors[i * 6 * 3 + j * 3 + 1] = g;
      colors[i * 6 * 3 + j * 3 + 2] = b;
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
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
const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

/**
 * Creating Buffer for attributes
 */
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const { width, height, thickness } = parameters;
setFGeometry(gl, 0, 0, 0, width, height, thickness);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
setColors(gl);

/**
 * Location of uniforms
 */
const colorUniformLocation = gl.getUniformLocation(program, "u_color");
const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

const drawScene = () => {
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  // to tell GLSL how to change clipSpace values to pixels
  gl.viewport(0, 0, canvas.width, canvas.height);

  // it sets color for when you call glClear.
  // gl.clearColor(1.0, 1.0, 0, 1.0);
  //   gl.clearColor(0, 0, 0, 0);
  // it takes the color you specified above and fill canvas with that color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // use this program
  gl.useProgram(program);

  /**
   * Binding Data to attribute
   */
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(
    colorAttributeLocation,
    3,
    gl.UNSIGNED_BYTE,
    true,
    0,
    0
  );

  gl.uniform4f(
    colorUniformLocation,
    Math.random(),
    Math.random(),
    Math.random(),
    1.0
  );

  /**
   * Compute the matrices
   */
  const { translation, rotation, scale } = parameters;
  // let matrix = m4.projection(canvas.width, canvas.height, 400);
  let matrix = m4.orthographicProjection(
    0,
    canvas.clientWidth,
    0,
    canvas.clientHeight,
    400,
    -400
  );
  matrix = m4.translate(matrix, translation.x, translation.y, translation.z);
  matrix = m4.xRotate(matrix, degToRad(rotation.x));
  matrix = m4.yRotate(matrix, degToRad(rotation.y));
  matrix = m4.zRotate(matrix, degToRad(rotation.z));
  matrix = m4.scale(matrix, scale.x, scale.y, scale.z);

  gl.uniformMatrix4fv(
    matrixUniformLocation,
    false,
    matrix.reduce((prevValue: number[], currValue) => {
      prevValue.push(currValue[0]);
      prevValue.push(currValue[1]);
      prevValue.push(currValue[2]);
      prevValue.push(currValue[3]);
      return prevValue;
    }, [])
  );
  gl.drawArrays(gl.TRIANGLES, 0, 16 * 2 * 3);
};
drawScene();
// create all controllers
createControllers(gui);
