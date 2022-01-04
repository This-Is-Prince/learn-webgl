import { Matrix4 } from "../matrix4";

interface Attributes {
  vertices: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
}

class BoxGeometry {
  private _width: number;
  private _height: number;
  private _depth: number;
  private attributes: Attributes;
  constructor(width = 1, height = 1, depth = 1) {
    this._width = width;
    this._height = height;
    this._depth = depth;
    this.attributes = {
      vertices: new Float32Array(),
      colors: new Float32Array([
        // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // v0-v3-v4-v5 right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // v0-v5-v6-v1 up
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // v1-v6-v7-v2 left
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // v7-v4-v3-v2 down
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // v4-v7-v6-v5 back
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
      ]),
      normals: new Float32Array([
        // Normal
        // v0-v1-v2-v3 front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        // v0-v3-v4-v5 right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // v0-v5-v6-v1 up
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // v1-v6-v7-v2 left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        // v7-v4-v3-v2 down
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        // v4-v7-v6-v5 back
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
      ]),
    };
  }
  updateVertices() {
    this.attributes.vertices = new Float32Array([
      // v0-v1-v2-v3 front
      this._width,
      this._height,
      this._depth,
      -this._width,
      this._height,
      this._depth,
      -this._width,
      -this._height,
      this._depth,
      this._width,
      -this._height,
      this._depth,
      // v0-v3-v4-v5 right
      this._width,
      this._height,
      this._depth,
      this._width,
      -this._height,
      this._depth,
      this._width,
      -this._height,
      -this._depth,
      this._width,
      this._height,
      -this._depth,
      // v0-v5-v6-v1 up
      this._width,
      this._height,
      this._depth,
      this._width,
      this._height,
      -this._depth,
      -this._width,
      this._height,
      -this._depth,
      -this._width,
      this._height,
      this._depth,
      // v1-v6-v7-v2 left
      -this._width,
      this._height,
      this._depth,
      -this._width,
      this._height,
      -this._depth,
      -this._width,
      -this._height,
      -this._depth,
      -this._width,
      -this._height,
      this._depth,
      // v7-v4-v3-v2 down
      -this._width,
      -this._height,
      -this._depth,
      this._width,
      -this._height,
      -this._depth,
      this._width,
      -this._height,
      this._depth,
      -this._width,
      -this._height,
      this._depth,
      // v4-v7-v6-v5 back
      this._width,
      -this._height,
      -this._depth,
      -this._width,
      -this._height,
      -this._depth,
      -this._width,
      this._height,
      -this._depth,
      this._width,
      this._height,
      -this._depth,
    ]);
  }
}

export { BoxGeometry };
