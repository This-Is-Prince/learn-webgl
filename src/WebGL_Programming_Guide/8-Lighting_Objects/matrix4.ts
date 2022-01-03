type Mat4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
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
}

export { Matrix4, Vector3, Point3 };
