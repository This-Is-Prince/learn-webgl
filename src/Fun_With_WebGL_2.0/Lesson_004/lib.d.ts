interface MeshData {
  drawMode: number;
  vao: WebGLVertexArrayObject;

  vertexCount?: number;
  vertexComponentLen?: number;
  verticesBuffer?: WebGLBuffer;

  normalsBuffer?: WebGLBuffer;
  uvBuffer?: WebGLBuffer;

  indexCount?: number;
  indexBuffer?: WebGLBuffer;
}

interface MeshesData {
  [key: string]: MeshData;
}

interface WebGL2Context extends WebGL2RenderingContext {
  meshesData: MeshesData;
  _ClearScreen: () => WebGL2Context;
  _SetSize: (w: number, h: number) => WebGL2Context;
  _CreateArrayBuffer: (srcData: BufferSource, isStatic: boolean) => WebGLBuffer;
  _CreateMeshVAO: (
    name: string,
    indexArray?: number[],
    vertexArray?: number[],
    normalArray?: number[],
    uvArray?: number[]
  ) => MeshData;
}
export { WebGL2Context, MeshesData, MeshData };
