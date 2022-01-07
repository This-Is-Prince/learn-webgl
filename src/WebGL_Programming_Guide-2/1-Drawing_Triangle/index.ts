window.addEventListener("load", () => {
  start();
});
const start = () => {
  // Retrieve the <canvas> Element
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return false;
  }
  updateCanvasResolution(canvas, Math.min(window.devicePixelRatio, 2));

  // Get the rendering context for 2DCG
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) {
    console.log(`can't get 2d context`);
  }
  // Draw a blue rectangle
  ctx.fillStyle = "rgba(0, 0, 255, 1.0)";
  ctx.fillRect(120, 10, 150, 150);
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
