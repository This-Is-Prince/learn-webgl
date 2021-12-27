class WebGLRenderer {
  public canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  constructor(param: { canvas: HTMLCanvasElement }) {
    this.canvas = param.canvas;
    this.gl = this.canvas.getContext("webgl") as WebGLRenderingContext;
    if (!this.gl) {
      throw new Error(`webgl is not supported in your browser...`);
    }
  }
}
