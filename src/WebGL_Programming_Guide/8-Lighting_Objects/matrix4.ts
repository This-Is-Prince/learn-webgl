type Mat4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];
type Mat2 = [[number, number], [number, number]];
type Mat3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];
type Direction = "X" | "Y" | "Z";

type Point3 = {
  x: number;
  y: number;
  z: number;
};

class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}
  normalize() {
    const { x, y, z } = this;
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    this.x /= magnitude;
    this.y /= magnitude;
    this.z /= magnitude;
  }
  crossProduct(b: Vector3): Vector3 {
    const { x, y, z } = this;
    return new Vector3(
      y * b.z - z * b.y,
      -(x * b.z - b.x * z),
      x * b.y - y * b.x
    );
  }
  makeVector(start: Point3, end: Point3) {
    this.x = end.x - start.x;
    this.y = end.y - start.y;
    this.z = end.z - start.z;
  }
}

class Matrix4 {
  private _elements: Mat4;
  set(m: Matrix4) {
    this._elements = m._elements;
  }
  elements(): Float32Array {
    return new Float32Array(
      this._elements.reduce((currValue, nextValue) => {
        currValue.push(nextValue[0]);
        currValue.push(nextValue[1]);
        currValue.push(nextValue[2]);
        currValue.push(nextValue[3]);
        return currValue;
      }, [] as number[])
    );
  }
  constructor() {
    this._elements = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }
  // Copy
  copy(m: Matrix4) {
    this._elements = [
      [...m._elements[0]],
      [...m._elements[1]],
      [...m._elements[2]],
      [...m._elements[3]],
    ];
  }
  // Convert Degree To Radian
  degreeToRadian(angle: number) {
    return Math.PI * (angle / 180);
  }
  // Multiply
  private multiply(b: Mat4, a: Mat4): Mat4 {
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
        a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
        a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
        a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
        a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
      ],
      [
        a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
        a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
        a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
        a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
      ],
      [
        a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
        a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
        a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
        a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
      ],
      [
        a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
        a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
        a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
        a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33,
      ],
    ];
  }
  // Identity
  private getIdentity(): Mat4 {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }
  setIdentity() {
    this._elements = this.getIdentity();
  }
  // Translate
  private getTranslate(x: number, y: number, z: number): Mat4 {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [x, y, z, 1],
    ];
  }
  setTranslate(x: number, y: number, z: number) {
    this._elements = this.getTranslate(x, y, z);
  }
  translate(x: number, y: number, z: number) {
    this._elements = this.multiply(this._elements, this.getTranslate(x, y, z));
  }
  // Rotation
  private getZRotate(c: number, s: number): Mat4 {
    return [
      [c, s, 0, 0],
      [-s, c, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }
  private getXRotate(c: number, s: number): Mat4 {
    return [
      [1, 0, 0, 0],
      [0, c, s, 0],
      [0, -s, c, 0],
      [0, 0, 0, 1],
    ];
  }
  private getYRotate(c: number, s: number): Mat4 {
    return [
      [c, 0, s, 0],
      [0, 1, 0, 0],
      [-s, 0, c, 0],
      [0, 0, 0, 1],
    ];
  }
  private getRotate(angleInDegree: number, direction: Direction): Mat4 {
    const angleInRadian = this.degreeToRadian(angleInDegree);
    const c = Math.cos(angleInRadian);
    const s = Math.sin(angleInRadian);
    if (direction === "X") {
      return this.getXRotate(c, s);
    } else if (direction === "Y") {
      return this.getYRotate(c, s);
    } else {
      return this.getZRotate(c, s);
    }
  }
  setRotate(angleInDegree: number, direction: Direction) {
    this._elements = this.getRotate(angleInDegree, direction);
  }
  rotate(angleInDegree: number, direction: Direction) {
    this._elements = this.multiply(
      this._elements,
      this.getRotate(angleInDegree, direction)
    );
  }
  // Scale
  private getScale(x: number, y: number, z: number): Mat4 {
    return [
      [x, 0, 0, 0],
      [0, y, 0, 0],
      [0, 0, z, 0],
      [0, 0, 0, 1],
    ];
  }
  setScale(x: number, y: number, z: number) {
    this._elements = this.getScale(x, y, z);
  }
  scale(x: number, y: number, z: number) {
    this._elements = this.multiply(this._elements, this.getScale(x, y, z));
  }
  // Look At
  private getLookAt(eye: Point3, at: Point3, up: Point3): Mat4 {
    const f = new Vector3();
    f.makeVector(eye, at);
    f.normalize();
    const s = f.crossProduct(new Vector3(up.x, up.y, up.z));
    s.normalize();
    const u = s.crossProduct(new Vector3(f.x, f.y, f.z));
    return this.multiply(
      [
        [s.x, u.x, -f.x, 0],
        [s.y, u.y, -f.y, 0],
        [s.z, u.z, -f.z, 0],
        [0, 0, 0, 1],
      ],
      this.getTranslate(-eye.x, -eye.y, -eye.z)
    );
  }
  setLookAt(eye: Point3, at: Point3, up: Point3) {
    this._elements = this.getLookAt(eye, at, up);
  }
  lookAt(eye: Point3, at: Point3, up: Point3) {
    this._elements = this.multiply(this._elements, this.getLookAt(eye, at, up));
  }
  // Orthographic Projection
  private getOrthographicProjection(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Mat4 {
    if (left >= right || bottom >= top || near >= far) {
      throw new Error(`null frustum`);
    }
    const rw = 1 / (right - left),
      rh = 1 / (top - bottom),
      rd = 1 / (far - near);
    return [
      [2 * rw, 0, 0, 0],
      [0, 2 * rh, 0, 0],
      [0, 0, -2 * rd, 0],
      [-(right + left) * rw, -(top + bottom) * rh, -(far + near) * rd, 1],
    ];
  }
  setOrthographicProjection(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    this._elements = this.getOrthographicProjection(
      left,
      right,
      bottom,
      top,
      near,
      far
    );
  }
  orthographicProjection(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    this._elements = this.multiply(
      this._elements,
      this.getOrthographicProjection(left, right, bottom, top, near, far)
    );
  }
  // Perspective Projection
  private getPerspectiveProjection(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ): Mat4 {
    if (near <= 0 || far <= 0) {
      throw new Error(`near , far must be greater than 0`);
    }
    if (near >= far) {
      throw new Error(`near must be less than far`);
    }
    if (aspect <= 0) {
      throw new Error(`aspect ratio can't be negative or zero`);
    }
    if (fov <= 0 || fov >= 180) {
      throw new Error(`fov can't be negative , zero and greater than 180`);
    }
    fov = this.degreeToRadian(fov);
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const rangeInv = 1.0 / (near - far);
    return [
      [f / aspect, 0, 0, 0],
      [0, f, 0, 0],
      [0, 0, (near + far) * rangeInv, -1],
      [0, 0, near * far * rangeInv * 2, 0],
    ];
  }
  setPerspectiveProjection(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ) {
    this._elements = this.getPerspectiveProjection(fov, aspect, near, far);
  }
  perspectiveProjection(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ) {
    this._elements = this.multiply(
      this._elements,
      this.getPerspectiveProjection(fov, aspect, near, far)
    );
  }
  // Transpose
  transpose() {
    const {
      "0": { "0": elm_00, "1": elm_01, "2": elm_02, "3": elm_03 },
      "1": { "0": elm_10, "1": elm_11, "2": elm_12, "3": elm_13 },
      "2": { "0": elm_20, "1": elm_21, "2": elm_22, "3": elm_23 },
      "3": { "0": elm_30, "1": elm_31, "2": elm_32, "3": elm_33 },
    } = this._elements;
    this._elements = [
      [elm_00, elm_10, elm_20, elm_30],
      [elm_01, elm_11, elm_21, elm_31],
      [elm_02, elm_12, elm_22, elm_32],
      [elm_03, elm_13, elm_23, elm_33],
    ];
  }
  // Determinant
  getDeterminantOf2x2(m: Mat2) {
    const {
      "0": { "0": m00, "1": m01 },
      "1": { "0": m10, "1": m11 },
    } = m;
    return m00 * m11 - m10 * m01;
  }
  getDeterminantOf3x3(m: Mat3) {
    const {
      "0": { "0": m00, "1": m01, "2": m02 },
      "1": { "0": m10, "1": m11, "2": m12 },
      "2": { "0": m20, "1": m21, "2": m22 },
    } = m;
    return (
      m00 *
        this.getDeterminantOf2x2([
          [m11, m12],
          [m21, m22],
        ]) -
      m01 *
        this.getDeterminantOf2x2([
          [m10, m12],
          [m20, m22],
        ]) +
      m02 *
        this.getDeterminantOf2x2([
          [m10, m11],
          [m20, m21],
        ])
    );
  }
  getDeterminantOf4x4(m: Mat4) {
    const {
      "0": { "0": m00, "1": m01, "2": m02, "3": m03 },
      "1": { "0": m10, "1": m11, "2": m12, "3": m13 },
      "2": { "0": m20, "1": m21, "2": m22, "3": m23 },
      "3": { "0": m30, "1": m31, "2": m32, "3": m33 },
    } = m;
    return (
      m00 *
        this.getDeterminantOf3x3([
          [m11, m12, m13],
          [m21, m22, m23],
          [m31, m32, m33],
        ]) -
      m01 *
        this.getDeterminantOf3x3([
          [m10, m12, m13],
          [m20, m22, m23],
          [m30, m32, m33],
        ]) +
      m02 *
        this.getDeterminantOf3x3([
          [m10, m11, m13],
          [m20, m21, m23],
          [m30, m31, m33],
        ]) -
      m03 *
        this.getDeterminantOf3x3([
          [m10, m11, m12],
          [m20, m21, m22],
          [m30, m31, m32],
        ])
    );
  }
  // Inverse Of A Matrix
  getInverseOf(m: Mat4) {
    const {
      "0": { "0": m00, "1": m01, "2": m02, "3": m03 },
      "1": { "0": m10, "1": m11, "2": m12, "3": m13 },
      "2": { "0": m20, "1": m21, "2": m22, "3": m23 },
      "3": { "0": m30, "1": m31, "2": m32, "3": m33 },
    } = m;
    const inv = this.getIdentity();
    inv[0][0] = this.getDeterminantOf3x3([
      [m11, m12, m13],
      [m21, m22, m23],
      [m31, m32, m33],
    ]);
    inv[1][0] = this.getDeterminantOf3x3([
      [m01, m02, m03],
      [m21, m22, m23],
      [m31, m32, m33],
    ]);
    inv[2][0] = this.getDeterminantOf3x3([
      [m01, m02, m03],
      [m11, m12, m13],
      [m31, m32, m33],
    ]);
    inv[3][0] = this.getDeterminantOf3x3([
      [m01, m02, m03],
      [m11, m12, m13],
      [m21, m22, m23],
    ]);

    inv[0][1] = -this.getDeterminantOf3x3([
      [m10, m12, m13],
      [m20, m22, m23],
      [m30, m32, m33],
    ]);
    inv[1][1] = -this.getDeterminantOf3x3([
      [m00, m02, m03],
      [m20, m22, m23],
      [m30, m32, m33],
    ]);
    inv[2][1] = -this.getDeterminantOf3x3([
      [m00, m02, m03],
      [m10, m12, m13],
      [m30, m32, m33],
    ]);
    inv[3][1] = -this.getDeterminantOf3x3([
      [m00, m02, m03],
      [m10, m12, m13],
      [m20, m22, m23],
    ]);

    inv[0][2] = this.getDeterminantOf3x3([
      [m10, m11, m13],
      [m20, m21, m23],
      [m30, m31, m33],
    ]);
    inv[1][2] = this.getDeterminantOf3x3([
      [m00, m01, m03],
      [m20, m21, m23],
      [m30, m31, m33],
    ]);
    inv[2][2] = this.getDeterminantOf3x3([
      [m00, m01, m03],
      [m10, m11, m13],
      [m30, m31, m33],
    ]);
    inv[3][2] = this.getDeterminantOf3x3([
      [m00, m01, m03],
      [m10, m11, m13],
      [m20, m21, m23],
    ]);

    inv[0][3] = -this.getDeterminantOf3x3([
      [m10, m11, m12],
      [m20, m21, m22],
      [m30, m31, m32],
    ]);
    inv[1][3] = -this.getDeterminantOf3x3([
      [m00, m01, m02],
      [m20, m21, m22],
      [m30, m31, m32],
    ]);
    inv[2][3] = -this.getDeterminantOf3x3([
      [m00, m01, m02],
      [m10, m11, m12],
      [m30, m31, m32],
    ]);
    inv[3][3] = -this.getDeterminantOf3x3([
      [m00, m01, m02],
      [m10, m11, m12],
      [m20, m21, m22],
    ]);

    let determinant =
      m00 * inv[0][0] + m01 * inv[0][1] + m02 * inv[0][2] + m03 * inv[0][3];
    if (determinant === 0) {
      return inv;
    }
    determinant = 1 / determinant;
    const invMatrix = inv.map((row) => {
      return row.map((elm) => {
        return elm * determinant;
      });
    }) as Mat4;
    return invMatrix;
  }
  setInverseOf(m: Matrix4) {
    // first transpose matrix because column major order of matrix
    m.transpose();
    this._elements = this.getInverseOf(m._elements);
  }
}

export { Matrix4, Vector3, Point3 };
