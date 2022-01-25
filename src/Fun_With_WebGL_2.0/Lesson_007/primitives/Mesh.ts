class Attribute {
  constructor(public buffer: WebGLBuffer) {}
}

class Vertices extends Attribute {
  constructor(
    buffer: WebGLBuffer,
    public count: number,
    public totalComponent: number
  ) {
    super(buffer);
  }
}

class Normals extends Attribute {
  constructor(buffer: WebGLBuffer) {
    super(buffer);
  }
}
class Uv extends Attribute {
  constructor(buffer: WebGLBuffer) {
    super(buffer);
  }
}
class Indices extends Attribute {
  constructor(buffer: WebGLBuffer, public count: number) {
    super(buffer);
  }
}

class Mesh {
  public attributes: {
    [key: string]: Attribute;
  };
  constructor(public drawMode: number, public vao: WebGLVertexArrayObject) {
    this.attributes = {};
  }
  setVertices(buffer: WebGLBuffer, count: number, totalComponent: number) {
    this.attributes["vertices"] = new Vertices(buffer, count, totalComponent);
  }
  setIndices(buffer: WebGLBuffer, count: number) {
    this.attributes["indices"] = new Indices(buffer, count);
  }
  setNormals(buffer: WebGLBuffer) {
    this.attributes["indices"] = new Normals(buffer);
  }
  setUv(buffer: WebGLBuffer) {
    this.attributes["indices"] = new Uv(buffer);
  }
}
export { Mesh, Attribute, Indices, Normals, Uv, Vertices };
