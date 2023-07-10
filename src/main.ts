import { glMatrix, mat4, vec3 } from "gl-matrix";
import { GLUtils } from "./gl_utils";
import { indices, normals, vertices } from "./polygons";
import { Shaders } from "./shaders";
import { objMock, parseOBJ } from "./obj";

const obj = parseOBJ(objMock);
console.log(obj);

// Shaders e inicializações do WegbGL
const gl = GLUtils.InitGL();
const canvasWidth = gl.canvas.width;
const canvasHeight = gl.canvas.height;
const aspectRatio = canvasWidth / canvasHeight;

const vertexShader = GLUtils.CreateVertexShader(gl, Shaders.vertex.src);
const fragmentShader = GLUtils.CreateFragmentShader(gl, Shaders.fragment.src);
const program = GLUtils.CreateProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

const normalPointer = GLUtils.CreateArrayBuffer(
  gl,
  program,
  Shaders.vertex.attributes.aNormal,
  normals
);

const posPointer = GLUtils.CreateArrayBuffer(
  gl,
  program,
  Shaders.vertex.attributes.aPos,
  vertices
);

GLUtils.CreateIndexBuffer(gl, indices);

gl.vertexAttribPointer(posPointer, 3, gl.FLOAT, false, 3 * 4, 0);
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

gl.uniform3fv(uLightDirection, [0, -5, -3]);
gl.uniform3fv(uLightColor, [1, 1, 1]);
gl.uniform3fv(uLightPosition, [0, 5, 1]);

var angleX = 0;
var angleY = 0;
var angleZ = 0;
var direction = vec3.fromValues(0, 0, -1);
var target = vec3.fromValues(0, 0, 0);
var cameraPosition = vec3.fromValues(0, 0, 10);

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
      vec3.add(direction, direction, [-1 * 0.1, 0, 0]);
      break;
    case "d":
      vec3.add(direction, direction, [1 * 0.1, 0, 0]);
      break;
  }
});

async function draw() {
  const model = mat4.create();
  const view = mat4.create();
  const projection = mat4.create();

  mat4.rotateX(model, model, angleX);
  mat4.rotateY(model, model, angleY);
  mat4.rotateZ(model, model, angleZ);

  mat4.lookAt(view, cameraPosition, target, [0, 1, 0]);
  mat4.translate(view, view, direction);

  mat4.perspective(projection, glMatrix.toRadian(50), aspectRatio, 0.1, 9999);

  const uModel = gl.getUniformLocation(program, Shaders.vertex.uniforms.uModel);
  const uView = gl.getUniformLocation(program, Shaders.vertex.uniforms.uView);
  const uProjection = gl.getUniformLocation(
    program,
    Shaders.vertex.uniforms.uProjection
  );

  gl.uniformMatrix4fv(uModel, false, model);
  gl.uniformMatrix4fv(uView, false, view);
  gl.uniformMatrix4fv(uProjection, false, projection);

  GLUtils.ClearCanvas(gl);

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  angleX += 0.001;
  angleY += 0.002;
  angleZ += 0.004;
  requestAnimationFrame(draw);
}
