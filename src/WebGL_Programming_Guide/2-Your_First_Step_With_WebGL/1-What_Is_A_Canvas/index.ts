window.addEventListener("load", () => {
  main();
});

const main = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Failed to retrieve the <canvas> element`);
  }
  const { clientHeight, clientWidth } = canvas;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  console.log(canvas.width, canvas.height);

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) {
    throw new Error(`2d is not supported in your browser`);
  }
  ctx.fillStyle = "rgba(0, 0, 255, 1.0)";
  ctx.fillRect(120, 10, 150, 150);
};
