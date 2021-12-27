class MeshBasicMaterial {
  public attributes: {
    color: number[];
  };
  constructor() {
    this.attributes = {
      color: [
        // far square
        // left triangle
        100, 100, 100, 100, 100, 100, 100, 100, 100,

        // right triangle
        100, 100, 100, 100, 100, 100, 100, 100, 100,

        // near square
        // left triangle
        50, 50, 50, 50, 50, 50, 50, 50, 50,
        // right triangle
        50, 50, 50, 50, 50, 50, 50, 50, 50,
        // left square
        // left triangle
        150, 150, 150, 150, 150, 150, 150, 150, 150,
        // right triangle
        150, 150, 150, 150, 150, 150, 150, 150, 150,

        // right square
        // left triangle
        200, 200, 200, 200, 200, 200, 200, 200, 200,
        // right triangle
        200, 200, 200, 200, 200, 200, 200, 200, 200,
        // top square
        // left triangle
        0, 200, 200, 0, 200, 200, 0, 200, 200,
        // right triangle
        0, 200, 200, 0, 200, 200, 0, 200, 200,

        // bottom square
        // left square
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        // right square
        0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    };
  }
}
export { MeshBasicMaterial };
