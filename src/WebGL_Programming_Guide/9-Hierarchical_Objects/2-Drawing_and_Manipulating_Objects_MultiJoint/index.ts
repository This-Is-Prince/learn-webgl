import vertexShaderSource from "./shaders/vertex.vs.glsl?raw";
import fragmentShaderSource from "./shaders/fragment.fs.glsl?raw";
import { Renderer } from "./Renderer/WebGLRenderer";
import { Scene } from "./Scene/Scene";
import { PerspectiveCamera } from "./Camera/PerspectiveCamera";
import { BoxGeometry } from "./Box/BoxGeometry";
import { Mesh } from "./Mesh/Mesh";

window.addEventListener("load", () => {
  start();
});
const start = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const renderer = new Renderer({
    canvas,
    fragmentShaderSource,
    vertexShaderSource,
  });
  renderer.setClearColor(0, 0, 0, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.width, canvas.height);

  const scene = new Scene();
  const geometry = new BoxGeometry(1, 1, 1);
  geometry.setAttributes(renderer.gl, renderer.program);

  const arm1 = new Mesh(geometry);
  const arm2 = new Mesh(geometry);
  arm2.position.set(0, 2, 0);
  scene.add(arm1);
  scene.add(arm2);
  const camera = new PerspectiveCamera(
    50,
    canvas.width / canvas.height,
    0.1,
    100
  );
  camera.position.set(3, 3, 7);
  camera.target.set(0, 0, 0);
  camera.up.set(0, 1, 0);

  let prevTime = 0;
  const tick = () => {
    const currTime = Date.now();
    const diff = currTime - prevTime;
    prevTime = currTime;
    arm1.rotation.angle += 45 * diff * 0.001;
    renderer.render(camera, scene);
    // requestAnimationFrame(tick);
  };
  tick();
};
