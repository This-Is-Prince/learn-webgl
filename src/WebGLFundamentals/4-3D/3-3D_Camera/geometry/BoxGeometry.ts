class BoxGeometry {
  public attributes: {
    position: number[];
  };
  constructor(
    private width: number,
    private height: number,
    private depth: number
  ) {
    let x = 100 * this.width,
      y = 100 * this.height,
      z = 100 * this.depth;
    this.attributes = {
      position: [
        // far square
        // left triangle
        -x,
        y,
        -z,
        x,
        y,
        -z,
        -x,
        -y,
        -z,
        // right triangle
        x,
        y,
        -z,
        x,
        -y,
        -z,
        -x,
        -y,
        -z,

        // near square
        // left triangle
        -x,
        y,
        z,
        -x,
        -y,
        z,
        x,
        y,
        z,
        // right triangle
        x,
        y,
        z,
        -x,
        -y,
        z,
        x,
        -y,
        z,
        // left square
        // left triangle
        -x,
        y,
        -z,
        -x,
        -y,
        -z,
        -x,
        y,
        z,
        // right triangle
        -x,
        y,
        z,
        -x,
        -y,
        -z,
        -x,
        -y,
        z,

        // right square
        // left triangle
        x,
        y,
        z,
        x,
        -y,
        z,
        x,
        y,
        -z,
        // right triangle
        x,
        y,
        -z,
        x,
        -y,
        z,
        x,
        -y,
        -z,
        // top square
        // left triangle
        -x,
        y,
        -z,
        -x,
        y,
        z,
        x,
        y,
        -z,
        // right triangle
        x,
        y,
        -z,
        -x,
        y,
        z,
        x,
        y,
        z,

        // bottom square
        // left square
        -x,
        -y,
        z,
        -x,
        -y,
        -z,
        x,
        -y,
        z,
        // right square
        x,
        -y,
        z,
        -x,
        -y,
        -z,
        x,
        -y,
        -z,
      ],
    };
  }
}

export { BoxGeometry };
