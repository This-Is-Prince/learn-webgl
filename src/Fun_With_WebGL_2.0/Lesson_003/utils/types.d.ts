interface WebGL2Context extends WebGL2RenderingContext {
  fClear: () => WebGL2Context;
  fSetSize: (w: number, h: number) => WebGL2Context;
  fCreateArrayBuffer: (
    srcData: BufferSource,
    isStatic?: boolean
  ) => WebGLBuffer;
  fCreateMeshVAO: (
    name: string,
    indexArray?: number[] | null,
    verticesArray?: number[] | null,
    normalArray?: number[] | null,
    uvArray?: number[] | null
  ) => RTN;
  mMeshCache: {
    [key: string]: any;
  };
}

interface RTN {
  drawMode: number;
  vertexCount?: number;
  indexCount?: number;
  uvBuffer?: WebGLBuffer;
  indexBuffer?: WebGLBuffer;
  normalBuffer?: WebGLBuffer;
  vertexComponentLen?: number;
  verticesBuffer?: WebGLBuffer;
  vao?: WebGLVertexArrayObject;
}

interface AttributeLocation {
  position?: number;
  norm?: number;
  uv?: number;
  [key: string]: number | undefined;
}
interface UniformLocation {
  uPointSize?: WebGLUniformLocation | null;
  uAngle?: WebGLUniformLocation | null;
  [key: string]: WebGLUniformLocation | null | undefined;
}
export { WebGL2Context, RTN, AttributeLocation, UniformLocation };
