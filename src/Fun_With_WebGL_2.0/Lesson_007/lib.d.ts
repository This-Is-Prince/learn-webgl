import { Mesh } from "./primitives/Mesh";

interface StandardAttribLoc {
  position: number;
  norm: number;
  uv: number;
}
interface StandardUniformLoc {
  perspective: WebGLUniformLocation | null;
  modalMatrix: WebGLUniformLocation | null;
  cameraMatrix: WebGLUniformLocation | null;
  mainTexture: WebGLUniformLocation | null;
}

interface WebGL2Context extends WebGL2RenderingContext {
  meshes: {
    [key: string]: Mesh;
  };
  fClearScreen: () => WebGL2Context;
  fCreateArrayBuffer: (
    srcData: BufferSource,
    isStatic?: boolean
  ) => WebGLBuffer;

  fCreateMesh: (
    name: string,
    indices?: number[] | null,
    vertices?: number[] | null,
    normals?: number[] | null,
    uv?: number[] | null
  ) => Mesh;

  fSetSize: (w: number, h: number) => WebGL2Context;
  fFitScreen: (wp?: number, hp?: number) => WebGL2Context;
}

export { WebGL2Context, StandardAttribLoc, StandardUniformLoc };
