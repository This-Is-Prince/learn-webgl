class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}
  magnitude(v?: Vector3) {
    let { x, y, z } = this;
    if (v !== undefined && v !== null) {
      x = v.x;
      y = v.y;
      z = v.z;
    }
    return Math.sqrt(x * x + y * y + z * z);
  }

  normalize() {
    const mag = this.magnitude();
    this.x /= mag;
    this.y /= mag;
    this.z /= mag;
    return this;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  multiScalar(value: number) {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return this;
  }

  getArray() {
    return [this.x, this.y, this.z];
  }

  getFloatArray() {
    return new Float32Array([this.x, this.y, this.z]);
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}

class Matrix4 {
  public raw!: Float32Array;
  constructor() {
    this.raw = Matrix4.identity();
  }

  static identity() {
    return new Float32Array([
      // first row
      1, 0, 0, 0,
      // second row
      0, 1, 0, 0,
      // third row
      0, 0, 1, 0,
      // fourth row
      0, 0, 0, 1,
    ]);
  }

  static multiplyVector(mat4: Float32Array, v: number[]) {
    const x = v[0],
      y = v[1],
      z = v[2],
      w = v[3];

    const a11 = mat4[0],
      a21 = mat4[1],
      a31 = mat4[2],
      a41 = mat4[3];

    const a12 = mat4[4],
      a22 = mat4[5],
      a32 = mat4[6],
      a42 = mat4[7];

    const a13 = mat4[8],
      a23 = mat4[9],
      a33 = mat4[10],
      a43 = mat4[11];

    const a14 = mat4[12],
      a24 = mat4[13],
      a34 = mat4[14],
      a44 = mat4[15];

    return [
      x * a11 + y * a12 + z * a13 + w * a14,
      x * a21 + y * a22 + z * a23 + w * a24,
      x * a31 + y * a32 + z * a33 + w * a34,
      x * a41 + y * a42 + z * a43 + w * a44,
    ];
  }

  static transformVec(out: number[], v: number[], m: Float32Array) {
    out[0] = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3];
    out[1] = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3];
    out[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3];
    out[3] = m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3];
    return out;
  }

  static scale(out: Float32Array, x: number, y: number, z: number) {
    out[0] *= x;
    out[1] *= x;
    out[2] *= x;
    out[3] *= x;

    out[4] *= y;
    out[5] *= y;
    out[6] *= y;
    out[7] *= y;

    out[8] *= z;
    out[9] *= z;
    out[10] *= z;
    out[11] *= z;
    return out;
  }

  static translate(out: Float32Array, x: number, y: number, z: number) {
    out[12] = out[0] * x + out[4] * y + out[8] * z + out[12];
    out[13] = out[1] * x + out[5] * y + out[9] * z + out[13];
    out[14] = out[2] * x + out[6] * y + out[10] * z + out[14];
    out[15] = out[3] * x + out[7] * y + out[11] * z + out[15];
  }
}

export { Vector3, Matrix4 };
