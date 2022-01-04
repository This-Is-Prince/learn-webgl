interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

class Material {
  private _color: Color;
  constructor(color: Color = { r: 1, g: 1, b: 1, a: 1 }) {
    this._color = color;
  }
}
export { Material };
