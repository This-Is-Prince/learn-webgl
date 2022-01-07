window.addEventListener("load", () => {
  start();
});
const start = () => {
  // Retrieve the <canvas> Element
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    console.error("Failed to retrieve the <canvas> element");
    return false;
  }
  updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));
  window.addEventListener("resize", () => {
    updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));
    drawRectangle(ctx);
  });

  // Get the rendering context for 2DCG
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) {
    console.error(`can't get 2d context`);
    return false;
  }
  // Draw a blue rectangle
  drawRectangle(ctx);
  return true;
};

/**
 *
 * @param canvas canvas element
 * @param pixelRatio pixel ratio of screen
 */
const updateCanvasResolution = (
  canvas: HTMLCanvasElement,
  pixelRatio: number
) => {
  const { clientWidth, clientHeight } = canvas;
  canvas.width = (clientWidth * pixelRatio) | 0;
  canvas.height = (clientHeight * pixelRatio) | 0;
};

const drawRectangle = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "rgba(0, 255, 255, 1.0)";
  ctx.fillRect(120, 10, 150, 150);
};
