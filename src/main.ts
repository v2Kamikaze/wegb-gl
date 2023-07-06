import { GLUtils } from "./gl_utils";

const BLOCK_SIZE = 4 * 4;
var ANGLE = 0;

main();

async function main() {
  const textures = await GLUtils.LoadTextures([
    "../assets/gato.png",
    "../assets/catioro.png",
  ]);

  const gl = GLUtils.InitGL();

  const vertexShaderSrc = document.getElementById("vertex-shader")!.innerText;
  const fragmentShaderSrc =
    document.getElementById("fragment-shader")!.innerText;

  const vertexShader = GLUtils.CreateVertexShader(gl, vertexShaderSrc);
  const fragmentShader = GLUtils.CreateFragmentShader(gl, fragmentShaderSrc);
  const program = GLUtils.CreateProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  // prettier-ignore
  const triangle = Float32Array.from([
  //  X     Y   TX   TY
   -0.5,  0.5, 0.0, 0.0,
   -0.5, -0.5, 0.0, 1.0,
    0.5, -0.5, 1.0, 1.0,
    0.5,  0.5, 1.0, 0.0,
   -0.5,  0.5, 0.0, 0.0,
]);

  const positionPointer = GLUtils.CreateArrayBuffer(
    gl,
    program,
    "external_position",
    triangle
  );

  gl.enableVertexAttribArray(positionPointer);

  // prettier-ignore
  gl.vertexAttribPointer(
    positionPointer,
    2,          // quantidade de dados em cada processamento
    gl.FLOAT,   // tipo de cada dado (tamanho)
    false,      // normalizar
    BLOCK_SIZE, // tamanho do bloco
    0           // salto inicial
  );

  const textureCoordPointer = GLUtils.CreateArrayBuffer(
    gl,
    program,
    "external_texture_coord",
    triangle
  );
  gl.enableVertexAttribArray(textureCoordPointer);

  // prettier-ignore
  gl.vertexAttribPointer(
    textureCoordPointer,
    2,          // quantidade de dados em cada processamento
    gl.FLOAT,   // tipo de cada dado (tamanho)
    false,      // normalizar
    BLOCK_SIZE, // tamanho do bloco
    2 * 4       // salto inicial
  );

  // Aplicando transaformação
  const uTransform = gl.getUniformLocation(program, "external_transform");
  gl.uniformMatrix4fv(uTransform, false, RotateMat(ANGLE));

  // Criando e linkando as texturas
  const uTextureSrcPointer = gl.getUniformLocation(program, "texture_src");

  const texture0 = gl.createTexture()!;
  GLUtils.LinkTexture(gl, texture0, gl.TEXTURE0, textures[0]);

  const texture1 = gl.createTexture()!;
  GLUtils.LinkTexture(gl, texture1, gl.TEXTURE1, textures[1]);

  GLUtils.SetAndClearCanvas(gl);

  // Compartilhando vértices
  gl.uniform1i(uTextureSrcPointer, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.uniform1i(uTextureSrcPointer, 1);
  gl.drawArrays(gl.TRIANGLES, 2, 3);

  ANGLE += 10;
  requestAnimationFrame(main);
}

function RotateMat(angle: number) {
  const cos = Math.cos((angle * Math.PI) / 180);
  const sin = Math.sin((angle * Math.PI) / 180);
  // prettier-ignore
  const ratationMat = [
    cos, -sin, 0, 0,
    sin,  cos, 0, 0,
    0,    0,   1, 0,
    0,    0,   0, 1,
  ];

  return ratationMat;
}
