class Vector3 {
  public x: number;
  public y: number;
  public z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
  /**
   * Calculate magnitude of given vector if not given then magnitude of this vector
   * @param v Vector3
   * @returns number
   */
  magnitude(v?: Vector3) {
    let { x, y, z } = this;
    if (v !== undefined && v !== null) {
      x = v.x - x;
      y = v.y - y;
      z = v.z - z;
    }
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Make this to unit vector
   * @returns Vector3
   */
  normalize() {
    const mag = this.magnitude();
    this.x /= mag;
    this.y /= mag;
    this.z /= mag;
    return this;
  }
  /**
   * Set x,y,z parameters of vector
   * @param x number
   * @param y number
   * @param z number
   * @returns Vector3
   */
  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  /**
   * Multiply scalar value to the vector
   * @param value number
   * @returns Vector3
   */
  multiScalar(value: number) {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return this;
  }
  /**
   * Array of x,y,z
   * @returns number[]
   */
  getArray() {
    return [this.x, this.y, this.z];
  }
  /**
   * Float32Array array of x,y,z
   * @returns Float32Array
   */
  getFloatArray() {
    return new Float32Array([this.x, this.y, this.z]);
  }
  /**
   * Clone this vector
   * @returns Vector3
   */
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}
