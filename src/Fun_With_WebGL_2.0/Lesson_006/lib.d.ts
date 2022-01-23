interface MeshData {
  drawMode: number;
  vao: WebGLVertexArrayObject;

  verticesBuffer?: WebGLBuffer;
  vertexComponentLen?: number;
  vertexCount?: number;

  normalsBuffer?: WebGLBuffer;

  uvBuffer?: WebGLBuffer;

  indicesBuffer?: WebGLBuffer;
  indexCount?: number;
}
interface MeshesData {
  [key: string]: MeshData;
}

interface WebGL2Context extends WebGL2RenderingContext {
  fClearScreen: () => WebGL2Context;
  fSetSize: (w: number, h: number) => WebGL2Context;
  fCreateArrayBuffer: (
    srcData: BufferSource,
    isStatic?: boolean
  ) => WebGLBuffer;
  fCreateMeshVAO: (
    name: string,
    indices?: number[] | null,
    vertices?: number[] | null,
    normals?: number[] | null,
    uv?: number[] | null
  ) => MeshData;
  meshesData: MeshesData;
}

interface Attribute {
  name: string;
  location: number;
}
interface Attributes {
  position: Attribute;
  normal: Attribute;
  uv: Attribute;
}

interface StandardAttribLoc {
  position: number;
  norm: number;
  uv: number;
  [key: string]: number;
}
interface StandardUniformLoc {
  [key: string]: WebGLUniformLocation;
}

export {
  Attribute,
  Attributes,
  MeshData,
  MeshesData,
  WebGL2Context,
  StandardAttribLoc,
  StandardUniformLoc,
};
