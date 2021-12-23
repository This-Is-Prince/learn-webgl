type Mat3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

/**
 * Multiply Function
 */
type MultiplyFunType = (a: Mat3, b: Mat3) => Mat3;
const multiply: MultiplyFunType = (a, b) => {
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
};

/**
 * Identity Function
 */
type IdentityFunType = () => Mat3;
const identity: IdentityFunType = () => {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
};

/**
 * Projection Function
 */
type ProjectionFunType = (width: number, height: number) => Mat3;
const projection: ProjectionFunType = (width, height) => {
  return [
    [2 / width, 0, 0],
    [0, -2 / height, 0],
    [-1, 1, 1],
  ];
};

/**
 * Project Function
 */
type ProjectFunType = (m: Mat3, width: number, height: number) => Mat3;
const project: ProjectFunType = (m, width, height) => {
  return multiply(m, projection(width, height));
};

/**
 * Translation Function
 */
type TranslationFunType = (tx: number, ty: number) => Mat3;
const translation: TranslationFunType = (tx, ty) => {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [tx, ty, 1],
  ];
};

/**
 * Translate Function
 */
type TranslateFunType = (m: Mat3, tx: number, ty: number) => Mat3;
const translate: TranslateFunType = (m, tx, ty) => {
  return multiply(m, translation(tx, ty));
};

/**
 * Rotation Function
 */
type RotationFunType = (angleInRadians: number) => Mat3;
const rotation: RotationFunType = (angleInRadians) => {
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ];
};

/**
 * Rotate Function
 */
type RotateFunType = (m: Mat3, angleInRadians: number) => Mat3;
const rotate: RotateFunType = (m, angleInRadians) => {
  return multiply(m, rotation(angleInRadians));
};

/**
 * Scaling Function
 */
type ScalingFunType = (sx: number, sy: number) => Mat3;
const scaling: ScalingFunType = (sx, sy) => {
  return [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1],
  ];
};

/**
 * Scale Function
 */
type ScaleFunType = (m: Mat3, sx: number, sy: number) => Mat3;
const scale: ScaleFunType = (m, sx, sy) => {
  return multiply(m, scaling(sx, sy));
};

/**
 * Dot Function
 */
type DotFunType = (x1: number, y1: number, x2: number, y2: number) => number;
const dot: DotFunType = (x1, y1, x2, y2) => {
  return x1 * x2 + y1 * y2;
};

/**
 * Distance Function
 */
type DistanceFunType = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => number;
const distance: DistanceFunType = (x1, y1, x2, y2) => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Normalize Function
 */
type NormalizeFunType = (x: number, y: number) => [number, number];
const normalize: NormalizeFunType = (x, y) => {
  const l = distance(0, 0, x, y);
  if (l > 0.00001) {
    return [x / l, y / l];
  } else {
    return [0, 0];
  }
};

/**
 * Reflect Function
 */
// i = incident
// n = normal
type ReflectFunType = (
  ix: number,
  iy: number,
  nx: number,
  ny: number
) => [number, number];
const reflect: ReflectFunType = (ix, iy, nx, ny) => {
  // I - 2.0 * dot(N, I) * N.
  const d = dot(nx, ny, ix, iy);
  return [ix - 2 * d * nx, iy - 2 * d * ny];
};

/**
 * Radian To Degree
 */
type RadToDegFunType = (r: number) => number;
const radToDeg: RadToDegFunType = (r) => {
  return (r * 180) / Math.PI;
};

/**
 * Degree To Radian
 */
type DegToRadFunType = (d: number) => number;
const degToRad: DegToRadFunType = (d) => {
  return (d * Math.PI) / 180;
};

/**
 * TransformPoint Function
 */
type TransformPointFunType = (m: Mat3, v: [number, number]) => [number, number];
const transformPoint: TransformPointFunType = (m, v) => {
  const v0 = v[0];
  const v1 = v[1];
  const d = v0 * m[0][2] + v1 * m[1][2] + m[2][2];
  return [
    (v0 * m[0][0] + v1 * m[1][0] + m[2][0]) / d,
    (v0 * m[0][1] + v1 * m[1][1] + m[2][1]) / d,
  ];
};

/**
 * Inverse Function
 */
type InverseFunType = (m: Mat3) => Mat3;
const inverse: InverseFunType = (m) => {
  const t00 = m[2][2] * m[1][1] - m[2][1] * m[1][2];
  const t10 = m[2][2] * m[0][1] - m[2][1] * m[0][2];
  const t20 = m[1][2] * m[0][1] - m[1][1] * m[0][2];
  const d = 1.0 / (m[0][0] * t00 - m[1][0] * t10 + m[2][0] * t20);
  return [
    [d * t00, -d * t10, d * t20],
    [
      -d * (m[1][0] * m[2][2] - m[1][2] * m[2][0]),
      d * (m[0][0] * m[1][2] - m[0][2] * m[2][0]),
      -d * (m[0][0] * m[1][2] - m[0][2] * m[1][0]),
    ],
    [
      d * (m[1][0] * m[2][1] - m[1][1] * m[2][0]),
      -d * (m[0][0] * m[2][1] - m[0][1] * m[2][0]),
      d * (m[0][0] * m[1][1] - m[0][1] * m[1][0]),
    ],
  ];
};
