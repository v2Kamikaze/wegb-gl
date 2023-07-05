import { GLUtils } from "./gl_utils";

const BLOCK_SIZE = 6 * 4;

const gl = GLUtils.InitGL();

const vertexShaderSrc = document.getElementById("vertex-shader")!.innerText;
const fragmentShaderSrc = document.getElementById("fragment-shader")!.innerText;

const vertexShader = GLUtils.CreateVertexShader(gl, vertexShaderSrc);
const fragmentShader = GLUtils.CreateFragmentShader(gl, fragmentShaderSrc);
const program = GLUtils.CreateProgram(gl, vertexShader, fragmentShader);

gl.useProgram(program);

// prettier-ignore
const triangle = Float32Array.from([
    0.0,  0.25, 1.0, 0.0, 0.0, 0.5,
  -0.25, -0.25, 0.0, 1.0, 0.0, 0.8,
   0.25, -0.25, 0.0, 0.0, 1.0, 0.2,
]);


const positionPointer = GLUtils.CreateArrayBuffer(gl, program, "external_position", triangle);

gl.enableVertexAttribArray(positionPointer);

gl.vertexAttribPointer(
  positionPointer,
  2, // quantidade de dados em cada processamento
  gl.FLOAT, // tipo de cada dado (tamanho)
  false, // normalizar
  BLOCK_SIZE, // tamanho do bloco
  0 // salto inicial
);

const colorPointer = GLUtils.CreateArrayBuffer(gl, program, "external_color", triangle);
gl.enableVertexAttribArray(colorPointer);

gl.vertexAttribPointer(
  colorPointer,
  4, // quantidade de dados em cada processamento
  gl.FLOAT, // tipo de cada dado (tamanho)
  false, // normalizar
  BLOCK_SIZE, // tamanho do bloco
  2 * 4 // salto inicial
);


GLUtils.ClearCanvas(gl);

gl.drawArrays(gl.TRIANGLES, 0, 3);



