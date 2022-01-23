import { MeshData } from "../lib";
import { Transform } from "../Transform";

class Modal {
  public mesh!: MeshData;
  public transform!: Transform;
  constructor(meshData: MeshData) {
    this.transform = new Transform();
    this.mesh = meshData;
  }
  //Getters/Setters
  setScale(x: number, y: number, z: number) {
    this.transform.scale.set(x, y, z);
    return this;
  }
  setPosition(x: number, y: number, z: number) {
    this.transform.position.set(x, y, z);
    return this;
  }
  setRotation(x: number, y: number, z: number) {
    this.transform.rotation.set(x, y, z);
    return this;
  }

  addScale(x: number, y: number, z: number) {
    this.transform.scale.x += x;
    this.transform.scale.y += y;
    this.transform.scale.z += z;
    return this;
  }
  addPosition(x: number, y: number, z: number) {
    this.transform.position.x += x;
    this.transform.position.y += y;
    this.transform.position.z += z;
    return this;
  }
  addRotation(x: number, y: number, z: number) {
    this.transform.rotation.x += x;
    this.transform.rotation.y += y;
    this.transform.rotation.z += z;
    return this;
  }

  //Things to do before its time to render
  preRender() {
    this.transform.updateMatrix();
    return this;
  }
}
export { Modal };
