import { glMatrix, mat4, vec3 } from "gl-matrix";
import { GLUtils } from "./gl_utils";
import { cubeIndices, initCube, setUniformsToCube } from "./cube";

/* for each shape
gl.useProgram(program for shape) (if different from last shape)
setup attributes for shape (if different from last shape)
set uniforms
  set a matrix uniform to position and orient the shape
  set a color uniform for the color
drawArrays/drawElements */

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

const program2 = initCube(gl);

const program = initCube(gl);

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
  }
});

async function draw() {
  GLUtils.ClearCanvas(gl);

  let model = mat4.create();
  const view = mat4.create();
  const projection = mat4.create();

  mat4.rotateX(model, model, angleX);
  mat4.rotateY(model, model, angleY);
  mat4.rotateZ(model, model, angleZ);

  mat4.lookAt(view, cameraPosition, target, [0, 1, 0]);
  mat4.translate(view, view, direction);

  mat4.perspective(projection, glMatrix.toRadian(50), aspectRatio, 0.1, 9999);

  gl.useProgram(program);
  setUniformsToCube(gl, program, cameraPosition, model, view, projection);
  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

  model = mat4.create();
  mat4.translate(model, model, [0, 3, 0]);

  mat4.rotateX(model, model, angleX);
  mat4.rotateY(model, model, angleY);
  mat4.rotateZ(model, model, angleZ);

  gl.useProgram(program2);
  setUniformsToCube(gl, program2, cameraPosition, model, view, projection);

  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

  angleX += 0.001;
  angleY += 0.002;
  angleZ += 0.004;

  requestAnimationFrame(draw);
}

/* for each shape
gl.useProgram(program for shape) (if different from last shape)
setup attributes for shape (if different from last shape)
set uniforms
  set a matrix uniform to position and orient the shape
  set a color uniform for the color
drawArrays/drawElements */

/* const vertexShader = GLUtils.CreateVertexShader(gl, Shaders.vertex.src);
const fragmentShader = GLUtils.CreateFragmentShader(gl, Shaders.fragment.src);
const program = GLUtils.CreateProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

const normalPointer = GLUtils.CreateArrayBuffer(
  gl,
  program,
  Shaders.vertex.attributes.aNormal,
  cubeNormals
);

const posPointer = GLUtils.CreateArrayBuffer(
  gl,
  program,
  Shaders.vertex.attributes.aPos,
  cubeVertices
);

gl.vertexAttribPointer(posPointer, 3, gl.FLOAT, false, 0, 0);
gl.vertexAttribPointer(normalPointer, 3, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(posPointer);
gl.enableVertexAttribArray(normalPointer);

const uLightDirection = gl.getUniformLocation(
  program,
  Shaders.fragment.uniforms.uLightDirection
);

const uLightColor = gl.getUniformLocation(
  program,
  Shaders.fragment.uniforms.uLightColor
);

const uLightPosition = gl.getUniformLocation(
  program,
  Shaders.vertex.uniforms.uLightPosition
);

const uCameraPosition = gl.getUniformLocation(
  program,
  Shaders.vertex.uniforms.uCameraPosition
);

gl.uniform3fv(uLightDirection, [0, -5, -3]);
gl.uniform3fv(uLightColor, [1, 1, 1]);
gl.uniform3fv(uLightPosition, [0, 5, 1]);
gl.uniform3fv(uCameraPosition, cameraPosition);
 */
