import { glMatrix, mat4, vec3, vec4 } from "gl-matrix";
import { GLUtils } from "./gl_utils";
import { cubeIndices, initCube, setUniformsToCube } from "./cube";
import {
  cubeTextureIndices,
  initCubeTexture,
  setUniformsToCubeTexture,
} from "./cube_texture";
import { moveCallback } from "./input";

const textures = await GLUtils.LoadTextures([
  "../assets/caixa.jpg",
  "../assets/catioro.png",
  "../assets/gato.png",
]);

const mouseSensibilityRange = document.getElementById(
  "sensibility"
) as HTMLInputElement;

const lightColorInput = document.getElementById(
  "light-color"
) as HTMLInputElement;

let sensibility = 0.1;
let angleX = 0;
let angleY = 0;
let angleZ = 0;
let cameraPosition = vec3.fromValues(0, 0, 20);
let cameraFront = vec3.fromValues(0, 0, -1.0);
let yaw = -90;
let pitch = 0;
let fovy = 45;

const gl = GLUtils.InitGL();
const canvasWidth = gl.canvas.width;
const canvasHeight = gl.canvas.height;
const aspectRatio = canvasWidth / canvasHeight;

const textureBox = gl.createTexture()!;
GLUtils.LinkTexture(gl, textureBox, gl.TEXTURE0, textures[0]);
const textureDog = gl.createTexture()!;
GLUtils.LinkTexture(gl, textureDog, gl.TEXTURE1, textures[1]);
const textureCat = gl.createTexture()!;
GLUtils.LinkTexture(gl, textureCat, gl.TEXTURE2, textures[2]);

const programCubeTextBox = initCubeTexture(gl);
const programCubeTextCat = initCubeTexture(gl);
const programCubeTextDog = initCubeTexture(gl);
const programCube1 = initCube(gl);
const programCube2 = initCube(gl);

let lightColor = vec3.fromValues(1, 1, 1);
const lightPosition = vec3.fromValues(0, 0, 0);
const lightDirection = vec3.fromValues(0, 2, -1);
const up = vec3.fromValues(0, 1, 0);

GLUtils.CreateIndexBuffer(gl, cubeIndices);

let lastX = gl.canvas.width / 2;
let lastY = gl.canvas.height / 2;

draw();

lightColorInput.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  const color = target.value;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d")!;

  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);

  const imageData = context.getImageData(0, 0, 1, 1);
  const rgba = imageData.data;

  const r = rgba[0];
  const g = rgba[1];
  const b = rgba[2];
  lightColor = vec3.fromValues(r / 255, g / 255, b / 255);
});

mouseSensibilityRange.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  sensibility = target.valueAsNumber;
});

gl.canvas.addEventListener("mouseenter", () => {
  const canvas = gl.canvas as HTMLCanvasElement;
  const rect = canvas.getBoundingClientRect();
  const canvasCenterX = rect.left + rect.width / 2;
  const canvasCenterY = rect.top + rect.height / 2;

  lastX = canvasCenterX;
  lastY = canvasCenterY;
});

gl.canvas.addEventListener("mousemove", (e) => {
  let event = e as MouseEvent;
  const { clientX: xPos, clientY: yPos } = event;

  let xOffset = xPos - lastX;
  let yOffset = lastY - yPos;

  lastX = xPos;
  lastY = yPos;

  xOffset *= sensibility;
  yOffset *= sensibility;

  yaw += xOffset;
  pitch += yOffset;

  if (pitch > 179.0) {
    pitch = 179.0;
  }

  if (pitch < -179.0) {
    pitch = -179.0;
  }

  const front = vec3.create();
  front[0] =
    Math.cos(glMatrix.toRadian(yaw)) * Math.cos(glMatrix.toRadian(pitch));
  front[1] = Math.sin(glMatrix.toRadian(pitch));
  front[2] =
    Math.sin(glMatrix.toRadian(yaw)) * Math.cos(glMatrix.toRadian(pitch));

  cameraFront = vec3.normalize(vec3.create(), front);
});

gl.canvas.addEventListener("wheel", (e) => {
  let event = e as WheelEvent;
  fovy += event.deltaY / 50;
  if (fovy < 10.0) fovy = 10.0;
  if (fovy > 90.0) fovy = 90.0;
});

document.addEventListener("keydown", (e) =>
  moveCallback(e, cameraPosition, cameraFront, up)
);

async function draw() {
  GLUtils.ClearCanvas(gl);

  let view = mat4.create();
  const projection = mat4.create();
  mat4.perspective(projection, glMatrix.toRadian(fovy), aspectRatio, 0.1, 9999);

  mat4.lookAt(
    view,
    cameraPosition,
    vec3.add(vec3.create(), cameraPosition, cameraFront),
    up
  );

  lightPosition[0] = 5 * Math.cos(Date.now() * 0.001);

  drawCubeBasic(
    programCube1,
    view,
    projection,
    [0, -3, 0],
    [0.6, 0.6, 0.6, 1.0],
    [10, 0.2, 10]
  );

  drawCubeBasic(programCube2, view, projection, [3, 0, 0]);
  drawTextureCube(programCubeTextBox, view, projection, [-3, 0, 0], 0);
  drawTextureCube(programCubeTextCat, view, projection, [-3, 3, 0], 1);
  drawTextureCube(programCubeTextDog, view, projection, [3, 3, 0], 2);

  angleX += 0.001;
  angleY += 0.002;
  angleZ += 0.004;

  requestAnimationFrame(draw);
}

function drawCubeBasic(
  program: WebGLProgram,
  view: mat4,
  projection: mat4,
  positon: vec3,
  color: vec4 = [1, 1, 1, 1],
  scale: vec3 = [1, 1, 1]
) {
  const model = mat4.create();
  mat4.translate(model, model, positon);

  if (scale !== null) {
    mat4.scale(model, model, scale);
  }

  gl.useProgram(program);
  setUniformsToCube(
    gl,
    program,
    cameraPosition,
    model,
    view,
    projection,
    lightDirection,
    lightColor,
    lightPosition,
    color
  );
  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
}

function drawTextureCube(
  program: WebGLProgram,
  view: mat4,
  projection: mat4,
  positon: vec3,
  texture: number
) {
  const model = mat4.create();
  mat4.translate(model, model, positon);
  mat4.rotateX(model, model, angleX);
  mat4.rotateY(model, model, angleY);
  mat4.rotateZ(model, model, angleZ);

  gl.useProgram(program);
  setUniformsToCubeTexture(
    gl,
    program,
    cameraPosition,
    model,
    view,
    projection,
    lightDirection,
    lightColor,
    lightPosition,
    texture
  );

  gl.drawElements(
    gl.TRIANGLES,
    cubeTextureIndices.length,
    gl.UNSIGNED_SHORT,
    0
  );
}
