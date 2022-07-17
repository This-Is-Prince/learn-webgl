import { WebGL2Context } from "./utils/types";
import fShaderText from "./shaders/fragment.fs.glsl?raw";
import vShaderText from "./shaders/vertex.vs.glsl?raw";
import { ShaderUtil } from "./utils/Shaders";

let gl: WebGL2Context;

function GLInstance(canvasID: string) {
    const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2") as WebGL2Context;
    if (!gl) {
        console.error("WebGL context is not available.");
        return null;
    }

    // ........................................................
    // Setup GL, Set all the default configurations we need.
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Set clear color

    // ........................................................
    // Methods
    gl.fClear = function () {
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
        return this;
    };

    // ........................................................
    // Setters - Getters

    // Set the size of the canvas html element and the rendering view port
    gl.fSetSize = function (w, h) {
        // Set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.canvas.width = w;
        this.canvas.height = h;
        return this;
    };
    return gl;
}

window.addEventListener("load", function () {
    // ........................................................
    // Get our extended GL Context Object
    gl = (GLInstance("canvas") as WebGL2Context).fSetSize(500, 500).fClear();
    if (!gl) {
        console.error("GL is null");
        return;
    }

    // ........................................................
    // SHADER STEPS
    // 1. Get Vertex and Fragment Shader Text

    // 2. Compile text and validate
    const vShader = ShaderUtil.createShader(gl, vShaderText, gl.VERTEX_SHADER)!;
    if (!vShader) {
        console.error("vShader is null");
        return null;
    }
    const fShader = ShaderUtil.createShader(gl, fShaderText, gl.FRAGMENT_SHADER)!;
    if (!fShader) {
        console.error("fShader is null");
        return null;
    }

    // 3. Link the shaders together as a program.
    const shaderProg = ShaderUtil.createProgram(gl, vShader, fShader, true)!;
    if (!shaderProg) {
        console.error("shaderProg is null");
        return null;
    }

    // 4. Get Location of Uniforms and Attributes.
    gl.useProgram(shaderProg);
    const aPositionLoc = gl.getAttribLocation(shaderProg, "a_position");
    const aPointSizeLoc = gl.getUniformLocation(shaderProg, "uPointSize");
    gl.useProgram(null);

    // ........................................................
    // Set Up Data Buffers
    const aryVerts = new Float32Array([0, 0, 0]);
    const bufVerts = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
    gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
});
