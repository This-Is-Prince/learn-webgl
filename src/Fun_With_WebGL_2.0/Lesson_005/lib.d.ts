interface WebGL2Context extends WebGL2RenderingContext {
  fClearScreen: () => WebGL2Context;
  fSetSize: (w: number, h: number) => WebGL2Context;
}
export { WebGL2Context };
