import { Mesh } from "../primitives/Mesh";

class Modal {
  public mesh!: Mesh;
  constructor(mesh: Mesh) {
    this.mesh = mesh;
  }
}

export { Modal };
