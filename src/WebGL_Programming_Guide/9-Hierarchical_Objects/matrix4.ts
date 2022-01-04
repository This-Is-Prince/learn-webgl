type Mat4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

type Mat3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

type Mat2 = [[number, number], [number, number]];

class Vector3 {
  constructor(public x = 0, public y = 0, public z = 0) {}
  normalize() {
    const { x, y, z } = this;
    const mag = 1 / Math.sqrt(x * x + y * y + z * z);
    this.x *= mag;
    this.y *= mag;
    this.z *= mag;
  }
  cross(vec: Vector3): Vector3 {
    const { x, y, z } = this;
    const newVec = new Vector3();
    newVec.x = y * vec.z - z * vec.y;
    newVec.y = z * vec.x - x * vec.z;
    newVec.z = x * vec.y - y * vec.x;
    return newVec;
  }
  dot(vec: Vector3): number {
    const { x, y, z } = this;
    return x * vec.x + y * vec.y + z * vec.z;
  }
  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
}

class Matrix4 {
  private mat: Mat4;
  private _elements: Float32Array;
  get elements(): Float32Array {
    let j = 0;
    // console.log(this.mat);

    for (let i = 0; i < 16; i += 4) {
      this._elements[i + 0] = this.mat[0][j];
      this._elements[i + 1] = this.mat[1][j];
      this._elements[i + 2] = this.mat[2][j];
      this._elements[i + 3] = this.mat[3][j];
      j++;
    }
    return this._elements;
  }
  constructor(m?: Mat4) {
    this._elements = new Float32Array(16);
    if (m) {
      this.mat = m;
    } else {
      this.mat = this.getIdentity();
    }
  }
  clone() {
    return new Matrix4([
      [...this.mat[0]],
      [...this.mat[1]],
      [...this.mat[2]],
      [...this.mat[3]],
    ]);
  }
  set(m: Matrix4): Matrix4 {
    this.mat = [[...m.mat[0]], [...m.mat[1]], [...m.mat[2]], [...m.mat[3]]];
    return this;
  }
  // Convert Degree to Radian
  degreeToRadian(angleInDegree: number) {
    return Math.PI * (angleInDegree / 180);
  }
  //   Identity
  private getIdentity(): Mat4 {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }
  setIdentity(): Matrix4 {
    this.mat = this.getIdentity();
    return this;
  }
  //   Transpose
  transpose(): Matrix4 {
    const {
      "0": { "0": m00, "1": m01, "2": m02, "3": m03 },
      "1": { "0": m10, "1": m11, "2": m12, "3": m13 },
      "2": { "0": m20, "1": m21, "2": m22, "3": m23 },
      "3": { "0": m30, "1": m31, "2": m32, "3": m33 },
    } = this.mat;
    this.mat = [
      [m00, m10, m20, m30],
      [m01, m11, m21, m31],
      [m02, m12, m22, m32],
      [m03, m13, m23, m33],
    ];
    return this;
  }
  //   Multiply this matrix with given matrix
  multiply(m: Matrix4 | Mat4): Matrix4 {
    const a = this.mat;
    const b = m instanceof Matrix4 ? m.mat : m;
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
    this.mat = [
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
    return this;
  }
  //   Translation Matrix
  private getTranslate(x: number, y: number, z: number): Mat4 {
    return [
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1],
    ];
  }
  setTranslate(x: number, y: number, z: number): Matrix4 {
    this.mat = this.getTranslate(x, y, z);
    return this;
  }
  translate(x: number, y: number, z: number): Matrix4 {
    return this.multiply(this.getTranslate(x, y, z));
  }

  //   Scaling Matrix
  private getScale(x: number, y: number, z: number): Mat4 {
    return [
      [x, 0, 0, 0],
      [0, y, 0, 0],
      [0, 0, z, 0],
      [0, 0, 0, 1],
    ];
  }
  setScale(x: number, y: number, z: number): Matrix4 {
    this.mat = this.getScale(x, y, z);
    return this;
  }
  scale(x: number, y: number, z: number): Matrix4 {
    return this.multiply(this.getScale(x, y, z));
  }

  //   Rotation Matrix
  private getRotate(
    angleInDegree: number,
    x: number,
    y: number,
    z: number
  ): Mat4 {
    const angleInRadian = this.degreeToRadian(angleInDegree);
    let s = Math.sin(angleInRadian);
    let c = Math.cos(angleInRadian);

    if (x !== 0 && y === 0 && z === 0) {
      // Rotation around X axis
      if (x < 0) {
        s = -s;
      }
      return [
        [1, 0, 0, 0],
        [0, c, -s, 0],
        [0, s, c, 0],
        [0, 0, 0, 1],
      ];
    } else if (x === 0 && y !== 0 && z === 0) {
      // Rotation Around Y Axis
      if (y < 0) {
        s = -s;
      }
      return [
        [c, 0, s, 0],
        [0, 1, 0, 0],
        [-s, 0, c, 0],
        [0, 0, 0, 1],
      ];
    } else if (x === 0 && y === 0 && z !== 0) {
      // Rotation Around Z Axis
      if (z < 0) {
        s = -s;
      }
      return [
        [c, -s, 0, 0],
        [s, c, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
    } else {
      // Rotation Around another axis
      let len = Math.sqrt(x * x + y * y + z * z);
      if (len !== 1) {
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
      }
      const nc = 1 - c;
      const xy = x * y;
      const yz = y * z;
      const zx = z * x;
      const xs = x * s;
      const ys = y * s;
      const zs = z * s;

      return [
        [x * x * nc + c, xy * nc - zs, zx * nc + ys, 0],
        [xy * nc + zs, y * y * nc + c, yz * nc - xs, 0],
        [zx * nc - ys, yz * nc + xs, z * z * nc + c, 0],
        [0, 0, 0, 1],
      ];
    }
  }
  setRotate(angleInDegree: number, x: number, y: number, z: number): Matrix4 {
    this.mat = this.getRotate(angleInDegree, x, y, z);
    return this;
  }
  rotate(angleInDegree: number, x: number, y: number, z: number): Matrix4 {
    return this.multiply(this.getRotate(angleInDegree, x, y, z));
  }
  //   LookAt Matrix
  private getLookAt(eye: Vector3, at: Vector3, up: Vector3): Mat4 {
    const f = new Vector3(at.x - eye.x, at.y - eye.y, at.z - eye.z);
    f.normalize();
    // Cross product of f and up
    const s = f.cross(up);
    s.normalize();
    // Cross product of s and f
    const u = s.cross(f);
    const rotMatrix: Mat4 = [
      [s.x, s.y, s.z, 0],
      [u.x, u.y, u.z, 0],
      [-f.x, -f.y, -f.z, 0],
      [0, 0, 0, 1],
    ];
    return new Matrix4(rotMatrix).translate(-eye.x, -eye.y, -eye.z).mat;
  }
  setLookAt(eye: Vector3, at: Vector3, up: Vector3): Matrix4 {
    this.mat = this.getLookAt(eye, at, up);
    return this;
  }
  lookAt(eye: Vector3, at: Vector3, up: Vector3): Matrix4 {
    return this.multiply(this.getLookAt(eye, at, up));
  }

  //   Orthographic Projection
  private getOrtho(
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
      [2 * rw, 0, 0, -(right + left) * rw],
      [0, 2 * rh, 0, -(top + bottom) * rh],
      [0, 0, -2 * rd, -(far + near) * rd],
      [0, 0, 0, 1],
    ];
  }
  setOrtho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4 {
    this.mat = this.getOrtho(left, right, bottom, top, near, far);
    return this;
  }
  ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4 {
    return this.multiply(this.getOrtho(left, right, bottom, top, near, far));
  }

  // Perspective Projection
  private getPerspective(
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
    if (fov <= 0) {
      throw new Error(`fov can't be negative , zero and greater than 180`);
    }
    fov = this.degreeToRadian(fov);
    fov = fov / 2;
    const s = Math.sin(fov);
    if (s === 0) {
      throw new Error(`null frustum sin = ${s}`);
    }
    const rangeInv = 1.0 / (far - near);
    const f = Math.cos(fov) / s;
    return [
      [f / aspect, 0, 0, 0],
      [0, f, 0, 0],
      [0, 0, -((far + near) * rangeInv), -(near * far * rangeInv * 2)],
      [0, 0, -1, 0],
    ];
  }
  setPerspective(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4 {
    this.mat = this.getPerspective(fov, aspect, near, far);
    return this;
  }
  perspective(fov: number, aspect: number, near: number, far: number): Matrix4 {
    return this.multiply(this.getPerspective(fov, aspect, near, far));
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

  //   Inverse Of A Matrix
  private getInverseOf(m: Matrix4): Mat4 {
    const {
      "0": { "0": m00, "1": m01, "2": m02, "3": m03 },
      "1": { "0": m10, "1": m11, "2": m12, "3": m13 },
      "2": { "0": m20, "1": m21, "2": m22, "3": m23 },
      "3": { "0": m30, "1": m31, "2": m32, "3": m33 },
    } = m.mat;
    const inv = this.getIdentity();
    inv[0][0] = this.getDeterminantOf3x3([
      [m11, m12, m13],
      [m21, m22, m23],
      [m31, m32, m33],
    ]);
    inv[1][0] = -this.getDeterminantOf3x3([
      [m01, m02, m03],
      [m21, m22, m23],
      [m31, m32, m33],
    ]);
    inv[2][0] = this.getDeterminantOf3x3([
      [m01, m02, m03],
      [m11, m12, m13],
      [m31, m32, m33],
    ]);
    inv[3][0] = -this.getDeterminantOf3x3([
      [m01, m02, m03],
      [m11, m12, m13],
      [m21, m22, m23],
    ]);

    inv[0][1] = -this.getDeterminantOf3x3([
      [m10, m12, m13],
      [m20, m22, m23],
      [m30, m32, m33],
    ]);
    inv[1][1] = this.getDeterminantOf3x3([
      [m00, m02, m03],
      [m20, m22, m23],
      [m30, m32, m33],
    ]);
    inv[2][1] = -this.getDeterminantOf3x3([
      [m00, m02, m03],
      [m10, m12, m13],
      [m30, m32, m33],
    ]);
    inv[3][1] = this.getDeterminantOf3x3([
      [m00, m02, m03],
      [m10, m12, m13],
      [m20, m22, m23],
    ]);

    inv[0][2] = this.getDeterminantOf3x3([
      [m10, m11, m13],
      [m20, m21, m23],
      [m30, m31, m33],
    ]);
    inv[1][2] = -this.getDeterminantOf3x3([
      [m00, m01, m03],
      [m20, m21, m23],
      [m30, m31, m33],
    ]);
    inv[2][2] = this.getDeterminantOf3x3([
      [m00, m01, m03],
      [m10, m11, m13],
      [m30, m31, m33],
    ]);
    inv[3][2] = -this.getDeterminantOf3x3([
      [m00, m01, m03],
      [m10, m11, m13],
      [m20, m21, m23],
    ]);

    inv[0][3] = -this.getDeterminantOf3x3([
      [m10, m11, m12],
      [m20, m21, m22],
      [m30, m31, m32],
    ]);
    inv[1][3] = this.getDeterminantOf3x3([
      [m00, m01, m02],
      [m20, m21, m22],
      [m30, m31, m32],
    ]);
    inv[2][3] = -this.getDeterminantOf3x3([
      [m00, m01, m02],
      [m10, m11, m12],
      [m30, m31, m32],
    ]);
    inv[3][3] = this.getDeterminantOf3x3([
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
    this.mat = this.getInverseOf(m);
    return this;
  }
  invert() {
    return this.setInverseOf(this);
  }
}
export { Matrix4, Vector3 };
