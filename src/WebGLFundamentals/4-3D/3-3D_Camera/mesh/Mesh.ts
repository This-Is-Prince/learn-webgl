import { BoxGeometry } from "../geometry/BoxGeometry";
import { MeshBasicMaterial } from "../material/MeshBasicMaterial";
import { Vector3 } from "../utils/Vec3";

class Mesh {
  private _position: Vector3;
  private _scale: Vector3;
  constructor(
    public geometry: BoxGeometry,
    public material: MeshBasicMaterial
  ) {
    this._position = new Vector3();
    this._scale = new Vector3();
  }
  get position(): Vector3 {
    return this._position;
  }
  set position(position: Vector3) {
    this._position = position;
  }
  get scale(): Vector3 {
    return this._scale;
  }
  set scale(scale: Vector3) {
    this._scale = scale;
  }
}
export { Mesh };
