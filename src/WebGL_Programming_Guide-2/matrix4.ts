class Matrix4 {
  private _elements: Float32Array;
  get elements(): Float32Array {
    const elements = new Float32Array(16);
    for (let i = 0; i < 16; i++) {
      elements[i] = this._elements[i];
    }
    return elements;
  }
  constructor(m?: Matrix4) {
    if (m && m instanceof Matrix4) {
      const m_elements = m.elements;
      const this_elements = new Float32Array(16);
      for (let i = 0; i < 16; i++) {
        this_elements[i] = m_elements[i];
      }
      this._elements = this_elements;
    } else {
      this._elements = new Float32Array([
        // First Row
        1, 0, 0, 0,
        // Second Row
        0, 1, 0, 0,
        // Third Row
        0, 0, 1, 0,
        // Fourth Row
        0, 0, 0, 1,
      ]);
    }
  }
  /**
   * Set the identity matrix.
   * @returns this
   */
  setIdentity() {
    // First Row
    this._elements[0] = 1;
    this._elements[4] = 0;
    this._elements[8] = 0;
    this._elements[12] = 0;
    // Second Row
    this._elements[1] = 0;
    this._elements[5] = 1;
    this._elements[9] = 0;
    this._elements[13] = 0;
    // Third Row
    this._elements[2] = 0;
    this._elements[6] = 0;
    this._elements[10] = 1;
    this._elements[14] = 0;
    // Fourth Row
    this._elements[3] = 0;
    this._elements[7] = 0;
    this._elements[11] = 0;
    this._elements[15] = 1;
    return this;
  }

  /**
   * Copy Matrix
   * @param src source matrix
   * @returns this
   */
  set(src: Matrix4) {
    if (this === src) {
      return this;
    }
    const src_elements = src._elements;
    for (let i = 0; i < 16; i++) {
      this._elements[i] = src_elements[i];
    }
    return this;
  }

  /**
   * Multiply the matrix from the right
   * @param m The multiply matrix
   * @returns this
   */
  concat(m: Matrix4) {
    //  Calculate this._elements = a * b;
    const a = this.elements;
    let b = m._elements;

    // If this equals m, copy m to temporary matrix;
    if (this === m) {
      b = m.elements;
    }
    let ai0 = 0,
      ai1 = 0,
      ai2 = 0,
      ai3 = 0;
    for (let i = 0; i < 4; i++) {
      ai0 = a[i];
      ai1 = a[i + 4];
      ai2 = a[i + 8];
      ai3 = a[i + 12];
      this._elements[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
      this._elements[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
      this._elements[i + 8] =
        ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
      this._elements[i + 12] =
        ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }
    return this;
  }
  multiply(m: Matrix4) {
    return this.concat(m);
  }

  /**
   * Transpose the matrix.
   * @returns this
   */
  transpose() {
    const e = this._elements;
    let t = 0;
    t = e[1];
    e[1] = e[4];
    e[4] = t;
    t = e[2];
    e[2] = e[8];
    e[8] = t;
    t = e[3];
    e[3] = e[12];
    e[12] = t;
    t = e[6];
    e[6] = e[9];
    e[9] = t;
    t = e[7];
    e[7] = e[13];
    e[13] = t;
    t = e[11];
    e[11] = e[14];
    e[14] = t;
    return this;
  }

  /**
   * Calculate the inverse matrix of specified matrix, and set to this.
   * @param src The source matrix
   * @returns this
   */
  setInverseOf(src: Matrix4) {
    const s = src._elements;
    const inv = new Float32Array(16);

    inv[0] =
      s[5] * s[10] * s[15] -
      s[5] * s[11] * s[14] -
      s[9] * s[6] * s[15] +
      s[9] * s[7] * s[14] +
      s[13] * s[6] * s[11] -
      s[13] * s[7] * s[10];
    inv[4] =
      -s[4] * s[10] * s[15] +
      s[4] * s[11] * s[14] +
      s[8] * s[6] * s[15] -
      s[8] * s[7] * s[14] -
      s[12] * s[6] * s[11] +
      s[12] * s[7] * s[10];
    inv[8] =
      s[4] * s[9] * s[15] -
      s[4] * s[11] * s[13] -
      s[8] * s[5] * s[15] +
      s[8] * s[7] * s[13] +
      s[12] * s[5] * s[11] -
      s[12] * s[7] * s[9];
    inv[12] =
      -s[4] * s[9] * s[14] +
      s[4] * s[10] * s[13] +
      s[8] * s[5] * s[14] -
      s[8] * s[6] * s[13] -
      s[12] * s[5] * s[10] +
      s[12] * s[6] * s[9];

    inv[1] =
      -s[1] * s[10] * s[15] +
      s[1] * s[11] * s[14] +
      s[9] * s[2] * s[15] -
      s[9] * s[3] * s[14] -
      s[13] * s[2] * s[11] +
      s[13] * s[3] * s[10];
    inv[5] =
      s[0] * s[10] * s[15] -
      s[0] * s[11] * s[14] -
      s[8] * s[2] * s[15] +
      s[8] * s[3] * s[14] +
      s[12] * s[2] * s[11] -
      s[12] * s[3] * s[10];
    inv[9] =
      -s[0] * s[9] * s[15] +
      s[0] * s[11] * s[13] +
      s[8] * s[1] * s[15] -
      s[8] * s[3] * s[13] -
      s[12] * s[1] * s[11] +
      s[12] * s[3] * s[9];
    inv[13] =
      s[0] * s[9] * s[14] -
      s[0] * s[10] * s[13] -
      s[8] * s[1] * s[14] +
      s[8] * s[2] * s[13] +
      s[12] * s[1] * s[10] -
      s[12] * s[2] * s[9];

    inv[2] =
      s[1] * s[6] * s[15] -
      s[1] * s[7] * s[14] -
      s[5] * s[2] * s[15] +
      s[5] * s[3] * s[14] +
      s[13] * s[2] * s[7] -
      s[13] * s[3] * s[6];
    inv[6] =
      -s[0] * s[6] * s[15] +
      s[0] * s[7] * s[14] +
      s[4] * s[2] * s[15] -
      s[4] * s[3] * s[14] -
      s[12] * s[2] * s[7] +
      s[12] * s[3] * s[6];
    inv[10] =
      s[0] * s[5] * s[15] -
      s[0] * s[7] * s[13] -
      s[4] * s[1] * s[15] +
      s[4] * s[3] * s[13] +
      s[12] * s[1] * s[7] -
      s[12] * s[3] * s[5];
    inv[14] =
      -s[0] * s[5] * s[14] +
      s[0] * s[6] * s[13] +
      s[4] * s[1] * s[14] -
      s[4] * s[2] * s[13] -
      s[12] * s[1] * s[6] +
      s[12] * s[2] * s[5];

    inv[3] =
      -s[1] * s[6] * s[11] +
      s[1] * s[7] * s[10] +
      s[5] * s[2] * s[11] -
      s[5] * s[3] * s[10] -
      s[9] * s[2] * s[7] +
      s[9] * s[3] * s[6];
    inv[7] =
      s[0] * s[6] * s[11] -
      s[0] * s[7] * s[10] -
      s[4] * s[2] * s[11] +
      s[4] * s[3] * s[10] +
      s[8] * s[2] * s[7] -
      s[8] * s[3] * s[6];
    inv[11] =
      -s[0] * s[5] * s[11] +
      s[0] * s[7] * s[9] +
      s[4] * s[1] * s[11] -
      s[4] * s[3] * s[9] -
      s[8] * s[1] * s[7] +
      s[8] * s[3] * s[5];
    inv[15] =
      s[0] * s[5] * s[10] -
      s[0] * s[6] * s[9] -
      s[4] * s[1] * s[10] +
      s[4] * s[2] * s[9] +
      s[8] * s[1] * s[6] -
      s[8] * s[2] * s[5];

    let det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
    if (det === 0) {
      return this;
    }

    det = 1 / det;
    for (let i = 0; i < 16; i++) {
      this._elements[i] = inv[i] * det;
    }

    return this;
  }

  /**
   * Calculate the inverse matrix of this, and set to this
   * @returns this
   */
  invert() {
    return this.setInverseOf(this);
  }

  /**
   * Set the orthographic projection matrix.
   * @param left The coordinate of the left of clipping plane.
   * @param right The coordinate of the right of clipping plane.
   * @param bottom The coordinate of the bottom of clipping plane.
   * @param top The coordinate of the top top clipping plane.
   * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @return this
   */
  setOrtho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    if (left >= right || bottom >= top || near >= far) {
      throw new Error(`null frustum`);
    }
    const rw = 1 / (right - left);
    const rh = 1 / (top - bottom);
    const rd = 1 / (far - near);

    this._elements[0] = 2 * rw;
    this._elements[1] = 0;
    this._elements[2] = 0;
    this._elements[3] = 0;
    this._elements[4] = 0;
    this._elements[5] = 2 * rh;
    this._elements[6] = 0;
    this._elements[7] = 0;
    this._elements[8] = 0;
    this._elements[9] = 0;
    this._elements[10] = -2 * rd;
    this._elements[11] = 0;
    this._elements[12] = -(right + left) * rw;
    this._elements[13] = -(top + bottom) * rh;
    this._elements[14] = -(far + near) * rd;
    this._elements[15] = 1;

    return this;
  }

  /**
   * Multiply the orthographic projection matrix from the right.
   * @param left The coordinate of the left of clipping plane.
   * @param right The coordinate of the right of clipping plane.
   * @param bottom The coordinate of the bottom of clipping plane.
   * @param top The coordinate of the top top clipping plane.
   * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @return this
   */
  ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    return this.concat(
      new Matrix4().setOrtho(left, right, bottom, top, near, far)
    );
  }

  /**
   * Set the perspective projection matrix by fov and aspect.
   * @param fov The angle between the upper and lower sides of the frustum.
   * @param aspect The aspect ratio of the frustum. (width/height)
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  setPerspective(fov: number, aspect: number, near: number, far: number) {
    if (near >= far || aspect === 0) {
      throw "null frustum";
    }
    if (near <= 0) {
      throw "near <= 0";
    }
    if (far <= 0) {
      throw "far <= 0";
    }

    fov = (Math.PI * fov) / 180 / 2;
    const s = Math.sin(fov);
    if (s === 0) {
      throw "null frustum";
    }

    const rd = 1 / (far - near);
    const ct = Math.cos(fov) / s;

    this._elements[0] = ct / aspect;
    this._elements[1] = 0;
    this._elements[2] = 0;
    this._elements[3] = 0;
    this._elements[4] = 0;
    this._elements[5] = ct;
    this._elements[6] = 0;
    this._elements[7] = 0;
    this._elements[8] = 0;
    this._elements[9] = 0;
    this._elements[10] = -(far + near) * rd;
    this._elements[11] = -1;
    this._elements[12] = 0;
    this._elements[13] = 0;
    this._elements[14] = -2 * near * far * rd;
    this._elements[15] = 0;

    return this;
  }

  /**
   * Multiply the perspective projection matrix from the right.
   * @param fov The angle between the upper and lower sides of the frustum.
   * @param aspect The aspect ratio of the frustum. (width/height)
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  perspective(fov: number, aspect: number, near: number, far: number) {
    return this.concat(new Matrix4().setPerspective(fov, aspect, near, far));
  }

  /**
   * Set the matrix for scaling.
   * @param x The scale factor along the X axis
   * @param y The scale factor along the Y axis
   * @param z The scale factor along the Z axis
   * @return this
   */
  setScale(x: number, y: number, z: number) {
    this.setIdentity();
    this._elements[0] = x;
    this._elements[5] = y;
    this._elements[10] = z;
    return this;
  }

  /**
   * Multiply the matrix for scaling from the right.
   * @param x The scale factor along the X axis
   * @param y The scale factor along the Y axis
   * @param z The scale factor along the Z axis
   * @return this
   */
  scale(x: number, y: number, z: number) {
    this._elements[0] *= x;
    this._elements[4] *= y;
    this._elements[8] *= z;
    this._elements[1] *= x;
    this._elements[5] *= y;
    this._elements[9] *= z;
    this._elements[2] *= x;
    this._elements[6] *= y;
    this._elements[10] *= z;
    this._elements[3] *= x;
    this._elements[7] *= y;
    this._elements[11] *= z;
    return this;
  }

  /**
   * Set the matrix for translation.
   * @param x The X value of a translation.
   * @param y The Y value of a translation.
   * @param z The Z value of a translation.
   * @return this
   */
  setTranslate(x: number, y: number, z: number) {
    this.setIdentity();
    this._elements[12] = x;
    this._elements[13] = y;
    this._elements[14] = z;
    return this;
  }

  /**
   * Multiply the matrix for translation from the right.
   * @param x The X value of a translation.
   * @param y The Y value of a translation.
   * @param z The Z value of a translation.
   * @return this
   */
  translate(x: number, y: number, z: number) {
    const e = this._elements;
    this._elements[12] += e[0] * x + e[4] * y + e[8] * z;
    this._elements[13] += e[1] * x + e[5] * y + e[9] * z;
    this._elements[14] += e[2] * x + e[6] * y + e[10] * z;
    this._elements[15] += e[3] * x + e[7] * y + e[11] * z;
    return this;
  }

  /**
   * Set the matrix for rotation.
   * The vector of rotation axis may not be normalized.
   * @param angle The angle of rotation (degrees)
   * @param x The X coordinate of vector of rotation axis.
   * @param y The Y coordinate of vector of rotation axis.
   * @param z The Z coordinate of vector of rotation axis.
   * @return this
   */
  setRotate(angle: number, x: number, y: number, z: number) {
    angle = (Math.PI * angle) / 180;

    let s = Math.sin(angle);
    const c = Math.cos(angle);
    this.setIdentity();

    if (0 !== x && 0 === y && 0 === z) {
      // Rotation around X axis
      if (x < 0) {
        s = -s;
      }
      this._elements[5] = c;
      this._elements[9] = -s;
      this._elements[6] = s;
      this._elements[10] = c;
    } else if (0 === x && 0 !== y && 0 === z) {
      // Rotation around Y axis
      if (y < 0) {
        s = -s;
      }
      this._elements[0] = c;
      this._elements[8] = s;
      this._elements[2] = -s;
      this._elements[10] = c;
    } else if (0 === x && 0 === y && 0 !== z) {
      // Rotation around Z axis
      if (z < 0) {
        s = -s;
      }
      this._elements[0] = c;
      this._elements[4] = -s;
      this._elements[1] = s;
      this._elements[5] = c;
    } else {
      // Rotation around another axis
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

      this._elements[0] = x * x * nc + c;
      this._elements[1] = xy * nc + zs;
      this._elements[2] = zx * nc - ys;
      this._elements[3] = 0;
      this._elements[4] = xy * nc - zs;
      this._elements[5] = y * y * nc + c;
      this._elements[6] = yz * nc + xs;
      this._elements[7] = 0;
      this._elements[8] = zx * nc + ys;
      this._elements[9] = yz * nc - xs;
      this._elements[10] = z * z * nc + c;
      this._elements[11] = 0;
      this._elements[12] = 0;
      this._elements[13] = 0;
      this._elements[14] = 0;
      this._elements[15] = 1;
    }

    return this;
  }

  /**
   * Multiply the matrix for rotation from the right.
   * The vector of rotation axis may not be normalized.
   * @param angle The angle of rotation (degrees)
   * @param x The X coordinate of vector of rotation axis.
   * @param y The Y coordinate of vector of rotation axis.
   * @param z The Z coordinate of vector of rotation axis.
   * @return this
   */
  rotate(angle: number, x: number, y: number, z: number) {
    return this.concat(new Matrix4().setRotate(angle, x, y, z));
  }

  /**
   * Set the viewing matrix.
   * @param eyeX The x position of the eye point.
   * @param eyeY The y position of the eye point.
   * @param eyeZ The z position of the eye point.
   * @param atX The x position of the reference point.
   * @param atY The y position of the reference point.
   * @param atZ The z position of the reference point.
   * @param upX The x direction of the up vector.
   * @param upY The y direction of the up vector.
   * @param upZ The z direction of the up vector.
   * @returns this
   */
  setLookAt(
    eyeX: number,
    eyeY: number,
    eyeZ: number,
    atX: number,
    atY: number,
    atZ: number,
    upX: number,
    upY: number,
    upZ: number
  ) {
    let fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

    fx = atX - eyeX;
    fy = atY - eyeY;
    fz = atZ - eyeZ;

    // Normalize f.
    rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
    fx *= rlf;
    fy *= rlf;
    fz *= rlf;

    // Calculate cross product of f and up.
    sx = fy * upZ - fz * upY;
    sy = fz * upX - fx * upZ;
    sz = fx * upY - fy * upX;

    // Normalize s.
    rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
    sx *= rls;
    sy *= rls;
    sz *= rls;

    // Calculate cross product of s and f.
    ux = sy * fz - sz * fy;
    uy = sz * fx - sx * fz;
    uz = sx * fy - sy * fx;

    this._elements[0] = sx;
    this._elements[1] = ux;
    this._elements[2] = -fx;
    this._elements[3] = 0;
    this._elements[4] = sy;
    this._elements[5] = uy;
    this._elements[6] = -fy;
    this._elements[7] = 0;
    this._elements[8] = sz;
    this._elements[9] = uz;
    this._elements[10] = -fz;
    this._elements[11] = 0;
    this._elements[12] = 0;
    this._elements[13] = 0;
    this._elements[14] = 0;
    this._elements[15] = 1;

    // Translate.
    return this.translate(-eyeX, -eyeY, -eyeZ);
  }

  /**
   *Multiply the viewing matrix from the right.
   * @param eyeX The x position of the eye point.
   * @param eyeY The y position of the eye point.
   * @param eyeZ The z position of the eye point.
   * @param atX The x position of the reference point.
   * @param atY The y position of the reference point.
   * @param atZ The z position of the reference point.
   * @param upX The x direction of the up vector.
   * @param upY The y direction of the up vector.
   * @param upZ The z direction of the up vector.
   * @returns this
   */
  lookAt(
    eyeX: number,
    eyeY: number,
    eyeZ: number,
    atX: number,
    atY: number,
    atZ: number,
    upX: number,
    upY: number,
    upZ: number
  ) {
    return this.concat(
      new Matrix4().setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ)
    );
  }
}
export { Matrix4 };
