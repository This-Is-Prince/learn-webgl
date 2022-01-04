import { Matrix4, Vector3 } from "../matrix4";
import { BoxGeometry } from "./BoxGeometry";
import { Material } from "./Materials";

class Position {
  constructor(public x = 0, public y = 0, public z = 0) {}
}
class Rotation {
  constructor(public x = 0, public y = 0, public z = 0) {}
}
class Scale {
  constructor(public x = 0, public y = 0, public z = 0) {}
}

class Mesh {
  private modelMatrix: Matrix4;
  public position: Position;
  public rotation: Rotation;
  public scale: Scale;

  constructor(public geometry: BoxGeometry, public material: Material) {
    this.position = new Position();
    this.rotation = new Rotation();
    this.scale = new Scale();
    this.modelMatrix = new Matrix4();
  }
}
