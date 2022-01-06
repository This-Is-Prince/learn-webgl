import { Vector3 } from "../../matrix4";
import { BoxGeometry } from "../Box/BoxGeometry";

class Rotation {
  public angle: number;
  public direction: Vector3;
  constructor() {
    this.angle = 0;
    this.direction = new Vector3(0, 1, 0);
  }
}

class Mesh {
  public position: Vector3;
  public rotation: Rotation;
  public scale: Vector3;
  public count: number;
  constructor(public geometry: BoxGeometry) {
    this.position = new Vector3();
    this.rotation = new Rotation();
    this.scale = new Vector3();
    this.count = this.geometry.attributes.index.length;
  }
}

export { Mesh };
