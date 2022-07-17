interface WebGL2Context extends WebGL2RenderingContext {
    fClear: () => WebGL2Context;
    fSetSize: (w: number, h: number) => WebGL2Context;
}

export { WebGL2Context };