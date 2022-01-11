interface WebGL2Context extends WebGL2RenderingContext {
  fClear: () => WebGL2Context;
  fSetSize: (w: number, h: number) => WebGL2Context;
  fCreateArrayBuffer: (
    srcData: BufferSource,
    isStatic?: boolean
  ) => WebGLBuffer;
}
export { WebGL2Context };
