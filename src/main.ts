import { GLUtils } from "./gl_utils";

const gl = GLUtils.InitGL();

const vertexShaderSrc = document.getElementById("vertex-shader")!.innerText;
const fragmentShaderSrc = document.getElementById("fragment-shader")!.innerText;

const vertexShader = GLUtils.CreateVertexShader(gl, vertexShaderSrc);
const fragmentShader = GLUtils.CreateFragmentShader(gl, fragmentShaderSrc);
const program = GLUtils.CreateProgram(gl, vertexShader, fragmentShader);

gl.useProgram(program);

const triangle = Float32Array.from([0.0, 0.25, -0.25, -0.25, 0.25, -0.25]);

const bufferPointer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPointer);
gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);
const positionPointer = gl.getAttribLocation(program, "position");

gl.enableVertexAttribArray(positionPointer);

gl.vertexAttribPointer(
  positionPointer,
  2, // quantidade de dados em cada processamento
  gl.FLOAT, // tipo de cada dado (tamanho)
  false, // normalizar
  2 * 4, // tamanho do bloco
  0 // salto inicial
);

GLUtils.ClearCanvas(gl);

gl.drawArrays(gl.TRIANGLES, 0, 3);
