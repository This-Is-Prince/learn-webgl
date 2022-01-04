import { Matrix4 } from "../matrix4";

class PerspectiveCamera {
  private matrix: Matrix4;
  private _fov: number;
  private _aspect: number;
  private _near: number;
  private _far: number;

  set fov(value: number) {
    this._fov = value;
    this.updateMatrix();
  }
  set aspect(value: number) {
    this._aspect = value;
    this.updateMatrix();
  }
  set near(value: number) {
    this._near = value;
    this.updateMatrix();
  }
  set far(value: number) {
    this._far = value;
    this.updateMatrix();
  }
  constructor(fov = 30, aspect = 1, near = 0.1, far = 1000) {
    this._fov = fov;
    this._aspect = aspect;
    this._near = near;
    this._far = far;
    this.matrix = new Matrix4();
    this.updateMatrix();
  }
  private updateMatrix() {
    this.matrix.setPerspectiveProjection(
      this._fov,
      this._aspect,
      this._near,
      this._far
    );
  }
}
