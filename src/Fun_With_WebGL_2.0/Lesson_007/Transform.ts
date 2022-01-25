import { Matrix4, Vector3 } from "../Lesson_006/utils/Math";

class Transform {
  public position!: Vector3;
  public scale!: Vector3;
  public rotation!: Vector3;
  public matView!: Matrix4;
  public matNormal!: Float32Array;
  public forward!: Float32Array;
  public up!: Float32Array;
  public right!: Float32Array;

  static deg2Rad = Math.PI / 180;

  constructor() {
    this.position = new Vector3(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);
    this.rotation = new Vector3(0, 0, 0);
    this.matView = new Matrix4();
    this.matNormal = new Float32Array(9);

    // Direction Vectors
    this.forward = new Float32Array(4); // When rotating, keep track of what the forward direction is
    this.up = new Float32Array(4); // what the up direction is, invert to get bottom
    this.right = new Float32Array(4); // what the right direction is, invert to get left
  }

  updateMatrix() {
    this.matView
      .reset() // Order is very important
      .vtranslate(this.position)
      .rotateX(this.rotation.x * Transform.deg2Rad)
      .rotateZ(this.rotation.z * Transform.deg2Rad)
      .rotateY(this.rotation.y * Transform.deg2Rad)
      .vscale(this.scale);

    Matrix4.normalMat3(this.matNormal, this.matView.mat);

    Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.mat);
    Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.mat);
    Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.mat);

    return this.matView.mat;
  }

  updateDirection() {
    Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.mat);
    Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.mat);
    Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.mat);
    return this;
  }

  getViewMatrix() {
    return this.matView.mat;
  }

  getNormalMatrix() {
    return this.matNormal;
  }

  reset() {
    this.position.set(0, 0, 0);
    this.scale.set(1, 1, 1);
    this.rotation.set(0, 0, 0);
  }
}

export { Transform };
