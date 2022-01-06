import { Vector3 } from "../../matrix4";

class PerspectiveCamera {
  public position: Vector3;
  public target: Vector3;
  public up: Vector3;
  constructor(
    public fov: number,
    public aspect: number,
    public near = 0.1,
    public far = 1000
  ) {
    this.position = new Vector3(0, 0, 0);
    this.target = new Vector3(0, 0, -100);
    this.up = new Vector3(0, 1, 0);
  }
}
export { PerspectiveCamera };
