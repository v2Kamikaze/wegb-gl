import { glMatrix, mat4, vec3, vec4 } from "gl-matrix";
import { GLUtils } from "./gl_utils";
import { cubeIndices, initCube, setUniformsToCube } from "./cube";
import {
  cubeTextureIndices,
  initCubeTexture,
  setUniformsToCubeTexture,
} from "./cube_texture";

const textures = await GLUtils.LoadTextures([
  "../assets/catioro.png",
  "../assets/gato.png",
]);

var angleX = 0;
var angleY = 0;
var angleZ = 0;
var direction = vec3.fromValues(0, 0, -1);
var target = vec3.fromValues(0, 0, 0);
var cameraPosition = vec3.fromValues(0, 0, 10);

const gl = GLUtils.InitGL();
const canvasWidth = gl.canvas.width;
const canvasHeight = gl.canvas.height;
const aspectRatio = canvasWidth / canvasHeight;

const textureCachorro = gl.createTexture()!;
GLUtils.LinkTexture(gl, textureCachorro, gl.TEXTURE0, textures[0]);
const textureGato = gl.createTexture()!;
GLUtils.LinkTexture(gl, textureGato, gl.TEXTURE0, textures[1]);

const programCubeText = initCubeTexture(gl);
const programCube1 = initCube(gl);
const programCube2 = initCube(gl);

const lightDirection = vec3.fromValues(0, 5, -3);
const lightColor = vec3.fromValues(1, 1, 1);
const lightPosition = vec3.fromValues(0.4, 0, 1);
const up = vec3.fromValues(0, 1, 0);

let model = mat4.create();
const view = mat4.create();
const projection = mat4.create();

mat4.lookAt(view, cameraPosition, target, up);
mat4.translate(view, view, direction);
mat4.perspective(projection, glMatrix.toRadian(60), aspectRatio, 0.1, 9999);

GLUtils.CreateIndexBuffer(gl, cubeIndices);

draw();

document.addEventListener("keydown", (e) => {
  const keyPressed = e.key.toLowerCase();
  switch (keyPressed) {
    case "w":
      vec3.add(direction, direction, [0, 0, 1]);
      break;
    case "s":
      vec3.add(direction, direction, [0, 0, -1]);
      break;
    case "a":
      vec3.add(direction, direction, [0.1, 0, 0]);
      break;
    case "d":
      vec3.add(direction, direction, [-0.1, 0, 0]);
      break;
    case "q":
      vec3.add(direction, direction, [0, -0.1, 0]);
      break;
    case "e":
      vec3.add(direction, direction, [0, 0.1, 0]);
      break;
  }
});

async function draw() {
  GLUtils.ClearCanvas(gl);
  mat4.lookAt(view, cameraPosition, target, up);
  mat4.translate(view, view, direction);

  lightPosition[0] = 5 * Math.cos(Date.now() * 0.001);

  drawCube1();
  drawCube2();

  drawCubeText();

  angleX += 0.001;
  angleY += 0.002;
  angleZ += 0.004;

  requestAnimationFrame(draw);
}

function drawCube1() {
  model = mat4.create();
  mat4.translate(model, model, [0, -3, 0]);
  mat4.scale(model, model, [10, 0.5, 10]);

  gl.useProgram(programCube1);
  setUniformsToCube(
    gl,
    programCube1,
    cameraPosition,
    model,
    view,
    projection,
    lightDirection,
    lightColor,
    lightPosition
  );
  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
}

function drawCube2() {
  model = mat4.create();
  mat4.translate(model, model, [3, 0, 0]);

  gl.useProgram(programCube2);
  setUniformsToCube(
    gl,
    programCube2,
    cameraPosition,
    model,
    view,
    projection,
    lightDirection,
    lightColor,
    lightPosition,
    vec4.fromValues(0.5, 0.7, 0.8, 1.0)
  );

  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
}

function drawCubeText() {
  model = mat4.create();
  mat4.translate(model, model, [-3, 1, 0]);
  mat4.rotateX(model, model, angleX);
  mat4.rotateY(model, model, angleY);
  mat4.rotateZ(model, model, angleZ);

  gl.useProgram(programCubeText);
  setUniformsToCubeTexture(
    gl,
    programCubeText,
    cameraPosition,
    model,
    view,
    projection,
    lightDirection,
    lightColor,
    lightPosition,
    0
  );

  gl.drawElements(
    gl.TRIANGLES,
    cubeTextureIndices.length,
    gl.UNSIGNED_SHORT,
    0
  );
}
