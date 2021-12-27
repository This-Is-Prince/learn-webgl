type Mat4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];
type Identity = () => Mat4;
type Multiply = (a: Mat4, b: Mat4) => Mat4;
type Scaling = (sx: number, sy: number, sz: number) => Mat4;
type Translation = (tx: number, ty: number, tz: number) => Mat4;
type XRotation = (angleInRadian: number) => Mat4;
type YRotation = (angleInRadian: number) => Mat4;
type ZRotation = (angleInRadian: number) => Mat4;
type XRotate = (matrix: Mat4, angleInDegree: number) => Mat4;
type YRotate = (matrix: Mat4, angleInDegree: number) => Mat4;
type ZRotate = (matrix: Mat4, angleInDegree: number) => Mat4;
type Translate = (matrix: Mat4, tx: number, ty: number, tz: number) => Mat4;
type Scale = (matrix: Mat4, sx: number, sy: number, sz: number) => Mat4;
type xShearing = (shearValue: number) => Mat4;
type Mat4x4To1x16 = (matrix: Mat4) => number[];
type OrthographicProjection = (
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number
) => Mat4;
type PerspectiveProjection = (
  fov: number,
  aspect: number,
  near: number,
  far: number
) => Mat4;

interface M4 {
  identity: Identity;
  multiply: Multiply;
  scaling: Scaling;
  translation: Translation;
  xRotation: XRotation;
  yRotation: YRotation;
  zRotation: ZRotation;
  xRotate: XRotate;
  yRotate: YRotate;
  zRotate: ZRotate;
  translate: Translate;
  scale: Scale;
  mat4x4To1x16: Mat4x4To1x16;
  orthographicProjection: OrthographicProjection;
  perspectiveProjection: PerspectiveProjection;
}

type DegreeToRadian = (angleInDegree: number) => number;
const degreeToRadian: DegreeToRadian = (angleInDegree) => {
  return angleInDegree * (Math.PI / 180);
};

const m4: M4 = {
  identity: () => {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  },
  multiply: (a, b) => {
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
  scaling: (sx, sy, sz) => {
    return [
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1],
    ];
  },
  translation: (tx, ty, tz) => {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [tx, ty, tz, 1],
    ];
  },
  xRotation: (angleInRadian) => {
    const c = Math.cos(angleInRadian);
    const s = Math.sin(angleInRadian);
    return [
      [1, 0, 0, 0],
      [0, c, -s, 0],
      [0, s, c, 0],
      [0, 0, 0, 1],
    ];
  },
  yRotation: (angleInRadian) => {
    const c = Math.cos(angleInRadian);
    const s = Math.sin(angleInRadian);
    return [
      [c, 0, -s, 0],
      [0, 1, 0, 0],
      [s, 0, c, 0],
      [0, 0, 0, 1],
    ];
  },
  zRotation: (angleInRadian) => {
    const c = Math.cos(angleInRadian);
    const s = Math.sin(angleInRadian);
    return [
      [c, -s, 0, 0],
      [s, c, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  },
  xRotate: (matrix, angleInDegree) => {
    const angleInRadian = degreeToRadian(angleInDegree);
    return m4.multiply(matrix, m4.xRotation(angleInRadian));
  },
  yRotate: (matrix, angleInDegree) => {
    const angleInRadian = degreeToRadian(angleInDegree);
    return m4.multiply(matrix, m4.yRotation(angleInRadian));
  },
  zRotate: (matrix, angleInDegree) => {
    const angleInRadian = degreeToRadian(angleInDegree);
    return m4.multiply(matrix, m4.zRotation(angleInRadian));
  },
  translate: (matrix, tx, ty, tz) => {
    return m4.multiply(matrix, m4.translation(tx, ty, tz));
  },
  scale: (matrix, sx, sy, sz) => {
    return m4.multiply(matrix, m4.scaling(sx, sy, sz));
  },
  mat4x4To1x16: (matrix) => {
    let mat1x16: number[] = [];
    return matrix.reduce((prevValue, currValue) => {
      prevValue.push(currValue[0]);
      prevValue.push(currValue[1]);
      prevValue.push(currValue[2]);
      prevValue.push(currValue[3]);
      return prevValue;
    }, mat1x16);
  },
  orthographicProjection: (left, right, top, bottom, near, far) => {
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
  perspectiveProjection: (fov, aspect, near, far) => {
    fov = degreeToRadian(fov);
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const rangeInv = 1.0 / (near - far);
    return [
      [f / aspect, 0, 0, 0],
      [0, f, 0, 0],
      [0, 0, (near + far) * rangeInv, -1],
      [0, 0, near * far * rangeInv * 2, 0],
    ];
  },
};

export default m4;
