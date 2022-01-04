type Mat4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

class Matrix4 {
  private mat: Mat4;
  private _elements: Float32Array;
  get elements(): Float32Array {
    let j = 0;
    for (let i = 0; i < 16; i += 4) {
      this._elements[i + 0] = this.mat[0][j];
      this._elements[i + 1] = this.mat[1][j];
      this._elements[i + 2] = this.mat[2][j];
      this._elements[i + 3] = this.mat[3][j];
      j++;
    }
    return this._elements;
  }
  constructor() {
    this._elements = new Float32Array(16);
    this.mat = this.getIdentity();
  }
  set(m: Matrix4) {
    this.mat = [[...m.mat[0]], [...m.mat[1]], [...m.mat[2]], [...m.mat[3]]];
  }
  private getIdentity(): Mat4 {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }
  setIdentity() {
    this.mat = this.getIdentity();
  }
  transpose() {
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
  }
  multiply(m: Matrix4) {
    const a = this.mat;
    const b = m.mat;
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
  }
}
