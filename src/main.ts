import { GLUtils } from "./gl_utils";
import { Mat } from "./mat";
import { Polygons } from "./polygons";
import { multiply, transpose, flatten } from "mathjs";

const gl = GLUtils.InitGL();
const aspectRatio = gl.canvas.width / gl.canvas.height;

var ANGLE = 0;

const vertexShaderSrc = document.getElementById("vertex-shader")!.innerText;
const fragmentShaderSrc = document.getElementById("fragment-shader")!.innerText;
const vertexShader = GLUtils.CreateVertexShader(gl, vertexShaderSrc);
const fragmentShader = GLUtils.CreateFragmentShader(gl, fragmentShaderSrc);
const program = GLUtils.CreateProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

let camera = Mat.createCamera([5, 5, 5], [0, 0, 0], [5, 6, 5]);

main();

async function main() {
  const textures = await GLUtils.LoadTextures([
    "../assets/gato.png",
    "../assets/catioro.png",
  ]);

  const positionPointer = GLUtils.CreateArrayBuffer(
    gl,
    program,
    "external_position",
    Polygons.Cube.vertices
  );

  gl.enableVertexAttribArray(positionPointer);

  // prettier-ignore
  gl.vertexAttribPointer(
    positionPointer,
    3,                       // quantidade de dados em cada processamento
    gl.FLOAT,                // tipo de cada dado (tamanho)
    false,                   // normalizar
    Polygons.Cube.blockSize, // tamanho do bloco
    0                        // salto inicial
  );

  const textureCoordPointer = GLUtils.CreateArrayBuffer(
    gl,
    program,
    "external_texture_coord",
    Polygons.Cube.vertices
  );
  gl.enableVertexAttribArray(textureCoordPointer);

  // prettier-ignore
  gl.vertexAttribPointer(
    textureCoordPointer,
    2,                       // quantidade de dados em cada processamento
    gl.FLOAT,                // tipo de cada dado (tamanho)
    false,                   // normalizar
    Polygons.Cube.blockSize, // tamanho do bloco
    3 * 4                    // salto inicial
  );

  const rotate = Mat.createRotationMatrix(0, 0, ANGLE);
  const projPerspective = Mat.createPerspective(20, aspectRatio, 1, 50);

  let transform = multiply(rotate, camera);
  transform = multiply(projPerspective, transform);
  transform = transpose(transform);
  const transformArray = flatten(transform).toArray() as number[];

  // Aplicando transaformação
  const uTransform = gl.getUniformLocation(program, "external_transform");
  gl.uniformMatrix4fv(uTransform, false, transformArray);

  // Criando e linkando as texturas
  const uTextureSrcPointer = gl.getUniformLocation(program, "texture_src");

  const texture0 = gl.createTexture()!;
  GLUtils.LinkTexture(gl, texture0, gl.TEXTURE0, textures[0]);

  const texture1 = gl.createTexture()!;
  GLUtils.LinkTexture(gl, texture1, gl.TEXTURE1, textures[1]);

  GLUtils.ClearCanvas(gl);

  // Compartilhando vértices
  gl.uniform1i(uTextureSrcPointer, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.drawArrays(gl.TRIANGLES, 2, 3);

  gl.uniform1i(uTextureSrcPointer, 1);
  gl.drawArrays(gl.TRIANGLES, 5, 3);
  gl.drawArrays(gl.TRIANGLES, 7, 3);

  gl.uniform1i(uTextureSrcPointer, 0);
  gl.drawArrays(gl.TRIANGLES, 10, 3);
  gl.uniform1i(uTextureSrcPointer, 1);
  gl.drawArrays(gl.TRIANGLES, 12, 3);

  ANGLE++;
  requestAnimationFrame(main);
}
