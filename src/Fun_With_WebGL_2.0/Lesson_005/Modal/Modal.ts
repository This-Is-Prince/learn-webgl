import { MeshData } from "../lib";

class Modal {
  public mesh!: MeshData;
  constructor(meshData: MeshData) {
    this.mesh = meshData;
  }
  preRender() {}
}

export { Modal };
