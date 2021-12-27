class Vector3 {
  private _x: number;
  private _y: number;
  private _z: number;
  constructor(_x?: number, _y?: number, _z?: number) {
    this._x = _x || 0;
    this._y = _y || 0;
    this._z = _z || 0;
  }
  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
  }
  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
  }
  get z(): number {
    return this._z;
  }
  set z(value: number) {
    this._z = value;
  }
  set(x: number, y: number, z: number) {
    this._x = x;
    this._y = y;
    this._z = z;
  }
}
export { Vector3 };
